/* Lab sandbox UI: lab list, lab page, task panel, and one renderer per engine.
 * Everything runs in the browser against simulated data. The app passes in a small api (state, save, toast, esc, on, nav). */
(function () {
  'use strict';
  const CT = window.CT, C = CT.labsCore, L = CT.labs;
  const ENGINE = { shell: 'Terminal', firewall: 'Firewall', config: 'Config editor', pcap: 'Packet analysis', crypto: 'Crypto', email: 'Email analysis', classify: 'Decisions' };
  const examName = (id) => (CT.exam(id) || { name: id }).name;
  let LF = 'all';

  const shuffleIdx = (n) => { const a = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  /* ------------------------------------------------------------------ progress helpers */
  function prog(api, id, create) {
    const S = api.state(); if (!S.labs || typeof S.labs !== 'object') S.labs = {};
    if (!S.labs[id] && create) S.labs[id] = { done: {}, started: Date.now(), completed: 0 };
    return S.labs[id] || { done: {}, completed: 0 };
  }
  L.stats = function (S) { const l = (S && S.labs) || {}; return { done: L.list.filter((x) => l[x.id] && l[x.id].completed).length, total: L.list.length }; };
  L.related = function (exam, obj, esc, S) {
    const list = L.forObjective(exam, obj); if (!list.length) return '';
    const st = (S && S.labs) || {};
    return '<div class="card" style="margin-top:1rem"><h3>Practice this in a lab</h3><div class="list">' + list.map((l) => {
      const p = st[l.id]; const n = p ? Object.keys(p.done || {}).length : 0;
      return '<a class="item" href="#/labs/' + l.id + '"><div><div class="t">' + esc(l.title) + '</div><div class="s">' + esc(ENGINE[l.engine]) + ' · ' + esc(l.level) + ' · about ' + l.minutes + ' min</div></div><span class="pill ' + (p && p.completed ? 'ok' : '') + '">' + (p && p.completed ? 'Done ✓' : n ? n + '/' + l.tasks.length : 'Start') + '</span></a>';
    }).join('') + '</div></div>';
  };

  /* ------------------------------------------------------------------ lab list */
  L.view = function (parts, api) {
    if (!parts[0] || !L.byId[parts[0]]) return listView(api);
    return openLab(L.byId[parts[0]], api);
  };
  function listView(api) {
    const esc = api.esc, S = api.state();
    const list = L.list.filter((l) => LF === 'all' || l.objectives.some((o) => o.exam === LF));
    const st = L.stats(S);
    api.app.innerHTML = '<h1>Labs</h1><p class="lead">Hands-on practice in a safe sandbox. Read logs in a simulated terminal, write firewall rules, analyze a packet capture, harden a config file, and judge a phishing email. Each lab checks your work automatically.</p>' +
      '<div class="callout tip"><b>Safe by design</b>Everything runs inside your browser against fake systems and fictional data. Nothing here touches your computer, your network or any real system, and no real attack tools are used.</div>' +
      '<div class="row between" style="margin:1rem 0"><div class="tabs" role="group" aria-label="Filter labs by exam" style="margin:0"><button class="tab ' + (LF === 'all' ? 'active' : '') + '" aria-pressed="' + (LF === 'all') + '" data-act="labFilter" data-id="all">All labs</button>' +
      CT.exams.map((e) => '<button class="tab ' + (LF === e.id ? 'active' : '') + '" aria-pressed="' + (LF === e.id) + '" data-act="labFilter" data-id="' + e.id + '">' + esc(e.name) + '</button>').join('') + '</div><span class="lead">' + st.done + ' of ' + st.total + ' labs completed</span></div>' +
      '<div class="grid c2">' + list.map((l) => {
        const p = prog(api, l.id, false), n = Object.keys(p.done || {}).length, pc = Math.round(100 * n / l.tasks.length);
        const exams = Array.from(new Set(l.objectives.map((o) => o.exam)));
        return '<a class="card lab-card" href="#/labs/' + l.id + '"><div class="row between"><h3 style="margin:0">' + esc(l.title) + '</h3>' + (p.completed ? '<span class="pill ok">Done ✓</span>' : n ? '<span class="pill warn">In progress</span>' : '') + '</div>' +
          '<p class="lead" style="margin:.5rem 0">' + esc(l.summary) + '</p><div class="row" style="gap:.4rem;margin-bottom:.6rem"><span class="pill soon">' + esc(ENGINE[l.engine]) + '</span><span class="pill">' + esc(l.level) + '</span><span class="pill">~' + l.minutes + ' min</span>' + exams.map((e) => '<span class="pill">' + esc(examName(e)) + '</span>').join('') + '</div>' +
          '<div class="bar ' + (p.completed ? 'green' : '') + '"><span style="width:' + pc + '%"></span></div></a>';
      }).join('') + '</div>';
    api.on('labFilter', (t) => { LF = t.dataset.id; listView(api); });
  }

  /* ------------------------------------------------------------------ lab page */
  async function openLab(lab, api) {
    const esc = api.esc, app = api.app;
    app.innerHTML = '<p class="lead">Preparing the lab…</p>';
    let data; try { data = typeof lab.data === 'function' ? await lab.data() : (lab.data || {}); } catch (e) { app.innerHTML = '<div class="card empty">Could not build this lab: ' + esc(e.message) + '</div>'; return; }
    if (location.hash.indexOf('#/labs/' + lab.id) !== 0) return;
    const run = { lab, data, api, ctx: {}, draft: {}, order: {} };
    app.innerHTML = '<div class="crumbs"><a href="#/labs">Labs</a>›<span>' + esc(lab.title) + '</span></div><h1>' + esc(lab.title) + '</h1>' +
      '<div class="row" style="gap:.4rem;margin:-.2rem 0 1rem"><span class="pill soon">' + esc(ENGINE[lab.engine]) + '</span><span class="pill">' + esc(lab.level) + '</span><span class="pill">~' + lab.minutes + ' min</span><button class="btn sm jump-tasks" id="jumpTasks" type="button">Jump to tasks ↓</button></div>' +
      '<div class="lab-grid"><div class="lab-main"><div class="card"><h3>Briefing</h3>' + lab.briefing.map((b) => '<p>' + esc(b) + '</p>').join('') + '</div>' +
      '<div class="card lab-work" style="margin-top:1rem"><div class="row between" style="margin-bottom:.6rem"><h3 style="margin:0">Workspace</h3><button class="btn sm ghost" id="labReset">Reset workspace</button></div><div id="labHost"></div></div></div>' +
      '<aside class="lab-side"><div class="card" id="labTasks"></div><div id="labDone"></div></aside></div>' +
      '<div class="row" style="margin-top:1.2rem"><a class="btn" href="#/labs">‹ All labs</a></div>';
    const host = app.querySelector('#labHost');
    const eng = engines[lab.engine];
    const mount = () => { run.ctx = eng.mount(host, run) || {}; };
    run.changed = () => evalState(run);
    mount();
    app.querySelector('#labReset').addEventListener('click', () => { mount(); });
    app.querySelector('#jumpTasks').addEventListener('click', () => { const t = app.querySelector('#labTasks'); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    renderTasks(run);
    app.querySelector('#labTasks').addEventListener('submit', (e) => { e.preventDefault(); const f = e.target.closest('form[data-task]'); if (f) submitTask(run, f); });
    app.querySelector('#labTasks').addEventListener('click', (e) => { const b = e.target.closest('[data-choice]'); if (b) submitTask(run, b.closest('[data-task]')); });
    app.querySelector('#labTasks').addEventListener('input', (e) => { const i = e.target.closest('input[type=text]'); if (i) run.draft[i.closest('[data-task]').dataset.task] = i.value; });
  }

  function evalState(run) {
    const p = prog(run.api, run.lab.id, false); let changed = false;
    run.lab.tasks.forEach((t) => { if (t.type !== 'state' || p.done[t.id]) return; let ok = false; try { ok = !!t.check(run.ctx, run.data); } catch (e) { ok = false; } if (ok) { markDone(run, t.id, true); changed = true; } });
    if (changed) renderTasks(run);
  }
  function markDone(run, id, quiet) {
    const api = run.api, p = prog(api, run.lab.id, true);
    if (p.done[id]) return; p.done[id] = Date.now(); api.touch();
    const all = run.lab.tasks.every((t) => p.done[t.id]);
    if (all && !p.completed) { p.completed = Date.now(); api.toast('Lab complete: ' + run.lab.title); } else if (!quiet) api.toast('Task complete');
    api.save();
  }
  async function submitTask(run, form) {
    const id = form.dataset.task, task = run.lab.tasks.find((t) => t.id === id), fb = form.querySelector('.fb'); let ok = false;
    if (task.type === 'answer') {
      const raw = form.querySelector('input[type=text]').value;
      let accept; try { accept = typeof task.accept === 'function' ? await task.accept(run.data, run.ctx) : task.accept; } catch (e) { accept = []; }
      ok = task.set ? C.matchesSet(accept, raw) : C.matches(accept, raw);
      if (!raw.trim()) { fb.textContent = 'Type an answer first.'; fb.className = 'fb bad'; return; }
    } else if (task.type === 'choice') {
      const sel = form.querySelector('input[type=radio]:checked'); if (!sel) { fb.textContent = 'Choose an option first.'; fb.className = 'fb bad'; return; }
      ok = +sel.value === task.answer;
    }
    if (ok) { markDone(run, id); renderTasks(run); } else { fb.textContent = task.type === 'choice' ? 'Not quite. Think again and try another option.' : 'Not quite. Check your work and try again (use the hint if you are stuck).'; fb.className = 'fb bad'; }
  }
  function renderTasks(run) {
    const esc = run.api.esc, lab = run.lab, p = prog(run.api, lab.id, false), n = lab.tasks.filter((t) => p.done[t.id]).length;
    const panel = run.api.app.querySelector('#labTasks'); if (!panel) return;
    panel.innerHTML = '<h3>Tasks <small class="lead">(' + n + '/' + lab.tasks.length + ')</small></h3><div class="bar ' + (n === lab.tasks.length ? 'green' : '') + '"><span style="width:' + Math.round(100 * n / lab.tasks.length) + '%"></span></div><ol class="tasks">' +
      lab.tasks.map((t, i) => {
        const done = !!p.done[t.id]; let body = '';
        if (t.type === 'answer' && !done) body = '<form data-task="' + t.id + '" class="ans"><input type="text" autocomplete="off" aria-label="Answer for task ' + (i + 1) + '" placeholder="Your answer" value="' + esc(run.draft[t.id] || '') + '"><button class="btn sm primary" type="submit">Check</button><span class="fb" role="status"></span></form>';
        if (t.type === 'choice') body = done ? '<p class="lead small">' + esc(t.explain) + '</p>' : '<div data-task="' + t.id + '" class="choice">' + (run.order[t.id] || (run.order[t.id] = shuffleIdx(t.options.length))).map((k) => '<label class="rad"><input type="radio" name="c_' + t.id + '" value="' + k + '"><span>' + esc(t.options[k]) + '</span></label>').join('') + '<button class="btn sm primary" type="button" data-choice="1">Check</button> <span class="fb" role="status"></span></div>';
        if (t.type === 'state' && !done) body = '<p class="lead small">Checked automatically as you work in the workspace.</p>';
        const hint = t.hint && !done ? '<details class="hint"><summary>Hint</summary><p>' + esc(t.hint) + '</p></details>' : '';
        return '<li class="task-item ' + (done ? 'done' : '') + '"><div class="tt"><span class="mark" aria-hidden="true">' + (done ? '✓' : (i + 1)) + '</span><span>' + esc(t.text) + (done ? '<span class="sr"> (complete)</span>' : '') + '</span></div>' + body + hint + '</li>';
      }).join('') + '</ol>';
    const doneEl = run.api.app.querySelector('#labDone');
    if (doneEl) {
      const next = L.list[(L.list.indexOf(lab) + 1) % L.list.length];
      doneEl.innerHTML = p.completed ? '<div class="card" style="margin-top:1rem;border-color:var(--green)"><h3>Lab complete ✓</h3><p>' + esc(lab.debrief) + '</p>' + (next && next !== lab ? '<a class="btn primary" href="#/labs/' + next.id + '">Next lab: ' + esc(next.title) + '</a>' : '') + '</div>' : '';
    }
  }

  /* ------------------------------------------------------------------ engines */
  const engines = {};

  /* ---- terminal ---- */
  engines.shell = {
    mount(host, run) {
      const sh = C.makeShell(run.data.shell), ctx = { sh };
      host.innerHTML = '<div class="term"><div class="term-out" role="log" aria-live="polite" aria-label="Terminal output"></div><div class="term-line"><span class="prompt"></span><input class="term-in" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Command line"></div></div>' +
        '<p class="lead small" style="margin:.5rem 0 0">Simulated Linux shell. Type <code>help</code> to list commands. ↑/↓ recall history, Tab completes, Ctrl+L clears.</p>';
      const out = host.querySelector('.term-out'), inp = host.querySelector('.term-in'), pr = host.querySelector('.prompt');
      const print = (t, cls) => { if (!t) return; const d = document.createElement('div'); d.className = 'tl ' + (cls || ''); d.textContent = String(t).replace(/\n$/, ''); out.appendChild(d); out.scrollTop = out.scrollHeight; };
      pr.textContent = sh.prompt(); print('Sandbox shell. Nothing here touches your real computer. Type help to begin.', 'dim');
      let hi = -1, busy = false;
      inp.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); if (busy) return; const line = inp.value; inp.value = ''; hi = -1; print(sh.prompt() + line, 'cmd'); busy = true;
          const r = await sh.run(line); busy = false; if (r.clear) out.innerHTML = ''; print(r.out); print(r.err, 'err'); pr.textContent = sh.prompt(); run.changed();
        } else if (e.key === 'ArrowUp') { e.preventDefault(); if (!sh.history.length) return; hi = hi < 0 ? sh.history.length - 1 : Math.max(0, hi - 1); inp.value = sh.history[hi]; }
        else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < 0) return; hi++; if (hi >= sh.history.length) { hi = -1; inp.value = ''; } else inp.value = sh.history[hi]; }
        else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); out.innerHTML = ''; }
        else if (e.key === 'Tab') {
          e.preventDefault(); const v = inp.value, sp = v.lastIndexOf(' '), tok = v.slice(sp + 1), head = v.slice(0, sp + 1); let cands = [];
          if (sp < 0) cands = sh.commands.filter((c) => c.indexOf(tok) === 0);
          else { const si = tok.lastIndexOf('/'), dir = si >= 0 ? tok.slice(0, si + 1) : '', base = tok.slice(si + 1); cands = sh.list(dir || '.').filter((n) => n.indexOf(base) === 0).map((n) => dir + n); }
          if (cands.length === 1) inp.value = head + cands[0] + (cands[0].slice(-1) === '/' ? '' : ' '); else if (cands.length > 1) print(cands.join('  '), 'dim');
        }
      });
      host.querySelector('.term').addEventListener('click', () => { if (!String(window.getSelection())) inp.focus(); });
      return ctx;
    }
  };

  /* ---- firewall ---- */
  engines.firewall = {
    mount(host, run) {
      const esc = run.api.esc, d = run.data; const st = { rules: d.rules.map((r) => Object.assign({}, r)) }; const ctx = { rules: st.rules, results: {}, constraints: {}, constraintsOk: false };
      host.innerHTML = '<div class="fw-wrap"><div><h4 style="margin:0 0 .4rem">Rules (first match wins)</h4><div class="fw-rules" id="fwRules"></div><div class="row" style="margin-top:.6rem"><button class="btn sm" data-fw="add">+ Add rule</button><button class="btn sm ghost" data-fw="reset">Reset rules</button></div></div>' +
        '<div><h4 style="margin:0 0 .4rem">Test traffic</h4><div id="fwTests" class="fw-tests"></div><h4 style="margin:1rem 0 .4rem">Rule-set checks</h4><ul class="plain" id="fwCons"></ul></div></div>';
      const rulesEl = host.querySelector('#fwRules'), testsEl = host.querySelector('#fwTests'), consEl = host.querySelector('#fwCons');
      const drawRules = () => {
        rulesEl.innerHTML = '<div class="fw-row fw-head" aria-hidden="true"><span>#</span><span>Action</span><span>Proto</span><span>Source</span><span>Destination</span><span>Port</span><span></span></div>' + st.rules.map((r, i) => {
          const err = C.fwRuleError(r);
          return '<div class="fw-row" data-i="' + i + '"><span class="n">' + (i + 1) + '</span>' +
            '<select data-f="action" aria-label="Rule ' + (i + 1) + ' action"><option ' + (r.action === 'allow' ? 'selected' : '') + '>allow</option><option ' + (r.action === 'deny' ? 'selected' : '') + '>deny</option></select>' +
            '<select data-f="proto" aria-label="Rule ' + (i + 1) + ' protocol">' + ['tcp', 'udp', 'icmp', 'any'].map((p) => '<option ' + (r.proto === p ? 'selected' : '') + '>' + p + '</option>').join('') + '</select>' +
            '<input data-f="src" value="' + esc(r.src) + '" aria-label="Rule ' + (i + 1) + ' source" spellcheck="false"><input data-f="dst" value="' + esc(r.dst) + '" aria-label="Rule ' + (i + 1) + ' destination" spellcheck="false">' +
            '<input data-f="port" value="' + esc(r.port) + '" aria-label="Rule ' + (i + 1) + ' port" spellcheck="false" ' + (r.proto === 'icmp' ? 'disabled' : '') + '>' +
            '<span class="ctl"><button class="btn sm ghost" data-fw="up" aria-label="Move rule ' + (i + 1) + ' up" ' + (i === 0 ? 'disabled' : '') + '>▲</button><button class="btn sm ghost" data-fw="down" aria-label="Move rule ' + (i + 1) + ' down" ' + (i === st.rules.length - 1 ? 'disabled' : '') + '>▼</button><button class="btn sm ghost" data-fw="del" aria-label="Delete rule ' + (i + 1) + '">✕</button></span>' +
            (err ? '<span class="fw-err" role="alert">' + esc(err) + '</span>' : '') + '</div>';
        }).join('') + '<div class="fw-row fw-implicit"><span class="n">∞</span><span>deny</span><span>any</span><span>any</span><span>any</span><span>any</span><span class="lead small">implicit deny (cannot be removed)</span></div>';
      };
      const drawResults = () => {
        Object.assign(ctx, C.fwContext(d, st.rules));
        testsEl.innerHTML = '<table class="fw-table"><thead><tr><th></th><th>Traffic</th><th>Expected</th><th>Result</th></tr></thead><tbody>' + d.tests.map((t) => {
          const rr = ctx.results[t.id], r = rr, ok = rr.ok;
          return '<tr class="' + (ok ? 'ok' : 'bad') + '"><td aria-label="' + (ok ? 'pass' : 'fail') + '">' + (ok ? '✓' : '✗') + '</td><td>' + esc(t.desc) + '<div class="lead small mono">' + t.proto.toUpperCase() + ' ' + esc(t.src) + ' → ' + esc(t.dst) + ':' + t.port + '</div></td><td>' + t.expect + '</td><td>' + r.action + '<div class="lead small">' + (r.rule >= 0 ? 'rule ' + (r.rule + 1) : 'implicit deny') + '</div></td></tr>';
        }).join('') + '</tbody></table>';
        consEl.innerHTML = (d.constraints || []).map((c) => { const ok = ctx.constraints[c.id]; return '<li class="' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✓ ' : '✗ ') + esc(c.text) + '</li>'; }).join('');
        ctx.rules = st.rules;
      };
      drawRules(); drawResults();
      host.addEventListener('input', (e) => { const f = e.target.dataset.f; if (!f) return; const i = +e.target.closest('.fw-row').dataset.i; st.rules[i][f] = e.target.value; if (f === 'src' || f === 'dst' || f === 'port') { const row = e.target.closest('.fw-row'); let er = row.querySelector('.fw-err'); const m = C.fwRuleError(st.rules[i]); if (m) { if (!er) { er = document.createElement('span'); er.className = 'fw-err'; er.setAttribute('role', 'alert'); row.appendChild(er); } er.textContent = m; } else if (er) er.remove(); } drawResults(); run.changed(); });
      host.addEventListener('change', (e) => { const f = e.target.dataset.f; if (f === 'proto' || f === 'action') { const i = +e.target.closest('.fw-row').dataset.i; st.rules[i][f] = e.target.value; drawRules(); drawResults(); run.changed(); } });
      host.addEventListener('click', (e) => {
        const b = e.target.closest('[data-fw]'); if (!b) return; const a = b.dataset.fw, row = b.closest('.fw-row'), i = row ? +row.dataset.i : -1;
        if (a === 'add') st.rules.push({ action: 'allow', proto: 'tcp', src: 'any', dst: 'any', port: 'any' });
        else if (a === 'del') st.rules.splice(i, 1);
        else if (a === 'up' && i > 0) { const t = st.rules[i]; st.rules[i] = st.rules[i - 1]; st.rules[i - 1] = t; }
        else if (a === 'down' && i < st.rules.length - 1) { const t = st.rules[i]; st.rules[i] = st.rules[i + 1]; st.rules[i + 1] = t; }
        else if (a === 'reset') { st.rules = d.rules.map((r) => Object.assign({}, r)); }
        drawRules(); drawResults(); run.changed();
      });
      return ctx;
    }
  };

  /* ---- config editor ---- */
  engines.config = {
    mount(host, run) {
      const esc = run.api.esc, d = run.data; const ctx = { text: d.text, checks: {} };
      host.innerHTML = '<div class="cfg-wrap"><div><div class="row between"><b class="mono">' + esc(d.filename) + '</b><span class="lead small">edit freely; lines starting with # are comments</span></div><textarea class="cfg-edit mono" spellcheck="false" aria-label="Edit ' + esc(d.filename) + '" rows="18">' + esc(d.text) + '</textarea></div><div><h4 style="margin:0 0 .4rem">Security checks</h4><ul class="plain cfg-checks"></ul></div></div>';
      const ta = host.querySelector('textarea'), ul = host.querySelector('.cfg-checks');
      const evalAll = () => {
        Object.assign(ctx, C.configContext(d, ta.value));
        ul.innerHTML = d.checks.map((c) => { const ok = ctx.checks[c.id]; return '<li class="' + (ok ? 'ok' : 'bad') + '"><div>' + (ok ? '✓ ' : '✗ ') + esc(c.label) + '</div>' + (ok ? '<div class="lead small">' + esc(c.why) + '</div>' : '') + '</li>'; }).join('');
      };
      evalAll(); let tm = 0;
      ta.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { evalAll(); run.changed(); }, 150); });
      return ctx;
    }
  };

  /* ---- packet analysis ---- */
  engines.pcap = {
    mount(host, run) {
      const esc = run.api.esc, d = run.data, pk = d.packets, ctx = { filter: '' };
      host.innerHTML = '<div class="pcap"><div class="pcap-bar"><input class="textbox mono" id="pf" placeholder="Display filter, for example: ip.addr==10.0.5.10 and tcp.port==80" aria-label="Display filter" spellcheck="false" autocomplete="off"><div class="row" style="gap:.3rem"><button class="btn sm" data-p="clear">Clear</button><button class="btn sm" data-p="talkers">Top talkers</button><button class="btn sm" data-p="protos">Protocols</button><button class="btn sm" data-p="ports">Top ports</button></div></div>' +
        '<div class="row" style="gap:.3rem;margin:.5rem 0">' + (d.presets || []).map((p, i) => '<button class="chip" data-p="preset" data-i="' + i + '">' + esc(p[0]) + '</button>').join('') + '</div>' +
        '<div class="lead small" id="pcount" role="status"></div><div class="pcap-table" tabindex="0" aria-label="Packet list"><table><thead><tr><th>No.</th><th>Time</th><th>Source</th><th>Destination</th><th>Proto</th><th>Len</th><th>Info</th></tr></thead><tbody id="prows"></tbody></table></div>' +
        '<div id="pstats"></div><div id="pdetail" class="pcap-detail"></div>' +
        (d.tools && d.tools.b64 ? '<div class="card" style="margin-top:.8rem;background:var(--bg2)"><b>Base64 decoder</b><div class="row" style="margin-top:.4rem;gap:.5rem"><input class="textbox mono" id="b64in" placeholder="Paste Base64 text here" aria-label="Base64 input" spellcheck="false"><span class="mono" id="b64out" aria-live="polite"></span></div></div>' : '') + '</div>';
      const f = host.querySelector('#pf'), rows = host.querySelector('#prows'), cnt = host.querySelector('#pcount'), stats = host.querySelector('#pstats'), detail = host.querySelector('#pdetail');
      let shown = pk;
      const apply = () => {
        const r = C.pcapFilter(f.value); ctx.filter = f.value; f.classList.toggle('bad', !!r.error); stats.innerHTML = '';
        if (r.error) { cnt.textContent = r.error; return; }
        shown = pk.filter(r.f); cnt.textContent = shown.length + ' of ' + pk.length + ' packets match' + (shown.length > 250 ? ' (showing the first 250)' : '');
        rows.innerHTML = shown.slice(0, 250).map((p) => '<tr data-n="' + p.n + '" tabindex="0"><td>' + p.n + '</td><td>' + p.t.toFixed(3) + '</td><td>' + esc(p.src) + '</td><td>' + esc(p.dst) + '</td><td>' + esc((p.app || p.proto).toUpperCase()) + '</td><td>' + p.len + '</td><td>' + esc(p.info) + '</td></tr>').join('');
      };
      const showDetail = (n) => {
        const p = pk[n - 1]; if (!p) return;
        detail.innerHTML = '<h4 style="margin:.8rem 0 .3rem">Packet ' + p.n + '</h4><table class="kv"><tr><td>Source</td><td>' + esc(p.src) + (p.sport ? ':' + p.sport : '') + '</td></tr><tr><td>Destination</td><td>' + esc(p.dst) + (p.dport ? ':' + p.dport : '') + '</td></tr><tr><td>Protocol</td><td>' + esc((p.app || p.proto).toUpperCase()) + (p.app ? ' over ' + esc(p.proto.toUpperCase()) : '') + '</td></tr>' + (p.flags ? '<tr><td>TCP flags</td><td>' + esc(p.flags) + '</td></tr>' : '') + '<tr><td>Length</td><td>' + p.len + ' bytes</td></tr><tr><td>Info</td><td>' + esc(p.info) + '</td></tr></table>' + (p.payload ? '<pre class="exhibit">' + esc(p.payload) + '</pre>' : '');
      };
      const table = (head, list) => '<table class="kv" style="margin-top:.6rem"><tr><th>' + head + '</th><th>Packets</th></tr>' + list.slice(0, 8).map((x) => '<tr><td class="mono">' + esc(x[0]) + '</td><td>' + x[1] + '</td></tr>').join('') + '</table>';
      host.addEventListener('click', (e) => {
        const tr = e.target.closest('tr[data-n]'); if (tr) { showDetail(+tr.dataset.n); return; }
        const b = e.target.closest('[data-p]'); if (!b) return; const a = b.dataset.p;
        if (a === 'clear') { f.value = ''; apply(); }
        else if (a === 'preset') { f.value = d.presets[+b.dataset.i][1]; apply(); run.changed(); }
        else if (a === 'talkers') stats.innerHTML = table('Source (current filter)', C.countBy(shown, (p) => p.src));
        else if (a === 'protos') stats.innerHTML = table('Protocol (current filter)', C.countBy(shown, (p) => (p.app || p.proto).toUpperCase()));
        else if (a === 'ports') stats.innerHTML = table('Destination port (current filter)', C.countBy(shown.filter((p) => p.dport), (p) => String(p.dport)));
      });
      host.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const tr = e.target.closest('tr[data-n]'); if (tr) showDetail(+tr.dataset.n); } });
      f.addEventListener('input', () => { apply(); run.changed(); });
      const b64 = host.querySelector('#b64in'); if (b64) b64.addEventListener('input', () => { let o; try { o = decodeURIComponent(escape(atob(b64.value.trim()))); } catch (e) { o = b64.value.trim() ? '(not valid Base64)' : ''; } host.querySelector('#b64out').textContent = o; });
      apply(); return ctx;
    }
  };

  /* ---- crypto tools ---- */
  engines.crypto = {
    mount(host, run) {
      const esc = run.api.esc, d = run.data, enc = (s) => new TextEncoder().encode(s), hex = (b) => Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
      let html = '<div class="crypto-grid">';
      if (d.tools.indexOf('hash') >= 0) html += '<div class="card ct"><h4>Hash tool</h4><label>Text to hash<textarea id="hin" rows="2" spellcheck="false" aria-label="Text to hash"></textarea></label><label>Algorithm<select id="halg"><option>SHA-256</option><option>SHA-1</option><option>SHA-384</option><option>SHA-512</option></select></label><div class="mono out" id="hout" aria-live="polite">(hash appears here)</div>' + (d.wordlist ? '<div class="lead small" style="margin-top:.5rem">Word list (click to try):</div><div class="row" style="gap:.3rem">' + d.wordlist.map((w) => '<button class="chip" data-word="' + esc(w) + '">' + esc(w) + '</button>').join('') + '</div>' : '') + '</div>';
      if (d.stored) html += '<div class="card ct"><h4>Leaked table (unsalted SHA-256)</h4><table class="kv"><tr><th>User</th><th>Stored hash</th></tr>' + d.stored.map((s) => '<tr><td>' + esc(s.user) + '</td><td class="mono" style="word-break:break-all">' + esc(s.hash) + '</td></tr>').join('') + '</table></div>';
      if (d.tools.indexOf('integrity') >= 0) html += '<div class="card ct"><h4>Integrity checker</h4>' + d.files.map((f, i) => '<div class="file"><b>' + esc(f.name) + '</b><div class="lead small">Published SHA-256:</div><div class="mono out sm">' + esc(f.published) + '</div><div class="row" style="margin-top:.3rem;gap:.5rem"><button class="btn sm" data-int="' + i + '">Compute actual hash</button><span class="res" id="ires' + i + '" aria-live="polite"></span></div></div>').join('') + '</div>';
      if (d.tools.indexOf('kdf') >= 0) html += '<div class="card ct"><h4>PBKDF2 (password key derivation)</h4><label>Password<input id="kpw" type="text" value="" spellcheck="false"></label><label>Salt<input id="ksalt" type="text" value="" spellcheck="false"></label><label>Iterations<input id="kit" type="number" min="1" max="600000" value="100000"></label><div class="row" style="margin-top:.5rem"><button class="btn sm primary" id="kgo">Derive</button></div><div class="mono out" id="kout" aria-live="polite">(result appears here)</div></div>';
      host.innerHTML = html + '</div>';
      const hin = host.querySelector('#hin'), halg = host.querySelector('#halg'), hout = host.querySelector('#hout'); let seq = 0;
      const doHash = async () => { const me = ++seq; if (!hin.value) { hout.textContent = '(hash appears here)'; return; } const h = hex(await crypto.subtle.digest(halg.value, enc(hin.value))); if (me === seq) hout.textContent = h; };
      if (hin) { hin.addEventListener('input', doHash); halg.addEventListener('change', doHash); }
      host.addEventListener('click', async (e) => {
        const w = e.target.closest('[data-word]'); if (w && hin) { hin.value = w.dataset.word; doHash(); return; }
        const b = e.target.closest('[data-int]');
        if (b) { const f = d.files[+b.dataset.int], h = hex(await crypto.subtle.digest('SHA-256', enc(f.content))), r = host.querySelector('#ires' + b.dataset.int); r.innerHTML = '<span class="mono">' + esc(h.slice(0, 16)) + '…</span> <b class="' + (h === f.published ? 'okc' : 'badc') + '">' + (h === f.published ? '✓ matches' : '✗ DOES NOT MATCH') + '</b>'; }
        if (e.target.id === 'kgo') { const it = Math.max(1, Math.min(600000, +host.querySelector('#kit').value || 1)); const t0 = performance.now(); const key = await crypto.subtle.importKey('raw', enc(host.querySelector('#kpw').value), 'PBKDF2', false, ['deriveBits']); const out = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc(host.querySelector('#ksalt').value), iterations: it, hash: 'SHA-256' }, key, 256); host.querySelector('#kout').textContent = hex(out) + '  (' + Math.round(performance.now() - t0) + ' ms)'; }
      });
      return {};
    }
  };

  /* ---- email analysis ---- */
  engines.email = {
    mount(host, run) {
      const esc = run.api.esc, d = run.data, st = { flags: {}, verdict: '', action: '', links: {} }, ctx = { st, result: null };
      const flag = (id, inner, cls) => '<div class="flag ' + (cls || '') + (st.flags[id] ? ' on' : '') + '" role="button" tabindex="0" aria-pressed="' + !!st.flags[id] + '" data-flag="' + id + '">' + inner + '</div>';
      const draw = () => {
        const res = ctx.result, ind = {}; d.indicators.forEach((i) => { ind[i.id] = i; });
        const note = (id) => (res && ind[id] && (st.flags[id] || (ind[id].bad && !st.flags[id])) ? '<div class="note ' + (ind[id].bad === !!st.flags[id] ? 'okn' : 'badn') + '">' + (ind[id].bad ? (st.flags[id] ? '✓ Good catch: ' : '✗ Missed: ') : '✗ Not a red flag: ') + esc(ind[id].why) + '</div>' : '');
        host.innerHTML = '<div class="mail"><div class="mail-head">' + d.headers.map((h) => flag(h.id, '<span class="hk">' + esc(h.k) + ':</span> <span class="hv">' + esc(h.v) + '</span>', 'hdr') + note(h.id)).join('') + '</div><div class="mail-body">' +
          d.body.map((b) => {
            if (b.t === 'p') return flag(b.id, esc(b.text), 'para') + note(b.id);
            if (b.t === 'link') return flag(b.id, '<span class="fakelink">' + esc(b.text) + '</span>', 'para') + '<div class="row" style="gap:.5rem;margin:.1rem 0 .4rem"><button class="btn sm ghost" data-showlink="' + b.id + '">' + (st.links[b.id] ? 'Hide' : 'Show') + ' link target</button>' + (st.links[b.id] ? '<span class="mono realhref">' + esc(b.href) + '</span>' : '') + '</div>' + note(b.id);
            return flag(b.id, '📎 <b>' + esc(b.name) + '</b>', 'para att') + note(b.id);
          }).join('') + '</div>' +
          '<div class="mail-decide"><label>Your verdict<select id="ev"><option value="">Choose…</option>' + d.verdictOptions.map((o) => '<option value="' + o[0] + '" ' + (st.verdict === o[0] ? 'selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select></label>' +
          '<label>Best action<select id="ea"><option value="">Choose…</option>' + d.actionOptions.map((o) => '<option value="' + o[0] + '" ' + (st.action === o[0] ? 'selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select></label>' +
          '<div class="row"><button class="btn primary" id="echeck">Check my analysis</button></div>' + (res ? '<div class="callout ' + (res.flagsOk && res.verdictOk && res.actionOk ? 'tip' : 'warn') + '" style="margin-top:.8rem" role="status"><b>' + (res.flagsOk && res.verdictOk && res.actionOk ? 'Excellent analysis' : 'Not quite yet') + '</b>Indicators: ' + (res.flagsOk ? 'all correct' : res.missed.length + ' missed, ' + res.falseFlags.length + ' wrongly flagged') + ' · Verdict: ' + (res.verdictOk ? 'correct' : 'check again') + ' · Action: ' + (res.actionOk ? 'correct' : 'check again') + '</div>' : '') + '</div></div>';
      };
      draw();
      const toggle = (id) => { st.flags[id] = !st.flags[id]; ctx.result = null; draw(); const el = host.querySelector('[data-flag="' + id + '"]'); if (el) el.focus(); };
      host.addEventListener('click', (e) => {
        const f = e.target.closest('[data-flag]'); if (f) { toggle(f.dataset.flag); return; }
        const s = e.target.closest('[data-showlink]'); if (s) { st.links[s.dataset.showlink] = !st.links[s.dataset.showlink]; draw(); return; }
        if (e.target.id === 'echeck') { ctx.result = C.emailResult(d, st); draw(); run.changed(); }
      });
      host.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.flag) { e.preventDefault(); toggle(e.target.dataset.flag); } });
      host.addEventListener('change', (e) => { if (e.target.id === 'ev') st.verdict = e.target.value; if (e.target.id === 'ea') st.action = e.target.value; });
      return ctx;
    }
  };

  /* ---- decisions (classify rows) ---- */
  engines.classify = {
    mount(host, run) {
      const esc = run.api.esc, d = run.data, ans = {}, ctx = { answers: ans, result: null };
      const draw = () => {
        const res = ctx.result;
        host.innerHTML = '<div class="cls-wrap"><table class="fw-table cls"><thead><tr>' + d.columns.map((c) => '<th>' + esc(c) + '</th>').join('') + '<th>Your choice</th></tr></thead><tbody>' + d.items.map((it) => {
          const bad = res && res.wrong.indexOf(it.id) >= 0;
          return '<tr class="' + (res ? (bad ? 'bad' : 'ok') : '') + '">' + it.cells.map((c) => '<td>' + esc(c) + '</td>').join('') + '<td><select data-id="' + it.id + '" aria-label="Choice for: ' + esc(it.cells[0]) + '"><option value="">Select…</option>' + d.options.map((o) => '<option value="' + o[0] + '" ' + (ans[it.id] === o[0] ? 'selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>' + (res && bad ? '<div class="note badn">' + esc(it.explain) + '</div>' : '') + '</td></tr>';
        }).join('') + '</tbody></table><div class="row" style="margin-top:.8rem"><button class="btn primary" id="ccheck">Check answers</button>' + (res ? '<span class="lead" role="status"><b>' + res.correct + ' of ' + res.total + ' correct</b>' + (res.allOk ? ' · perfect!' : ' · fix the highlighted rows and check again') + '</span>' : '') + '</div></div>';
      };
      draw();
      host.addEventListener('change', (e) => { if (e.target.dataset.id) { ans[e.target.dataset.id] = e.target.value; } });
      host.addEventListener('click', (e) => { if (e.target.id === 'ccheck') { ctx.result = C.classifyResult(d, ans); const unans = d.items.filter((i) => !ans[i.id]).length; draw(); if (unans) run.api.toast(unans + ' row(s) not answered yet'); run.changed(); } });
      return ctx;
    }
  };
})();
