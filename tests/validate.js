#!/usr/bin/env node
/* Content and wiring checks for SecurityPrep. No dependencies: run with `node tests/validate.js` (or `npm test`).
 * Exits with a non-zero status if anything FAILS. WARN lines are advice and do not fail the run.
 *
 * Checks: every catalog domain/objective has notes, terms, an assignment and enough questions; question shapes are valid for
 * their type; ids are unique; renamed-id aliases point at real questions; every content file is loaded by index.html and cached
 * by sw.js; and the PenTest+ objective titles match CompTIA's published objectives (tests/official-pt0-003.json). */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
let fails = 0, warns = 0;
const fail = (m) => { fails++; console.log('FAIL  ' + m); };
const warn = (m) => { warns++; console.log('WARN  ' + m); };

/* ---- load the catalog and every content file into one sandbox, the same way the page does */
const sandbox = { console, crypto: require('crypto').webcrypto, TextEncoder, TextDecoder, btoa, atob, escape, unescape, performance };
sandbox.window = sandbox;
vm.createContext(sandbox);
const order = ['js/catalog.js'];
fs.readdirSync(path.join(root, 'js/content')).filter((f) => f.endsWith('.js') && f !== 'pbq.js').sort().forEach((f) => order.push('js/content/' + f));
order.push('js/content/pbq.js', 'js/migrations.js');
const labFiles = ['core.js'].concat(fs.readdirSync(path.join(root, 'js/labs')).filter((f) => /^content-.*\.js$/.test(f)).sort());
labFiles.forEach((f) => order.push('js/labs/' + f));
order.forEach((f) => {
  try { vm.runInContext(read(f), sandbox, { filename: f }); } catch (e) { fail('could not load ' + f + ': ' + e.message); }
});
const CT = sandbox.CT;
if (!CT) { console.log('Cannot continue without the catalog.'); process.exit(1); }

/* ---- html tag balance in notes */
const balanced = (html) => ['ul', 'ol', 'li', 'p', 'b', 'em', 'h3', 'h4', 'table', 'tr', 'td', 'th'].every((t) => {
  const o = (html.match(new RegExp('<' + t + '(\\s[^>]*)?>', 'g')) || []).length, c = (html.match(new RegExp('</' + t + '>', 'g')) || []).length;
  return o === c;
});

const allIds = new Map();
const MIN_Q = 8, MIN_TERMS = 8;

CT.exams.forEach((ex) => {
  ex.domains.forEach((d) => {
    const tag = ex.id + ' ' + d.id;
    const c = CT.content_for(ex.id, d.id);
    if (!c) { warn(tag + ': domain has no content registered yet'); return; }
    const objIds = d.objectives.map((o) => o.id);
    if (!objIds.length) fail(tag + ': content exists but the catalog lists no objectives');
    if (!c.capstone || !c.capstone.id || !c.capstone.tasks || !c.capstone.tasks.length) fail(tag + ': missing capstone');
    d.objectives.forEach((o) => {
      const t = tag + ' ' + o.id;
      if (!c.notes || !c.notes[o.id]) fail(t + ': no notes');
      else {
        if (c.notes[o.id].length < 400) warn(t + ': notes are very short');
        if (!balanced(c.notes[o.id])) fail(t + ': unbalanced HTML tags in notes');
      }
      const terms = (c.terms && c.terms[o.id]) || [];
      if (!terms.length) fail(t + ': no key terms'); else if (terms.length < MIN_TERMS) warn(t + ': only ' + terms.length + ' key terms');
      const seen = new Set();
      terms.forEach((tm) => { if (!tm[0] || !tm[1]) fail(t + ': empty term or definition'); if (seen.has(tm[0])) warn(t + ': duplicate term "' + tm[0] + '"'); seen.add(tm[0]); });
      const a = c.assignments && c.assignments[o.id];
      if (!a) fail(t + ': no assignment');
      else if (!a.id || !a.scenario || !a.tasks || a.tasks.length < 3 || !a.rubric || !a.rubric.length || !a.deliverable) fail(t + ': assignment is incomplete');
    });
    Object.keys(c.notes || {}).forEach((k) => { if (!objIds.includes(k)) fail(tag + ': notes for unknown objective ' + k); });
    Object.keys(c.terms || {}).forEach((k) => { if (!objIds.includes(k)) fail(tag + ': terms for unknown objective ' + k); });
    Object.keys(c.assignments || {}).forEach((k) => { if (!objIds.includes(k)) fail(tag + ': assignment for unknown objective ' + k); });

    const qs = CT.questions({ exam: ex.id, dom: d.id });
    const perObj = {};
    qs.forEach((q) => {
      const t = tag + ' ' + q.id;
      if (allIds.has(q.id)) fail(t + ': duplicate question id (also in ' + allIds.get(q.id) + ')'); else allIds.set(q.id, tag);
      if (!objIds.includes(q.obj)) { fail(t + ': unknown objective ' + q.obj); return; }
      perObj[q.obj] = (perObj[q.obj] || 0) + 1;
      if (!q.q || !q.explain) fail(t + ': missing question text or explanation');
      switch (q.type) {
        case 'single':
        case 'multi': {
          if (!Array.isArray(q.options) || q.options.length < 4) { fail(t + ': needs at least 4 options'); break; }
          if (new Set(q.options.map((x) => x.trim().toLowerCase())).size !== q.options.length) fail(t + ': duplicate option text');
          if (q.type === 'single') { if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) fail(t + ': answer index out of range'); }
          else if (!Array.isArray(q.answer) || q.answer.length < 2 || q.answer.some((x) => !Number.isInteger(x) || x < 0 || x >= q.options.length) || new Set(q.answer).size !== q.answer.length || q.answer.length >= q.options.length) fail(t + ': invalid multi-select answer');
          break;
        }
        case 'match': {
          if (!Array.isArray(q.pairs) || q.pairs.length < 3) { fail(t + ': needs at least 3 pairs'); break; }
          const rights = q.pairs.map((p) => p[1]);
          if (new Set(rights).size !== rights.length) fail(t + ': duplicate right-hand values make matching ambiguous');
          break;
        }
        case 'order': {
          if (!Array.isArray(q.steps) || q.steps.length < 3) fail(t + ': needs at least 3 steps');
          else if (new Set(q.steps).size !== q.steps.length) fail(t + ': duplicate steps');
          break;
        }
        case 'sort': {
          if (!Array.isArray(q.categories) || q.categories.length < 2) { fail(t + ': needs at least 2 categories'); break; }
          if (!Array.isArray(q.items) || q.items.length < 3) { fail(t + ': needs at least 3 items'); break; }
          q.items.forEach((it) => { if (!q.categories.includes(it.c)) fail(t + ': item "' + it.t + '" has a category that is not listed'); });
          const used = new Set(q.items.map((i) => i.c));
          if (used.size < 2) fail(t + ': all items share one category');
          break;
        }
        default: fail(t + ': unknown question type "' + q.type + '"');
      }
      if (q.exhibit !== undefined && (typeof q.exhibit !== 'string' || !q.exhibit.trim())) fail(t + ': empty exhibit');
    });
    d.objectives.forEach((o) => {
      const n = perObj[o.id] || 0;
      if (!n) fail(tag + ' ' + o.id + ': no questions'); else if (n < MIN_Q) warn(tag + ' ' + o.id + ': only ' + n + ' questions (aim for ' + MIN_Q + '+)');
    });
  });
});

/* ---- extra questions must point at a real exam and domain */
Object.keys(CT.extra || {}).forEach((k) => {
  const [e, d] = k.split('-');
  if (!CT.domain(e, d)) fail('extra questions registered for unknown domain ' + k);
  else if (!CT.content_for(e, d)) fail('extra questions registered for ' + k + ' but the domain has no content');
});

/* ---- id aliases */
Object.keys(CT.idAliases || {}).forEach((old) => {
  const target = CT.idAliases[old];
  if (target && !allIds.has(target)) fail('alias ' + old + ' -> ' + target + ' points at a question that does not exist');
});

/* ---- every content file is loaded by index.html and cached by sw.js */
const html = read('index.html'), sw = read('sw.js');
['js/app.js', 'js/catalog.js', 'js/migrations.js', 'js/labs/ui.js'].concat(fs.readdirSync(path.join(root, 'js/labs')).filter((f) => f.endsWith('.js') && f !== 'ui.js').map((f) => 'js/labs/' + f)).concat(fs.readdirSync(path.join(root, 'js/content')).filter((f) => f.endsWith('.js')).map((f) => 'js/content/' + f)).forEach((f) => {
  if (!html.includes('src="' + f + '"')) fail('index.html does not load ' + f);
  if (f !== 'js/app.js' && !sw.includes("'./" + f + "'")) fail('sw.js does not cache ./' + f);
});
if (!sw.includes("'./js/app.js'")) fail('sw.js does not cache ./js/app.js');

/* ---- PenTest+ objectives versus the published CompTIA objectives */
try {
  const off = JSON.parse(read('tests/official-pt0-003.json'));
  const ex = CT.exam(off.exam);
  const pending = off.pendingDomains || [];
  ex.domains.forEach((d) => {
    const officialIds = Object.keys(off.objectives).filter((k) => k.split('.')[0] === String(d.n));
    const mine = d.objectives.map((o) => o.id);
    const same = officialIds.length === mine.length && officialIds.every((k) => mine.includes(k));
    const titlesOk = same && d.objectives.every((o) => o.title === off.objectives[o.id]);
    if (same && titlesOk) return;
    const msg = ex.name + ' ' + d.id + ': objectives do not match CompTIA (' + mine.length + ' here, ' + officialIds.length + ' official)';
    if (pending.includes(d.id)) warn(msg + ' [known gap]'); else fail(msg);
  });
} catch (e) { fail('could not check official PenTest+ objectives: ' + e.message); }

/* ---- labs ---- */
async function labChecks() {
  const labs = CT.labs ? CT.labs.list : []; const C = CT.labsCore; let solved = 0;
  if (!labs.length) { warn('no labs registered'); return; }
  let solutions = {}; try { solutions = require('./lab-solutions.js'); } catch (e) { fail('could not load tests/lab-solutions.js: ' + e.message); }
  const ENGINES = ['shell', 'firewall', 'config', 'pcap', 'crypto', 'email', 'classify'];
  const ids = new Set();
  for (const lab of labs) {
    const t = 'lab ' + lab.id;
    if (ids.has(lab.id)) fail(t + ': duplicate id'); ids.add(lab.id);
    if (ENGINES.indexOf(lab.engine) < 0) { fail(t + ': unknown engine ' + lab.engine); continue; }
    ['title', 'summary', 'level', 'debrief'].forEach((k) => { if (!lab[k]) fail(t + ': missing ' + k); });
    if (!lab.minutes) fail(t + ': missing minutes');
    if (!Array.isArray(lab.briefing) || !lab.briefing.length) fail(t + ': missing briefing');
    if (!lab.objectives || !lab.objectives.length) fail(t + ': no objectives'); else lab.objectives.forEach((o) => {
      const ex = CT.exam(o.exam), dom = ex && CT.domain(o.exam, o.dom);
      if (!dom || !dom.objectives.some((x) => x.id === o.obj)) fail(t + ': objective ' + o.exam + ' ' + o.dom + ' ' + o.obj + ' does not exist');
    });
    if (!Array.isArray(lab.tasks) || lab.tasks.length < 3) { fail(t + ': needs at least 3 tasks'); continue; }
    const tids = new Set();
    lab.tasks.forEach((k) => {
      if (tids.has(k.id)) fail(t + ': duplicate task id ' + k.id); tids.add(k.id);
      if (!k.text) fail(t + ' ' + k.id + ': no text');
      if (k.type === 'answer') { if (!k.accept) fail(t + ' ' + k.id + ': no accept list'); if (!k.hint) warn(t + ' ' + k.id + ': no hint'); }
      else if (k.type === 'choice') { if (!Array.isArray(k.options) || k.options.length < 3 || !(k.answer >= 0 && k.answer < k.options.length) || !k.explain) fail(t + ' ' + k.id + ': invalid choice task'); }
      else if (k.type === 'state') { if (typeof k.check !== 'function') fail(t + ' ' + k.id + ': no check function'); }
      else fail(t + ' ' + k.id + ': unknown task type ' + k.type);
    });
    /* build the starting state */
    let data; try { data = typeof lab.data === 'function' ? await lab.data() : lab.data; } catch (e) { fail(t + ': data() threw: ' + e.message); continue; }
    const sol = solutions[lab.id]; if (!sol) { fail(t + ': no entry in tests/lab-solutions.js'); continue; }
    let ctx0, ctx1, outs = [];
    try {
      switch (lab.engine) {
        case 'shell': {
          ctx0 = { sh: C.makeShell(data.shell) }; ctx1 = { sh: C.makeShell(data.shell) };
          for (const cmd of sol.run) { const r = await ctx1.sh.run(cmd); outs.push(r.out); if (r.err && /command not found|No such file|unsupported|invalid/.test(r.err)) fail(t + ': solution command failed: ' + cmd + ' -> ' + r.err.trim()); }
          break;
        }
        case 'firewall': ctx0 = C.fwContext(data, data.rules); ctx1 = C.fwContext(data, sol.rules); break;
        case 'config': ctx0 = C.configContext(data, data.text); ctx1 = C.configContext(data, sol.text); break;
        case 'email': {
          ctx0 = { result: null };
          const flags = {}; data.indicators.forEach((i) => { if (i.bad) flags[i.id] = true; });
          const st = { flags, verdict: data.verdict, action: data.action }; ctx1 = { st, result: C.emailResult(data, st) };
          const ids2 = new Set([].concat(data.headers.map((h) => h.id), data.body.map((b) => b.id)));
          data.indicators.forEach((i) => { if (!ids2.has(i.id)) fail(t + ': indicator ' + i.id + ' matches no element'); if (!i.why) fail(t + ': indicator ' + i.id + ' has no explanation'); });
          ids2.forEach((id) => { if (!data.indicators.some((i) => i.id === id)) fail(t + ': element ' + id + ' has no indicator entry'); });
          if (!data.indicators.some((i) => !i.bad)) warn(t + ': no decoy (normal) elements');
          if (!data.verdictOptions.some((o) => o[0] === data.verdict) || !data.actionOptions.some((o) => o[0] === data.action)) fail(t + ': verdict or action not among the options');
          const wrong = { flags: {}, verdict: '', action: '' }; if (C.emailResult(data, wrong).flagsOk) fail(t + ': empty analysis is accepted');
          break;
        }
        case 'classify': {
          ctx0 = { result: null }; const ans = {}; data.items.forEach((i) => { ans[i.id] = i.correct; });
          ctx1 = { answers: ans, result: C.classifyResult(data, ans) };
          const vals = new Set(data.options.map((o) => o[0])); data.items.forEach((i) => { if (!vals.has(i.correct)) fail(t + ': item ' + i.id + ' has a correct value that is not an option'); if (!i.explain) fail(t + ': item ' + i.id + ' has no explanation'); });
          if (C.classifyResult(data, {}).allOk) fail(t + ': empty answers are accepted');
          break;
        }
        case 'pcap': {
          ctx0 = {}; ctx1 = {};
          if (!data.packets || data.packets.length < 50) fail(t + ': too few packets');
          (data.presets || []).forEach((p) => { const r = C.pcapFilter(p[1]); if (r.error) fail(t + ': preset "' + p[0] + '" is invalid: ' + r.error); else if (!data.packets.some(r.f)) fail(t + ': preset "' + p[0] + '" matches nothing'); });
          break;
        }
        case 'crypto': ctx0 = {}; ctx1 = {}; break;
      }
    } catch (e) { fail(t + ': could not simulate: ' + e.message); continue; }

    /* nothing may be complete before the learner does anything */
    for (const k of lab.tasks) if (k.type === 'state') { let r = false; try { r = !!k.check(ctx0, data); } catch (e) { fail(t + ' ' + k.id + ': check threw on the starting state: ' + e.message); } if (r) fail(t + ' ' + k.id + ': is already complete before the learner does anything'); }
    /* apply the independent solution */
    let allGood = true;
    for (const k of lab.tasks) {
      if (k.type === 'state') { let r = false; try { r = !!k.check(ctx1, data); } catch (e) { r = false; } if (!r) { allGood = false; fail(t + ' ' + k.id + ': not satisfied by the reference solution'); } }
      else if (k.type === 'answer') {
        const fn = sol.answers && sol.answers[k.id]; if (!fn) { allGood = false; fail(t + ' ' + k.id + ': no reference answer in tests/lab-solutions.js'); continue; }
        let given; try { given = String(fn(lab.engine === 'shell' ? outs : data, data)); } catch (e) { allGood = false; fail(t + ' ' + k.id + ': reference answer threw: ' + e.message); continue; }
        const accept = typeof k.accept === 'function' ? await k.accept(data, ctx1) : k.accept;
        const okMatch = k.set ? C.matchesSet(accept, given) : C.matches(accept, given);
        if (!okMatch) { allGood = false; fail(t + ' ' + k.id + ': the reference answer "' + given + '" is not accepted (accepted: ' + JSON.stringify(accept) + ')'); }
        if (C.matches(accept, '') || C.matches(accept, 'zzzz not an answer')) fail(t + ' ' + k.id + ': accepts an empty or nonsense answer');
      }
    }
    if (allGood) solved++;
  }
  console.log('Labs: ' + labs.length + ' registered, ' + solved + ' solved by their reference solutions');
}

/* ---- summary ---- */
function summary() {
const total = CT.questions({}).length;
console.log('\n' + CT.exams.map((e) => e.name + ': ' + CT.questions({ exam: e.id }).length + ' questions').join(' | ') + ' | total ' + total);
console.log(fails ? fails + ' failure(s), ' + warns + ' warning(s)' : 'OK: no failures, ' + warns + ' warning(s)');
process.exit(fails ? 1 : 0);
}
labChecks().then(summary).catch((e) => { fail('lab checks crashed: ' + (e && e.stack || e)); summary(); });
