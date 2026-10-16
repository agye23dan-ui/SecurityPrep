/* SecurityPrep platform engine: routing, progress store, study views, quizzes, mock exams, readiness model.
 * No dependencies. Progress is stored on this device: localStorage, an IndexedDB mirror, and an optional auto-backup file. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ helpers */
  const $ = (s, r) => (r || document).querySelector(s);
  const app = $('#app');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pct = (x) => Math.round(x * 100);
  const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  const today = () => new Date().toISOString().slice(0, 10);
  const nav = (h) => { if (location.hash === h) route(); else location.hash = h; };
  const letter = (i) => String.fromCharCode(65 + i);
  const fmtTime = (s) => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
  const fmtDate = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const bar = (p, cls) => '<div class="bar ' + (cls || '') + '"><span style="width:' + Math.max(0, Math.min(100, p)) + '%"></span></div>';
  const pill = (t, c) => '<span class="pill ' + (c || '') + '">' + esc(t) + '</span>';

  function say(msg) { const l = $('#live'); if (l) { l.textContent = ''; setTimeout(() => { l.textContent = msg; }, 30); } }
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.textContent = msg; say(msg);
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }

  /* ------------------------------------------------------------------ store */
  const KEY = 'secprep.v1';
  const blankPrefs = () => ({ exam: 'secplus', theme: 'auto', dates: {} });
  const blank = () => ({ answers: {}, assignments: {}, read: {}, flash: {}, fdue: {}, attempts: [], days: {}, marks: {}, notes: {}, labs: {}, prefs: blankPrefs(), meta: {}, created: Date.now() });
  /* Fill in anything missing and move progress from renamed question ids to their new ids (see js/migrations.js). */
  function normalize(d) {
    const r = Object.assign(blank(), d && typeof d === 'object' ? d : {});
    r.prefs = Object.assign(blankPrefs(), r.prefs || {});
    if (!r.prefs.dates || typeof r.prefs.dates !== 'object') r.prefs.dates = {};
    ['answers', 'assignments', 'read', 'flash', 'fdue', 'days', 'marks', 'notes', 'labs', 'meta'].forEach((k) => { if (!r[k] || typeof r[k] !== 'object' || Array.isArray(r[k])) r[k] = {}; });
    if (!Array.isArray(r.attempts)) r.attempts = [];
    const al = (window.CT && CT.idAliases) || {};
    if (Object.keys(al).length && !r.meta.aliased) {
      const out = {};
      Object.keys(r.answers).forEach((id) => { const t = al[id] === undefined ? id : al[id]; if (t && !out[t]) out[t] = r.answers[id]; });
      r.answers = out; r.meta.aliased = 1;
    }
    return r;
  }
  const hasProgress = (d) => !!(Object.keys(d.answers).length || Object.keys(d.days).length || Object.keys(d.assignments).length || Object.keys(d.read).length);
  function load() {
    try { return normalize(JSON.parse(localStorage.getItem(KEY))); } catch (e) { return normalize(null); }
  }
  let S = load();
  let storageOK = true;
  function save() {
    S.meta.saved = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(S)); storageOK = true; } catch (e) { storageOK = false; }
    schedulePersist();
  }

  /* Durable copies of progress, so clearing one place does not lose everything:
   * 1) localStorage (primary), 2) an IndexedDB mirror, 3) an optional auto-backup file the user picks on their device,
   * plus a request to the browser to treat this site's storage as persistent (not cleared under storage pressure). */
  const DB = { name: 'secprep', store: 'kv' };
  let dbp = null;  // one shared connection, closed if another tab or tool needs to change the database
  const idbOpen = () => dbp || (dbp = new Promise((res, rej) => {
    if (!window.indexedDB) { dbp = null; rej(new Error('no indexedDB')); return; }
    const r = indexedDB.open(DB.name, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(DB.store);
    r.onsuccess = () => { r.result.onversionchange = () => { r.result.close(); dbp = null; }; res(r.result); };
    r.onerror = () => { dbp = null; rej(r.error); };
  }));
  const idbGet = (k) => idbOpen().then((db) => new Promise((res, rej) => { const t = db.transaction(DB.store).objectStore(DB.store).get(k); t.onsuccess = () => res(t.result); t.onerror = () => rej(t.error); }));
  const idbSet = (k, v) => idbOpen().then((db) => new Promise((res, rej) => { const t = db.transaction(DB.store, 'readwrite'); t.objectStore(DB.store).put(v, k); t.oncomplete = () => res(); t.onerror = () => rej(t.error); }));
  const P = { persisted: null, idb: 'checking', file: null, fileState: 'none', lastFile: 0, supportFile: typeof window.showSaveFilePicker === 'function' };
  let pTimer = 0;
  function schedulePersist() { clearTimeout(pTimer); pTimer = setTimeout(persistNow, 900); }
  function persistNow() {
    clearTimeout(pTimer); pTimer = 0;
    const snap = JSON.stringify(S);
    idbSet('state', snap).then(() => { P.idb = 'ok'; }).catch(() => { P.idb = 'unavailable'; });
    writeFile(snap, false);
  }
  async function filePerm(h, ask) {
    const o = { mode: 'readwrite' };
    if ((await h.queryPermission(o)) === 'granted') return true;
    return ask ? (await h.requestPermission(o)) === 'granted' : false;
  }
  async function writeFile(snap, ask) {
    if (!P.file) return false;
    try {
      if (!(await filePerm(P.file, ask))) { P.fileState = 'needs-permission'; return false; }
      const w = await P.file.createWritable(); await w.write(snap || JSON.stringify(S)); await w.close();
      P.fileState = 'ok'; P.lastFile = Date.now(); S.meta.lastBackup = P.lastFile;
      return true;
    } catch (e) { P.fileState = 'error'; return false; }
  }
  async function bootStorage() {
    try {
      const h = await idbGet('fileHandle');
      if (h && h.queryPermission) { P.file = h; P.fileState = (await h.queryPermission({ mode: 'readwrite' })) === 'granted' ? 'ok' : 'needs-permission'; }
    } catch (e) { /* no stored file */ }
    try {
      const snap = await idbGet('state');
      if (snap) {
        const d = normalize(JSON.parse(snap));
        if ((d.meta.saved || 0) > (S.meta.saved || 0) + 1000 && hasProgress(d)) {
          S = d; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ }
          applyTheme(); toast('Progress restored from this device'); route();
        }
      }
      P.idb = 'ok';
    } catch (e) { P.idb = 'unavailable'; }
    if (hasProgress(S)) persistNow();
    requestPersistence();
  }
  /* Ask the browser to treat this site's storage as persistent. Done only after the saved copy has been read back, and never
   * awaited: some browsers show a prompt, and a pending request must not hold up saving or restoring progress.
   * Adding ?nopersist to the address skips it (the automated tests use this). */
  function requestPersistence() {
    if (/[?&]nopersist/.test(location.search) || !navigator.storage || !navigator.storage.persisted) return;
    try {
      navigator.storage.persisted().then((p) => {
        P.persisted = p;
        if (!p && navigator.storage.persist) navigator.storage.persist().then((ok) => { P.persisted = ok; }).catch(() => {});
      }).catch(() => {});
    } catch (e) { /* not supported */ }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && pTimer) persistNow(); });
  window.addEventListener('pagehide', () => { if (pTimer) persistNow(); });

  function applyTheme() {
    const t = S.prefs.theme || 'auto';
    document.documentElement.setAttribute('data-theme', t);
    const light = t === 'light' || (t === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
    const m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', light ? '#f4f7fa' : '#0e1621');
  }
  if (window.matchMedia) { try { matchMedia('(prefers-color-scheme: light)').addEventListener('change', applyTheme); } catch (e) { /* older browsers */ } }
  function exportBackup() {
    S.meta.lastBackup = Date.now(); save();
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'secprep-backup-' + today() + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function touch() { S.days[today()] = 1; }
  function streak() {
    let n = 0; const d = new Date();
    if (!S.days[today()]) d.setDate(d.getDate() - 1);
    while (S.days[d.toISOString().slice(0, 10)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function record(id, ok) {
    const a = S.answers[id] || (S.answers[id] = { n: 0, c: 0, h: [], ts: 0 });
    a.n++; if (ok) a.c++;
    a.h.push(ok ? 1 : 0); if (a.h.length > 6) a.h = a.h.slice(-6);
    a.ts = Date.now(); touch(); save();
  }
  const curExam = () => CT.exam(S.prefs.exam) || CT.exams[0];

  /* ------------------------------------------------------------------ readiness model
   * Per-question score = mean of the last 3 results. Domain accuracy = mean over questions seen.
   * Domain readiness = accuracy x min(1, coverage / 0.8), so you cannot look ready by answering a few easy questions.
   * Exam readiness = weight-weighted mean over ALL domains; domains that are not built yet count as 0. */
  function qScore(id) {
    const a = S.answers[id];
    if (!a || !a.h || !a.h.length) return null;
    const h = a.h.slice(-3);
    return h.reduce((s, x) => s + x, 0) / h.length;
  }
  function scopeStats(qs) {
    let seen = 0, sum = 0, att = 0, cor = 0;
    qs.forEach((q) => {
      const sc = qScore(q.id); const a = S.answers[q.id];
      if (sc !== null) { seen++; sum += sc; }
      if (a) { att += a.n; cor += a.c; }
    });
    return { total: qs.length, seen, acc: seen ? sum / seen : 0, coverage: qs.length ? seen / qs.length : 0, att, cor };
  }
  function domainReadiness(exId, dom) {
    if (!CT.isBuilt(exId, dom.id)) return { built: false, r: 0, acc: 0, coverage: 0, total: 0, seen: 0 };
    const st = scopeStats(CT.questions({ exam: exId, dom: dom.id }));
    return Object.assign({ built: true, r: st.acc * Math.min(1, st.coverage / 0.8) }, st);
  }
  function examReadiness(ex) {
    let tot = 0, w = 0, bt = 0, bw = 0;
    ex.domains.forEach((d) => {
      const dr = domainReadiness(ex.id, d);
      tot += d.weight * dr.r; w += d.weight;
      if (dr.built) { bt += d.weight * dr.r; bw += d.weight; }
    });
    return { overall: w ? tot / w : 0, built: bw ? bt / bw : 0, builtWeight: bw, totalWeight: w };
  }
  function verdict(r) {
    if (r >= 0.85) return ['Exam-ready', 'ok'];
    if (r >= 0.75) return ['Almost there', 'warn'];
    if (r >= 0.6) return ['Developing', 'warn'];
    return ['Not ready yet', 'bad'];
  }
  const ringColor = (r) => (r >= 0.8 ? 'var(--green)' : r >= 0.6 ? 'var(--amber)' : r > 0 ? 'var(--red)' : 'var(--teal)');
  const ring = (r, label) => '<div class="ring" style="--p:' + pct(r) + ';--c:' + ringColor(r) + '"><div><span><b>' + pct(r) + '%</b><small>' + esc(label) + '</small></span></div></div>';

  const okey = (ex, dom, obj) => ex + ':' + dom + ':' + obj;
  function objectiveStatus(ex, dom, obj) {
    const c = CT.content_for(ex, dom);
    if (!c) return null;
    const a = c.assignments[obj.id];
    const as = a ? S.assignments[a.id] : null;
    return {
      read: !!S.read[okey(ex, dom, obj.id)],
      assignDone: !!(as && as.done),
      q: scopeStats(CT.questions({ exam: ex, dom: dom, obj: obj.id }))
    };
  }
  function weakObjectives(ex) {
    const out = [];
    ex.domains.forEach((d) => {
      if (!CT.isBuilt(ex.id, d.id)) return;
      d.objectives.forEach((o) => {
        const st = scopeStats(CT.questions({ exam: ex.id, dom: d.id, obj: o.id }));
        if (!st.total) return;
        const score = st.seen ? st.acc * Math.min(1, st.coverage / 0.8) : 0;
        out.push({ d, o, st, score });
      });
    });
    return out.sort((a, b) => a.score - b.score);
  }

  /* ------------------------------------------------------------------ event delegation */
  let H = {};
  app.addEventListener('click', (e) => { const t = e.target.closest('[data-act]'); if (!t || t.disabled) return; const f = H[t.dataset.act]; if (f) f(t, e); });
  app.addEventListener('change', (e) => { const t = e.target.closest('[data-chg]'); if (!t) return; const f = H[t.dataset.chg]; if (f) f(t, e); });
  app.addEventListener('input', (e) => { const t = e.target.closest('[data-inp]'); if (!t) return; const f = H[t.dataset.inp]; if (f) f(t, e); });

  let timers = [];
  const clearTimers = () => { timers.forEach(clearInterval); timers = []; };

  /* ------------------------------------------------------------------ router */
  function route() {
    clearTimers();
    const raw = (location.hash || '#/').slice(1);
    const parts = raw.split('?')[0].split('/').filter(Boolean);
    const head = parts[0] || 'home';
    H = {};
    const map = { home: viewHome, study: viewStudy, practice: viewPractice, quiz: viewQuiz, results: viewResults, flash: viewFlash, labs: viewLabs, search: viewSearch, mock: viewMock, readiness: viewReadiness, settings: viewSettings };
    (map[head] || viewHome)(parts.slice(1));
    const navKey = head === 'quiz' || head === 'results' ? (Q && Q.kind === 'mock' ? 'mock' : 'practice') : head;
    document.querySelectorAll('#nav a').forEach((a) => { const on = a.dataset.route === navKey; a.classList.toggle('active', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    const h1 = app.querySelector('h1');
    document.title = (h1 ? h1.textContent.trim().slice(0, 70) + ' · ' : '') + 'SecurityPrep';
    if (h1) { h1.setAttribute('tabindex', '-1'); try { h1.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    const r = examReadiness(curExam());
    $('#sideFoot').innerHTML = esc(curExam().name) + ' readiness: <b>' + pct(r.overall) + '%</b><br>Study streak: <b>' + streak() + '</b> day' + (streak() === 1 ? '' : 's');
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  const examTabs = (act) => '<div class="tabs" role="group" aria-label="Choose exam">' + CT.exams.map((e) => '<button class="tab ' + (e.id === curExam().id ? 'active' : '') + '" aria-pressed="' + (e.id === curExam().id) + '" data-act="' + act + '" data-id="' + e.id + '">' + esc(e.name) + '</button>').join('') + '</div>';

  /* ================================================================== LABS (see js/labs/) */
  function viewLabs(p) {
    if (!CT.labs || !CT.labs.view) { app.innerHTML = '<h1>Labs</h1><div class="card empty">The labs could not be loaded.</div>'; return; }
    CT.labs.view(p, { app, state: () => S, save, touch, toast, esc, nav, on: (name, fn) => { H[name] = fn; } });
  }

  /* ================================================================== HOME */
  function nextStep(ex) {
    for (const d of ex.domains) {
      if (!CT.isBuilt(ex.id, d.id)) continue;
      for (const o of d.objectives) {
        const s = objectiveStatus(ex.id, d.id, o);
        if (!s.read) return { text: 'Read the notes for ' + o.id + ' ' + o.title, href: '#/study/' + ex.id + '/' + d.id + '/' + o.id + '/notes', cta: 'Open notes' };
      }
    }
    for (const d of ex.domains) {
      if (!CT.isBuilt(ex.id, d.id)) continue;
      for (const o of d.objectives) {
        const s = objectiveStatus(ex.id, d.id, o);
        if (!s.assignDone) return { text: 'Complete the assignment for ' + o.id + ' ' + o.title, href: '#/study/' + ex.id + '/' + d.id + '/' + o.id + '/assignment', cta: 'Open assignment' };
      }
    }
    const weak = weakObjectives(ex).filter((w) => w.score < 0.8);
    if (weak.length) {
      const w = weak[0];
      return { text: 'Practice ' + w.o.id + ' ' + w.o.title + ' (current score ' + pct(w.score) + '%)', href: '#/study/' + ex.id + '/' + w.d.id + '/' + w.o.id + '/quiz', cta: 'Practice now' };
    }
    if (!S.attempts.some((a) => a.kind === 'mock' && a.exam === ex.id)) return { text: 'Take a timed mock exam to test yourself under exam conditions.', href: '#/mock', cta: 'Start mock exam' };
    return { text: 'Everything built so far is mastered. Add the next domain to keep going.', href: '#/readiness', cta: 'See readiness' };
  }

  /* Study plan: turns the exam date into a daily target based on what is still left in the built content. */
  function planStats(ex) {
    let unread = 0, assign = 0, unseen = 0;
    ex.domains.forEach((d) => {
      const c = CT.content_for(ex.id, d.id); if (!c) return;
      d.objectives.forEach((o) => {
        const st = objectiveStatus(ex.id, d.id, o);
        if (!st.read) unread++;
        if (c.assignments[o.id] && !st.assignDone) assign++;
        unseen += st.q.total - st.q.seen;
      });
    });
    const missed = CT.questions({ exam: ex.id }).filter((q) => isMissed(q)).length;
    const weak = weakObjectives(ex).filter((w) => w.score < 0.8).length;
    const mocks = S.attempts.filter((a) => a.kind === 'mock' && a.exam === ex.id).length;
    return { unread, assign, unseen, missed, weak, mocks };
  }
  function planHTML(ex) {
    const date = S.prefs.dates[ex.id];
    const input = '<label class="inline">Exam date <input type="date" data-chg="setDate" value="' + esc(date || '') + '" min="' + today() + '"></label>';
    if (!date) return '<div class="card" style="margin-top:1rem"><div class="row between"><div><h3>Study plan</h3><p class="lead" style="margin:0">Set the date of your ' + esc(ex.name) + ' exam and get a daily target.</p></div>' + input + '</div></div>';
    const days = Math.round((new Date(date + 'T00:00:00') - new Date(today() + 'T00:00:00')) / 864e5);
    const head = '<div class="row between"><h3>Study plan: ' + esc(ex.name) + '</h3>' + input + '</div>';
    if (days < 0) return '<div class="card" style="margin-top:1rem">' + head + '<p class="lead" style="margin:0">That date has passed. Set a new exam date, or <button class="btn sm ghost" data-act="clearDate">clear it</button>.</p></div>';
    const st = planStats(ex); const per = (n) => Math.ceil(n / Math.max(1, days));
    const items = [];
    if (st.unread) items.push('read <b>' + per(st.unread) + '</b> objective' + (per(st.unread) === 1 ? '' : 's') + ' (' + st.unread + ' left)');
    if (st.assign) items.push('finish <b>' + per(st.assign) + '</b> assignment' + (per(st.assign) === 1 ? '' : 's') + ' (' + st.assign + ' left)');
    if (st.unseen) items.push('answer <b>' + per(st.unseen) + '</b> new question' + (per(st.unseen) === 1 ? '' : 's') + ' (' + st.unseen + ' unseen)');
    if (st.missed) items.push('review the <b>' + st.missed + '</b> question' + (st.missed === 1 ? '' : 's') + ' you missed');
    if (st.weak) items.push('drill your weakest objectives (' + st.weak + ' under 80%)');
    const mockLeft = Math.max(0, 3 - st.mocks);
    if (mockLeft && days > 3) items.push('take ' + mockLeft + ' more mock exam' + (mockLeft === 1 ? '' : 's') + ' before the date');
    const r = examReadiness(ex);
    return '<div class="card" style="margin-top:1rem">' + head +
      '<p style="margin:.2rem 0 .5rem"><b>' + (days === 0 ? 'Exam day is today.' : days + ' day' + (days === 1 ? '' : 's') + ' to go.') + '</b></p>' +
      (items.length ? '<p class="lead" style="margin:0">Today: ' + items.join('; ') + '.</p>' : '<p class="lead" style="margin:0">Everything built is done. Keep taking mock exams and reviewing weak spots.</p>') +
      (r.builtWeight < r.totalWeight ? '<p class="lead" style="margin:.6rem 0 0;font-size:.85rem">This plan covers the ' + r.builtWeight + '% of the exam that has content so far.</p>' : '') +
      '<p style="margin:.6rem 0 0"><button class="btn sm ghost" data-act="clearDate">Clear date</button></p></div>';
  }
  function backupBanner() {
    if (!hasProgress(S)) return '';
    if (!storageOK) return '<div class="callout warn" style="margin-top:1rem"><b>Progress cannot be saved in this browser</b>Storage is blocked or full. Export a backup now so you do not lose your work. <button class="btn sm" data-act="bkExport">Export backup</button></div>';
    if (P.file && P.fileState === 'ok') return '';
    if (P.file && P.fileState === 'needs-permission') return '<div class="callout" style="margin-top:1rem"><b>Auto-backup is paused</b>Allow the app to write to your backup file again. <button class="btn sm" data-act="reconnect">Allow</button></div>';
    const last = S.meta.lastBackup || 0;
    if (last && (Date.now() - last) / 864e5 < 7) return '';
    return '<div class="callout" style="margin-top:1rem"><b>Back up your progress</b>Your progress is stored in this browser only. ' + (P.supportFile ? 'Connect an auto-backup file in Settings, or ' : '') + 'export a copy now. <button class="btn sm" data-act="bkExport">Export backup</button> <a class="btn sm" href="#/settings">Settings</a></div>';
  }

  function viewHome() {
    const ex = curExam(); const r = examReadiness(ex); const v = verdict(r.overall);
    const all = CT.questions({}); const st = scopeStats(all);
    const assignDone = Object.values(S.assignments).filter((a) => a.done).length;
    const next = nextStep(ex);
    app.innerHTML =
      '<h1>Dashboard</h1><p class="lead">Notes, assignments, tests and a readiness score for the CompTIA security exams. Pick an exam to see where you stand.</p>' +
      examTabs('setExam') +
      '<div class="grid c2">' +
        '<div class="card row">' + ring(r.overall, 'overall') +
          '<div><h3>' + esc(ex.name) + ' <small class="lead">' + esc(ex.code) + '</small></h3>' +
          pill(v[0], v[1]) +
          '<p class="lead" style="margin-top:.6rem">Built domains cover ' + r.builtWeight + '% of the exam. Readiness on those: <b>' + pct(r.built) + '%</b>.</p></div></div>' +
        '<div class="card"><div class="grid c3">' +
          '<div class="stat"><b>' + st.att + '</b><span>questions answered</span></div>' +
          '<div class="stat"><b>' + (st.att ? pct(st.cor / st.att) + '%' : '–') + '</b><span>lifetime accuracy</span></div>' +
          '<div class="stat"><b>' + assignDone + '</b><span>assignments done</span></div>' +
          '<div class="stat"><b>' + streak() + '</b><span>day streak</span></div>' +
          '<div class="stat"><b>' + S.attempts.filter((a) => a.kind === 'mock').length + '</b><span>mock exams</span></div>' +
          '<div class="stat"><b>' + Object.keys(S.read).length + '</b><span>objectives read</span></div>' +
          '<div class="stat"><b>' + (CT.labs ? CT.labs.stats(S).done : 0) + '</b><span>labs completed</span></div>' +
        '</div></div>' +
      '</div>' +
      backupBanner() +
      '<div class="card" style="margin-top:1rem"><div class="row between"><div><h3>Your next best step</h3><p class="lead" style="margin:0">' + esc(next.text) + '</p></div><a class="btn primary" href="' + next.href + '">' + esc(next.cta) + '</a></div></div>' + planHTML(ex) +
      '<h2 style="margin-top:1.6rem">Domains</h2><div class="list">' +
      ex.domains.map((d) => {
        const dr = domainReadiness(ex.id, d);
        return '<a class="item" href="#/study/' + ex.id + '/' + d.id + '"><div style="flex:1"><div class="t"><span class="num">D' + d.n + '</span>' + esc(d.name) + '</div><div class="s">' + d.weight + '% of exam' + (dr.built ? ' · ' + dr.seen + '/' + dr.total + ' questions seen' : '') + '</div>' + (dr.built ? bar(pct(dr.r), dr.r >= .8 ? 'green' : dr.r >= .6 ? 'amber' : 'red') : '') + '</div>' + (dr.built ? pill(pct(dr.r) + '%', dr.r >= .8 ? 'ok' : dr.r >= .6 ? 'warn' : 'bad') : pill('Coming soon', 'soon')) + '</a>';
      }).join('') + '</div>';
    H.setExam = (t) => { S.prefs.exam = t.dataset.id; save(); viewHome(); route(); };
    H.setDate = (t) => { if (t.value) S.prefs.dates[ex.id] = t.value; else delete S.prefs.dates[ex.id]; save(); viewHome(); };
    H.clearDate = () => { delete S.prefs.dates[ex.id]; save(); viewHome(); };
    H.bkExport = () => { exportBackup(); toast('Backup downloaded'); viewHome(); };
    H.reconnect = async () => { const ok = await writeFile(null, true); toast(ok ? 'Auto-backup resumed' : 'Permission was not granted'); viewHome(); };
  }

  /* ================================================================== STUDY */
  function viewStudy(p) {
    if (!p[0]) return studyIndex();
    const ex = CT.exam(p[0]); if (!ex) return studyIndex();
    if (!p[1]) return studyExam(ex);
    const dom = CT.domain(ex.id, p[1]); if (!dom) return studyExam(ex);
    if (!p[2]) return studyDomain(ex, dom);
    if (p[2] === 'capstone') return studyCapstone(ex, dom);
    const obj = dom.objectives.find((o) => o.id === p[2]); if (!obj) return studyDomain(ex, dom);
    return studyObjective(ex, dom, obj, p[3] || 'notes');
  }

  function studyIndex() {
    app.innerHTML = '<h1>Study</h1><p class="lead">Choose an exam. Each domain has notes for every objective, key terms, hands-on assignments and quizzes.</p><div class="grid c2">' +
      CT.exams.map((e) => {
        const built = e.domains.filter((d) => CT.isBuilt(e.id, d.id)).length;
        const r = examReadiness(e);
        return '<a class="card" href="#/study/' + e.id + '" style="color:inherit;display:block"><div class="row between"><h2>' + esc(e.name) + '</h2>' + pill(e.level) + '</div><p class="lead">' + esc(e.code) + ' · ' + esc(e.blurb) + '</p>' +
          '<div class="s lead">' + built + ' of ' + e.domains.length + ' domains built</div>' + bar(pct(r.overall)) + '</a>';
      }).join('') + '</div>';
  }

  function studyExam(ex) {
    const r = examReadiness(ex);
    app.innerHTML = '<div class="crumbs"><a href="#/study">Study</a>›<span>' + esc(ex.name) + '</span></div>' +
      '<h1>' + esc(ex.name) + ' <small class="lead">' + esc(ex.code) + '</small></h1><p class="lead">' + esc(ex.blurb) + '</p>' +
      '<div class="card"><div class="grid c3">' +
        '<div class="stat"><b>' + ex.maxQuestions + '</b><span>questions (maximum)</span></div>' +
        '<div class="stat"><b>' + ex.minutes + ' min</b><span>exam time</span></div>' +
        '<div class="stat"><b style="font-size:1.05rem">' + esc(ex.passing) + '</b><span>passing score</span></div></div>' +
      '<p class="lead" style="margin:.8rem 0 0;font-size:.85rem">Exam format and scoring change from time to time. Confirm the current details on comptia.org before you book.</p></div>' +
      '<h2 style="margin-top:1.4rem">Domains</h2><div class="list">' +
      ex.domains.map((d) => {
        const dr = domainReadiness(ex.id, d);
        return '<a class="item" href="#/study/' + ex.id + '/' + d.id + '"><div><div class="t"><span class="num">D' + d.n + '</span>' + esc(d.name) + '</div><div class="s">' + d.weight + '% of exam' + (d.objectives.length ? ' · ' + d.objectives.length + ' objectives' : '') + '</div></div>' + (dr.built ? pill(pct(dr.r) + '% ready', dr.r >= .8 ? 'ok' : dr.r >= .6 ? 'warn' : 'bad') : pill('Coming soon', 'soon')) + '</a>';
      }).join('') + '</div>' +
      '<div class="row" style="margin-top:1.2rem"><a class="btn" href="#/readiness">Readiness report</a></div>';
    void r;
  }

  function studyDomain(ex, dom) {
    const built = CT.isBuilt(ex.id, dom.id);
    const head = '<div class="crumbs"><a href="#/study">Study</a>›<a href="#/study/' + ex.id + '">' + esc(ex.name) + '</a>›<span>Domain ' + dom.n + '</span></div>' +
      '<h1>Domain ' + dom.n + ': ' + esc(dom.name) + '</h1><p class="lead">' + dom.weight + '% of the ' + esc(ex.name) + ' exam.</p>';
    if (!built) {
      app.innerHTML = head + '<div class="card empty"><h3>This domain has not been built yet</h3><p>' +
        (dom.objectives.length ? 'The ' + dom.objectives.length + ' objectives below will each get notes, key terms, an assignment and a quiz.' : 'Its objectives, notes, assignments and quizzes arrive in a later build.') + '</p></div>' +
        (dom.objectives.length ? '<div class="list" style="margin-top:1rem">' + dom.objectives.map((o) => '<div class="item locked"><div><div class="t"><span class="num">' + o.id + '</span>' + esc(o.title) + '</div></div>' + pill('Coming soon', 'soon') + '</div>').join('') + '</div>' : '');
      return;
    }
    const dst = scopeStats(CT.questions({ exam: ex.id, dom: dom.id }));
    const cap = CT.content_for(ex.id, dom.id).capstone; const capS = cap ? S.assignments[cap.id] : null;
    app.innerHTML = head +
      '<div class="row" style="margin-bottom:1rem"><button class="btn primary" data-act="domQuiz">Domain quiz (' + dst.total + ' questions)</button><button class="btn" data-act="domFlash">Flashcards</button></div>' +
      '<div class="list">' +
      dom.objectives.map((o) => {
        const s = objectiveStatus(ex.id, dom.id, o);
        return '<a class="item" href="#/study/' + ex.id + '/' + dom.id + '/' + o.id + '/notes"><div><div class="t"><span class="num">' + o.id + '</span>' + esc(o.title) + '</div><div class="s">' + (s.q.seen ? s.q.seen + '/' + s.q.total + ' questions seen · ' + pct(s.q.acc) + '% accuracy' : s.q.total + ' questions') + '</div></div><div class="row">' + pill(s.read ? 'Notes ✓' : 'Notes', s.read ? 'ok' : '') + pill(s.assignDone ? 'Assignment ✓' : 'Assignment', s.assignDone ? 'ok' : '') + '</div></a>';
      }).join('') +
      (cap ? '<a class="item" href="#/study/' + ex.id + '/' + dom.id + '/capstone"><div><div class="t"><span class="num">★</span>' + esc(cap.title) + '</div><div class="s">Capstone assignment tying the whole domain together</div></div>' + pill(capS && capS.done ? 'Done ✓' : 'Capstone', capS && capS.done ? 'ok' : 'warn') + '</a>' : '') +
      '</div>';
    H.domQuiz = () => startQuiz({ kind: 'practice', title: 'Domain ' + dom.n + ' quiz', exam: ex.id, scope: { exam: ex.id, dom: dom.id }, count: 0 });
    H.domFlash = () => { startFlash({ exam: ex.id, dom: dom.id }, 'auto'); };
  }

  function studyObjective(ex, dom, obj, tab) {
    const c = CT.content_for(ex.id, dom.id);
    if (!c) return studyDomain(ex, dom);
    const idx = dom.objectives.indexOf(obj);
    const prev = dom.objectives[idx - 1], next = dom.objectives[idx + 1];
    const base = '#/study/' + ex.id + '/' + dom.id + '/' + obj.id + '/';
    const tabs = [['notes', 'Notes'], ['terms', 'Key terms'], ['assignment', 'Assignment'], ['quiz', 'Quiz']];
    const head = '<div class="crumbs"><a href="#/study">Study</a>›<a href="#/study/' + ex.id + '">' + esc(ex.name) + '</a>›<a href="#/study/' + ex.id + '/' + dom.id + '">Domain ' + dom.n + '</a>›<span>' + obj.id + '</span></div>' +
      '<h1><span class="num">' + obj.id + '</span>' + esc(obj.title) + '</h1>' +
      '<div class="row" style="margin:-.2rem 0 .8rem"><button class="btn sm ' + (S.marks['o:' + okey(ex.id, dom.id, obj.id)] ? 'primary' : '') + '" data-act="bmObj" aria-pressed="' + !!S.marks['o:' + okey(ex.id, dom.id, obj.id)] + '">' + (S.marks['o:' + okey(ex.id, dom.id, obj.id)] ? '★ Saved' : '☆ Save for later') + '</button></div>' +
      '<div class="tabs">' + tabs.map((t) => '<a class="tab ' + (t[0] === tab ? 'active' : '') + '"' + (t[0] === tab ? ' aria-current="page"' : '') + ' href="' + base + t[0] + '">' + t[1] + '</a>').join('') + '</div>';
    const relatedLabs = CT.labs && CT.labs.related ? CT.labs.related(ex.id, obj.id, esc, S) : '';
    const foot = relatedLabs + '<div class="row between" style="margin-top:1.6rem">' + (prev ? '<a class="btn" href="#/study/' + ex.id + '/' + dom.id + '/' + prev.id + '/notes">‹ ' + prev.id + '</a>' : '<span></span>') + (next ? '<a class="btn" href="#/study/' + ex.id + '/' + dom.id + '/' + next.id + '/notes">' + next.id + ' ›</a>' : '<a class="btn" href="#/study/' + ex.id + '/' + dom.id + '">Domain overview</a>') + '</div>';
    const key = okey(ex.id, dom.id, obj.id);
    H.bmObj = () => { const k = 'o:' + key; if (S.marks[k]) delete S.marks[k]; else S.marks[k] = Date.now(); save(); studyObjective(ex, dom, obj, tab); };

    if (tab === 'terms') {
      const terms = c.terms[obj.id] || [];
      app.innerHTML = head + '<div class="row" style="margin-bottom:1rem"><button class="btn primary" data-act="flashObj">Study as flashcards (' + terms.length + ')</button></div>' +
        '<div class="list">' + terms.map((t) => '<div class="card"><h3 style="color:var(--teal)">' + esc(t[0]) + '</h3><p style="margin:0">' + esc(t[1]) + '</p></div>').join('') + '</div>' + foot;
      H.flashObj = () => startFlash({ exam: ex.id, dom: dom.id, obj: obj.id }, 'auto');
    } else if (tab === 'assignment') {
      const a = c.assignments[obj.id]; if (!a) { app.innerHTML = head + '<div class="card empty">No assignment for this objective.</div>' + foot; return; }
      app.innerHTML = head + assignmentHTML(a) + foot; bindAssignment(a);
    } else if (tab === 'quiz') {
      const st = scopeStats(CT.questions({ exam: ex.id, dom: dom.id, obj: obj.id }));
      const missed = CT.questions({ exam: ex.id, dom: dom.id, obj: obj.id }).filter(isMissed).length;
      app.innerHTML = head + '<div class="card"><div class="grid c3">' +
        '<div class="stat"><b>' + st.total + '</b><span>questions in bank</span></div>' +
        '<div class="stat"><b>' + st.seen + '</b><span>seen</span></div>' +
        '<div class="stat"><b>' + (st.seen ? pct(st.acc) + '%' : '–') + '</b><span>current accuracy</span></div></div>' +
        bar(pct(st.seen ? st.acc * Math.min(1, st.coverage / .8) : 0)) +
        '<div class="row" style="margin-top:1rem"><button class="btn primary" data-act="qAll">Take all ' + st.total + ' questions</button><button class="btn" data-act="qMissed" ' + (missed ? '' : 'disabled') + '>Review missed (' + missed + ')</button></div></div>' + foot;
      H.qAll = () => startQuiz({ kind: 'practice', title: obj.id + ' quiz', exam: ex.id, scope: { exam: ex.id, dom: dom.id, obj: obj.id }, count: 0 });
      H.qMissed = () => startQuiz({ kind: 'practice', title: obj.id + ' missed questions', exam: ex.id, scope: { exam: ex.id, dom: dom.id, obj: obj.id }, filter: 'missed', count: 0 });
    } else {
      const done = !!S.read[key];
      app.innerHTML = head + '<div class="notes card">' + c.notes[obj.id] + '</div>' +
        '<div class="card" style="margin-top:1rem"><h3>My notes</h3><textarea data-inp="myNote" aria-label="My notes for ' + esc(obj.id) + '" placeholder="Your own notes for this objective. Saved on this device as you type.">' + esc(S.notes[key] || '') + '</textarea></div>' +
        '<div class="row" style="margin-top:1rem"><button class="btn ' + (done ? '' : 'primary') + '" data-act="toggleRead">' + (done ? '✓ Marked as read (undo)' : 'Mark notes as read') + '</button><a class="btn" href="' + base + 'terms">Key terms ›</a></div>' + foot;
      H.myNote = (t) => { if (t.value.trim()) S.notes[key] = t.value; else delete S.notes[key]; save(); };
      H.toggleRead = () => { if (S.read[key]) delete S.read[key]; else { S.read[key] = Date.now(); touch(); toast('Notes marked as read'); } save(); studyObjective(ex, dom, obj, 'notes'); };
    }
  }

  function studyCapstone(ex, dom) {
    const c = CT.content_for(ex.id, dom.id); const a = c && c.capstone;
    if (!a) return studyDomain(ex, dom);
    app.innerHTML = '<div class="crumbs"><a href="#/study">Study</a>›<a href="#/study/' + ex.id + '/' + dom.id + '">Domain ' + dom.n + '</a>›<span>Capstone</span></div><h1>★ ' + esc(a.title) + '</h1>' + assignmentHTML(a) +
      '<div class="row" style="margin-top:1.4rem"><a class="btn" href="#/study/' + ex.id + '/' + dom.id + '">Domain overview</a></div>';
    bindAssignment(a);
  }

  function assignmentState(a) {
    const s = S.assignments[a.id] || (S.assignments[a.id] = { tasks: a.tasks.map(() => false), text: '', done: false, ts: 0 });
    if (s.tasks.length !== a.tasks.length) s.tasks = a.tasks.map((_, i) => !!s.tasks[i]);
    return s;
  }
  function assignmentHTML(a) {
    const s = assignmentState(a); const n = s.tasks.filter(Boolean).length;
    return '<div class="card"><h3>Scenario</h3><p>' + esc(a.scenario) + '</p>' +
      '<h3>Tasks <small class="lead" id="aProg">(' + n + '/' + a.tasks.length + ' complete)</small></h3>' +
      a.tasks.map((t, i) => '<label class="task"><input type="checkbox" data-chg="taskChk" data-i="' + i + '" ' + (s.tasks[i] ? 'checked' : '') + '><span>' + esc(t) + '</span></label>').join('') +
      '<h3 style="margin-top:1.1rem">Deliverable</h3><p>' + esc(a.deliverable) + '</p>' +
      '<textarea data-inp="aText" placeholder="Paste your answers, tables or lab notes here. They are saved on this device as you type.">' + esc(s.text) + '</textarea>' +
      '<details class="rubric"><summary>Self-assessment rubric</summary><ul>' + a.rubric.map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul></details>' +
      '<p id="aDone" style="margin:.9rem 0 0">' + (s.done ? pill('Assignment complete', 'ok') : '') + '</p></div>';
  }
  function bindAssignment(a) {
    const s = assignmentState(a);
    H.taskChk = (t) => {
      s.tasks[+t.dataset.i] = t.checked;
      const n = s.tasks.filter(Boolean).length; const was = s.done;
      s.done = n === a.tasks.length; s.ts = Date.now(); touch(); save();
      $('#aProg').textContent = '(' + n + '/' + a.tasks.length + ' complete)';
      $('#aDone').innerHTML = s.done ? pill('Assignment complete', 'ok') : '';
      if (s.done && !was) toast('Assignment complete');
    };
    H.aText = (t) => { s.text = t.value; save(); };
  }

  /* ================================================================== QUIZ ENGINE */
  let Q = null;      // active session
  let LAST = null;   // last finished session (for results page)
  const isMissed = (q) => { const a = S.answers[q.id]; return !!(a && a.h.length && a.h[a.h.length - 1] === 0); };

  function makeItem(q) {
    const item = { q, answered: false, flagged: false, correct: null };
    if (q.type === 'match') { item.sel = {}; item.rorder = shuffle(q.pairs.map((p) => p[1])); }
    else if (q.type === 'sort') { item.sel = {}; }
    else if (q.type === 'order') { let o = q.steps.map((_, i) => i), n = 0; do { o = shuffle(o); n++; } while (o.every((v, i) => v === i) && n < 10); item.sel = o; }
    else { item.sel = q.type === 'multi' ? [] : null; item.order = shuffle(q.options.map((_, i) => i)); }
    return item;
  }
  function hasAnswer(item) {
    const q = item.q;
    if (q.type === 'match') return q.pairs.every((_, i) => item.sel[i]);
    if (q.type === 'sort') return q.items.every((_, i) => item.sel[i]);
    if (q.type === 'order') return true;
    if (q.type === 'multi') return item.sel.length > 0;
    return item.sel !== null;
  }
  function grade(item) {
    const q = item.q;
    if (q.type === 'match') return q.pairs.every((p, i) => item.sel[i] === p[1]);
    if (q.type === 'sort') return q.items.every((it, i) => item.sel[i] === it.c);
    if (q.type === 'order') return item.sel.every((v, i) => v === i);
    if (q.type === 'multi') { const a = q.answer.slice().sort().join(','), b = item.sel.slice().sort().join(','); return a === b; }
    return item.sel === q.answer;
  }
  function answerText(item, which) {
    const q = item.q;
    if (q.type === 'match') return q.pairs.map((p, i) => p[0] + ' → ' + (which === 'right' ? p[1] : (item.sel[i] || 'no answer'))).join('; ');
    if (q.type === 'sort') return q.items.map((it, i) => it.t + ' → ' + (which === 'right' ? it.c : (item.sel[i] || 'no answer'))).join('; ');
    if (q.type === 'order') return (which === 'right' ? q.steps : item.sel.map((i) => q.steps[i])).map((t, i) => (i + 1) + '. ' + t).join('  ');
    if (q.type === 'multi') { const ids = which === 'right' ? q.answer : item.sel; return ids.length ? ids.slice().sort().map((i) => q.options[i]).join('; ') : 'No answer'; }
    const i = which === 'right' ? q.answer : item.sel; return i === null ? 'No answer' : q.options[i];
  }

  function startQuiz(o) {
    let pool = CT.questions(o.scope || {});
    if (o.filter === 'missed') pool = pool.filter(isMissed);
    if (o.filter === 'unseen') pool = pool.filter((q) => !S.answers[q.id]);
    if (o.filter === 'saved') pool = pool.filter((q) => S.marks['q:' + q.id]);
    if (!pool.length) { toast('No questions match that selection yet'); return; }
    pool = shuffle(pool);
    if (o.count && o.count < pool.length) pool = pool.slice(0, o.count);
    Q = { kind: o.kind || 'practice', title: o.title, exam: o.exam, items: pool.map(makeItem), idx: 0, start: Date.now(), limit: o.limit || 0 };
    if (Q.limit) Q.end = Q.start + Q.limit * 1000;
    nav('#/quiz');
  }

  function viewQuiz() {
    if (!Q) { nav('#/practice'); return; }
    renderQuiz();
    if (Q.limit) {
      timers.push(setInterval(() => {
        const left = (Q.end - Date.now()) / 1000; const el = $('#timer');
        if (el) { el.textContent = fmtTime(left); el.classList.toggle('low', left < 300); }
        if (left <= 0) { toast('Time is up: submitting your exam'); finishQuiz(); }
      }, 1000));
    }
  }

  function optionsHTML(item, fb) {
    const q = item.q;
    if (q.type === 'match') {
      return '<div class="match">' + q.pairs.map((p, i) => {
        const cls = fb ? (item.sel[i] === p[1] ? 'right' : 'wrong') : '';
        return '<div class="left">' + esc(p[0]) + '</div><select class="' + cls + '" aria-label="Match: ' + esc(p[0]) + '" data-chg="matchSel" data-l="' + i + '" ' + (fb ? 'disabled' : '') + '><option value="">Select…</option>' +
          item.rorder.map((r) => '<option value="' + esc(r) + '" ' + (item.sel[i] === r ? 'selected' : '') + '>' + esc(r) + '</option>').join('') + '</select>';
      }).join('') + '</div>';
    }
    if (q.type === 'sort') {
      return '<div class="match">' + q.items.map((it, i) => {
        const cls = fb ? (item.sel[i] === it.c ? 'right' : 'wrong') : '';
        return '<div class="left">' + esc(it.t) + '</div><select class="' + cls + '" aria-label="Category for: ' + esc(it.t) + '" data-chg="matchSel" data-l="' + i + '" ' + (fb ? 'disabled' : '') + '><option value="">Select…</option>' +
          q.categories.map((c) => '<option value="' + esc(c) + '" ' + (item.sel[i] === c ? 'selected' : '') + '>' + esc(c) + '</option>').join('') + '</select>';
      }).join('') + '</div>';
    }
    if (q.type === 'order') {
      const last = item.sel.length - 1;
      return '<ol class="order">' + item.sel.map((si, pos) => '<li class="' + (fb ? (si === pos ? 'right' : 'wrong') : '') + '"><span class="ot">' + esc(q.steps[si]) + '</span>' +
        (fb ? '' : '<span class="ob"><button class="btn sm" data-act="mv" data-p="' + pos + '" data-d="-1" aria-label="Move up: ' + esc(q.steps[si]) + '" ' + (pos === 0 ? 'disabled' : '') + '>▲</button><button class="btn sm" data-act="mv" data-p="' + pos + '" data-d="1" aria-label="Move down: ' + esc(q.steps[si]) + '" ' + (pos === last ? 'disabled' : '') + '>▼</button></span>') + '</li>').join('') + '</ol>';
    }
    const ans = q.type === 'multi' ? q.answer : [q.answer];
    const sel = q.type === 'multi' ? item.sel : (item.sel === null ? [] : [item.sel]);
    return '<div class="opts" role="group" aria-label="Answer options">' + item.order.map((oi, pos) => {
      let cls = sel.indexOf(oi) >= 0 ? 'sel' : '';
      if (fb) { const isA = ans.indexOf(oi) >= 0, isS = sel.indexOf(oi) >= 0; cls = isA && isS ? 'right' : isS ? 'wrong' : isA ? 'missed' : ''; }
      return '<button class="opt ' + cls + '" aria-pressed="' + (sel.indexOf(oi) >= 0) + '" data-act="pick" data-i="' + oi + '" ' + (fb ? 'disabled' : '') + '><span class="k">' + letter(pos) + '</span><span>' + esc(q.options[oi]) + '</span></button>';
    }).join('') + '</div>';
  }

  function renderQuiz() {
    const item = Q.items[Q.idx]; const q = item.q; const mock = Q.kind === 'mock';
    const fb = !mock && item.answered;
    const total = Q.items.length;
    const hints = { multi: 'Select ' + (q.answer ? q.answer.length : '') + '.', match: 'Match every item.', sort: 'Assign every item to a category.', order: 'Arrange the steps in the correct order with the arrows. The order you leave is your answer.' };
    const hint = hints[q.type] ? '<p class="lead" style="margin:-.4rem 0 .8rem">' + hints[q.type] + '</p>' : '';
    const practical = q.type === 'order' || q.type === 'sort' || q.exhibit;
    let html = '<div class="qwrap"><div class="qhead"><div><b>' + esc(Q.title) + '</b> <span class="lead">· Question ' + (Q.idx + 1) + ' of ' + total + '</span>' + (practical ? ' ' + pill('Practical', 'soon') : '') + '</div><div class="row">' +
      (Q.limit ? '<span class="timer" id="timer" role="timer" aria-label="Time left">' + fmtTime((Q.end - Date.now()) / 1000) + '</span>' : '') +
      '<button class="btn sm ' + (S.marks['q:' + q.id] ? 'primary' : '') + '" data-act="bmQ" aria-pressed="' + !!S.marks['q:' + q.id] + '">' + (S.marks['q:' + q.id] ? '★ Saved' : '☆ Save') + '</button>' +
      (mock ? '<button class="btn sm ' + (item.flagged ? 'primary' : '') + '" data-act="flag" aria-pressed="' + item.flagged + '">⚑ ' + (item.flagged ? 'Flagged' : 'Flag') + '</button>' : '') +
      '<button class="btn sm warn" data-act="end">' + (mock ? 'Submit exam' : 'End session') + '</button></div></div>';
    html += bar(pct((Q.idx + (fb ? 1 : 0)) / total));
    html += '<div class="spacer"></div><div class="card"><div class="qtext">' + esc(q.q) + '</div>' + (q.exhibit ? '<pre class="exhibit" tabindex="0" aria-label="Exhibit">' + esc(q.exhibit) + '</pre>' : '') + hint + optionsHTML(item, fb);
    if (fb) {
      html += '<div class="callout ' + (item.correct ? 'tip' : 'warn') + ' explain"><b>' + (item.correct ? 'Correct' : 'Not quite') + '</b>' +
        (item.correct ? '' : q.type === 'order' ? 'Correct order:<ol>' + q.steps.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ol>' : 'Correct answer: ' + esc(answerText(item, 'right')) + '<br>') + esc(q.explain) + '</div>';
    }
    html += '</div><div class="row between" style="margin-top:1rem">';
    if (mock) {
      html += '<button class="btn" data-act="prev" ' + (Q.idx === 0 ? 'disabled' : '') + '>‹ Previous</button><button class="btn primary" data-act="next" ' + (Q.idx === total - 1 ? 'disabled' : '') + '>Next ›</button></div>' +
        '<div class="qnav">' + Q.items.map((it, i) => '<button class="' + (hasAnswer(it) && (it.q.type !== 'order' || it.moved) ? 'done ' : '') + (it.flagged ? 'flag ' : '') + (i === Q.idx ? 'cur' : '') + '" data-act="goto" data-i="' + i + '" aria-label="Question ' + (i + 1) + (it.flagged ? ', flagged' : '') + '">' + (i + 1) + '</button>').join('') + '</div>';
    } else {
      html += '<span></span>' + (fb ? '<button class="btn primary" data-act="next">' + (Q.idx === total - 1 ? 'Finish' : 'Next ›') + '</button>' : '<button class="btn primary" id="checkBtn" data-act="check" ' + (hasAnswer(item) ? '' : 'disabled') + '>Check answer</button>') + '</div>';
    }
    html += '</div>';
    app.innerHTML = html;

    H.pick = (t) => {
      if (item.answered && !mock) return; const i = +t.dataset.i;
      if (q.type === 'multi') { const k = item.sel.indexOf(i); if (k >= 0) item.sel.splice(k, 1); else item.sel.push(i); } else item.sel = i;
      renderQuiz();
    };
    H.matchSel = (t) => { item.sel[+t.dataset.l] = t.value; const b = $('#checkBtn'); if (b) b.disabled = !hasAnswer(item); };
    H.mv = (t) => {
      const p = +t.dataset.p, d = +t.dataset.d, np = p + d; if (np < 0 || np >= item.sel.length) return;
      const x = item.sel[p]; item.sel[p] = item.sel[np]; item.sel[np] = x; item.moved = true; renderQuiz();
      const b = app.querySelector('[data-act="mv"][data-p="' + np + '"][data-d="' + d + '"]') || app.querySelector('[data-act="mv"][data-p="' + np + '"]:not([disabled])'); if (b && !b.disabled) b.focus();
    };
    H.bmQ = () => { const k = 'q:' + q.id; if (S.marks[k]) delete S.marks[k]; else S.marks[k] = Date.now(); save(); renderQuiz(); };
    H.check = () => { if (!hasAnswer(item)) return; item.answered = true; item.correct = grade(item); record(q.id, item.correct); renderQuiz(); };
    H.next = () => { if (Q.idx >= total - 1) { if (!mock) finishQuiz(); return; } Q.idx++; renderQuiz(); window.scrollTo(0, 0); };
    H.prev = () => { if (Q.idx > 0) { Q.idx--; renderQuiz(); } };
    H.goto = (t) => { Q.idx = +t.dataset.i; renderQuiz(); window.scrollTo(0, 0); };
    H.flag = () => { item.flagged = !item.flagged; renderQuiz(); };
    H.end = () => {
      if (mock) {
        const un = Q.items.filter((it) => !hasAnswer(it)).length;
        if (!confirm(un ? un + ' question(s) are unanswered. Submit the exam anyway?' : 'Submit your exam now?')) return;
      } else if (!Q.items.some((it) => it.answered) && !confirm('End this session without answering anything?')) return;
      finishQuiz();
    };
  }

  function finishQuiz() {
    if (!Q) return;
    clearTimers();
    const mock = Q.kind === 'mock';
    Q.items.forEach((it) => {
      if (mock) { if (hasAnswer(it)) { it.correct = grade(it); } else it.correct = false; it.answered = hasAnswer(it); if (it.answered) record(it.q.id, it.correct); }
    });
    const answered = Q.items.filter((it) => it.answered);
    if (!answered.length) { Q = null; nav('#/practice'); return; }
    const total = mock ? Q.items.length : answered.length;
    const correct = answered.filter((it) => it.correct).length;
    const byObj = {}, byDom = {};
    (mock ? Q.items : answered).forEach((it) => {
      const k = it.q.exam + ' ' + it.q.obj; (byObj[k] = byObj[k] || { exam: it.q.exam, dom: it.q.dom, obj: it.q.obj, c: 0, t: 0 }); byObj[k].t++; if (it.correct) byObj[k].c++;
      const d = it.q.exam + ':' + it.q.dom; (byDom[d] = byDom[d] || [0, 0]); byDom[d][1]++; if (it.correct) byDom[d][0]++;
    });
    const secs = Math.round((Date.now() - Q.start) / 1000);
    S.attempts.push({ ts: Date.now(), kind: Q.kind, exam: Q.exam, title: Q.title, total, correct, secs, byDom });
    if (S.attempts.length > 120) S.attempts = S.attempts.slice(-120);
    touch(); save();
    LAST = { kind: Q.kind, title: Q.title, exam: Q.exam, items: Q.items, total, correct, answered: answered.length, secs, byObj, byDom, limit: Q.limit || 0, flagged: Q.items.filter((it) => it.flagged).length, filter: 'all' };
    Q = null;
    nav('#/results');
  }

  function viewResults() {
    if (!LAST) { nav('#/practice'); return; }
    const R = LAST; const ex = CT.exam(R.exam) || curExam(); const p = R.total ? R.correct / R.total : 0;
    const band = p >= 0.8 ? ['On target', 'ok'] : p >= 0.7 ? ['Close', 'warn'] : ['Keep studying', 'bad'];
    const objs = Object.values(R.byObj).sort((a, b) => a.c / a.t - b.c / b.t);
    const list = R.items.filter((it) => (R.kind === 'mock' || it.answered) && (R.filter === 'all' || !it.correct));
    const doms = Object.keys(R.byDom || {}).map((k) => { const kk = k.split(':'); const dm = CT.domain(kk[0], kk[1]); return { name: dm ? 'D' + dm.n + ' ' + dm.name : k, w: dm ? dm.weight : 0, c: R.byDom[k][0], t: R.byDom[k][1] }; }).sort((a, b) => a.c / a.t - b.c / b.t);
    const wsum = doms.reduce((x, d) => x + d.w, 0); const wscore = wsum ? doms.reduce((x, d) => x + d.w * d.c / d.t, 0) / wsum : p;
    const nq = R.items.length; const unans = R.items.filter((it) => !it.answered).length;
    const domCard = (R.kind === 'mock' || doms.length > 1) ? '<div class="card" style="margin-top:1rem"><h3>By domain' + (R.kind === 'mock' ? ' and pace' : '') + '</h3>' +
      doms.map((d) => { const dp = d.c / d.t; return '<div style="margin-bottom:.6rem"><div class="row between"><span>' + esc(d.name) + ' <span class="lead">(' + d.w + '% of exam)</span></span><span class="lead">' + d.c + '/' + d.t + ' · ' + pct(dp) + '%</span></div>' + bar(pct(dp), dp >= .8 ? 'green' : dp >= .6 ? 'amber' : 'red') + '</div>'; }).join('') +
      (doms.length > 1 ? '<p class="lead" style="margin:.4rem 0 0">Weighted by exam percentages, this attempt scores <b>' + pct(wscore) + '%</b>.</p>' : '') +
      (R.kind === 'mock' && R.limit ? '<p class="lead" style="margin:.4rem 0 0">Pace: <b>' + fmtTime(R.secs / Math.max(1, nq)) + '</b> per question (about ' + fmtTime(R.limit / Math.max(1, nq)) + ' allowed). ' + (unans ? unans + ' unanswered. ' : '') + (R.flagged ? R.flagged + ' flagged for review.' : '') + '</p>' : '') + '</div>' : '';
    app.innerHTML = '<h1>Results: ' + esc(R.title) + '</h1>' +
      '<div class="grid c2"><div class="card row">' + ring(p, R.correct + '/' + R.total) + '<div><h3>' + pct(p) + '% correct</h3>' + pill(band[0], band[1]) +
      '<p class="lead" style="margin:.6rem 0 0">Time: ' + fmtTime(R.secs) + (R.kind === 'mock' ? '<br>Aim for 80%+ consistently across several mock exams.' : '') + '</p></div></div>' +
      '<div class="card"><h3>By objective</h3>' + objs.map((o) => { const op = o.c / o.t; return '<div style="margin-bottom:.6rem"><div class="row between"><span><span class="num">' + esc(o.obj) + '</span>' + o.c + '/' + o.t + '</span><span class="lead">' + pct(op) + '%</span></div>' + bar(pct(op), op >= .8 ? 'green' : op >= .6 ? 'amber' : 'red') + '</div>'; }).join('') + '</div></div>' +
      domCard +
      '<div class="row" style="margin:1.2rem 0"><button class="btn ' + (R.filter === 'all' ? 'primary' : '') + '" data-act="fAll">All questions</button><button class="btn ' + (R.filter === 'wrong' ? 'primary' : '') + '" data-act="fWrong">Missed only</button><a class="btn" href="#/practice">Practice more</a><a class="btn" href="#/readiness">Readiness</a></div>' +
      '<div class="stack">' + (list.length ? list.map((it, i) => {
        return '<div class="card"><div class="row between"><b>Q' + (R.items.indexOf(it) + 1) + '</b>' + pill(it.correct ? 'Correct' : (it.answered ? 'Incorrect' : 'Unanswered'), it.correct ? 'ok' : 'bad') + '</div>' +
          '<p class="qtext" style="margin-top:.5rem">' + esc(it.q.q) + '</p><p><b>Your answer:</b> ' + esc(answerText(it, 'mine')) + '</p>' + (it.correct ? '' : it.q.type === 'order' ? '<p><b>Correct order:</b></p><ol>' + it.q.steps.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ol>' : '<p><b>Correct answer:</b> ' + esc(answerText(it, 'right')) + '</p>') +
          '<div class="callout tip" style="margin:0"><b>Why</b>' + esc(it.q.explain) + '</div></div>';
      }).join('') : '<div class="card empty">Nothing to show here. Great work.</div>') + '</div>';
    void ex;
    H.fAll = () => { R.filter = 'all'; viewResults(); };
    H.fWrong = () => { R.filter = 'wrong'; viewResults(); };
  }

  /* ================================================================== PRACTICE SETUP */
  const PS = { exam: null, dom: '', obj: '', count: 10, filter: 'all' };
  function viewPractice() {
    if (!PS.exam) PS.exam = curExam().id;
    const ex = CT.exam(PS.exam);
    const builtDoms = ex.domains.filter((d) => CT.isBuilt(ex.id, d.id));
    if (PS.dom && !builtDoms.find((d) => d.id === PS.dom)) { PS.dom = ''; PS.obj = ''; }
    const dom = builtDoms.find((d) => d.id === PS.dom);
    const pool = CT.questions({ exam: ex.id, dom: PS.dom || undefined, obj: PS.obj || undefined });
    const missedAll = CT.questions({}).filter(isMissed).length;
    const savedAll = CT.questions({}).filter((q) => S.marks['q:' + q.id]).length;
    const weak = weakObjectives(curExam()).filter((w) => w.score < 0.8)[0];
    app.innerHTML = '<h1>Practice</h1><p class="lead">Instant feedback with an explanation after every question. Everything you answer feeds your readiness score.</p>' +
      '<div class="card"><div class="grid c3">' +
      '<label>Exam<select data-chg="psExam">' + CT.exams.map((e) => '<option value="' + e.id + '" ' + (e.id === ex.id ? 'selected' : '') + '>' + esc(e.name) + '</option>').join('') + '</select></label>' +
      '<label>Domain<select data-chg="psDom"><option value="">All built domains</option>' + builtDoms.map((d) => '<option value="' + d.id + '" ' + (d.id === PS.dom ? 'selected' : '') + '>D' + d.n + ' ' + esc(d.name) + '</option>').join('') + '</select></label>' +
      '<label>Objective<select data-chg="psObj" ' + (dom ? '' : 'disabled') + '><option value="">All objectives</option>' + (dom ? dom.objectives.map((o) => '<option value="' + o.id + '" ' + (o.id === PS.obj ? 'selected' : '') + '>' + o.id + ' ' + esc(o.title.slice(0, 54)) + '</option>').join('') : '') + '</select></label>' +
      '<label>Questions<select data-chg="psCount">' + [10, 20, 40, 0].map((n) => '<option value="' + n + '" ' + (n === PS.count ? 'selected' : '') + '>' + (n || 'All available') + '</option>').join('') + '</select></label>' +
      '<label>Include<select data-chg="psFilter">' + [['all', 'All questions'], ['unseen', 'Not yet seen'], ['missed', 'Previously missed'], ['saved', 'Saved questions']].map((f) => '<option value="' + f[0] + '" ' + (f[0] === PS.filter ? 'selected' : '') + '>' + f[1] + '</option>').join('') + '</select></label>' +
      '</div><p class="lead" style="margin:.9rem 0">' + (builtDoms.length ? pool.length + ' questions in this selection.' : 'No domains are built for this exam yet.') + '</p>' +
      '<button class="btn primary" data-act="psStart" ' + (pool.length ? '' : 'disabled') + '>Start practice</button></div>' +
      '<h2 style="margin-top:1.6rem">Quick starts</h2><div class="row">' +
      '<button class="btn" data-act="qsMissed" ' + (missedAll ? '' : 'disabled') + '>Review all missed (' + missedAll + ')</button>' +
      '<button class="btn" data-act="qsSaved" ' + (savedAll ? '' : 'disabled') + '>Review saved (' + savedAll + ')</button>' +
      '<button class="btn" data-act="qsWeak" ' + (weak ? '' : 'disabled') + '>' + (weak ? 'Drill weakest: ' + weak.o.id : 'Drill weakest objective') + '</button></div>';
    const rr = () => { viewPractice(); };
    H.psExam = (t) => { PS.exam = t.value; PS.dom = ''; PS.obj = ''; rr(); };
    H.psDom = (t) => { PS.dom = t.value; PS.obj = ''; rr(); };
    H.psObj = (t) => { PS.obj = t.value; rr(); };
    H.psCount = (t) => { PS.count = +t.value; rr(); };
    H.psFilter = (t) => { PS.filter = t.value; rr(); };
    H.psStart = () => {
      const scope = { exam: ex.id }; if (PS.dom) scope.dom = PS.dom; if (PS.obj) scope.obj = PS.obj;
      startQuiz({ kind: 'practice', title: (PS.obj ? PS.obj : PS.dom ? 'Domain ' + PS.dom.slice(1) : ex.name) + ' practice', exam: ex.id, scope, count: PS.count, filter: PS.filter });
    };
    H.qsSaved = () => startQuiz({ kind: 'practice', title: 'Saved questions', exam: curExam().id, scope: {}, filter: 'saved', count: 0 });
    H.qsMissed = () => startQuiz({ kind: 'practice', title: 'Missed questions', exam: curExam().id, scope: {}, filter: 'missed', count: 0 });
    H.qsWeak = () => startQuiz({ kind: 'practice', title: weak.o.id + ' drill', exam: curExam().id, scope: { exam: curExam().id, dom: weak.d.id, obj: weak.o.id }, count: 0 });
  }

  /* ================================================================== MOCK EXAM */
  function buildMock(ex) {
    const built = ex.domains.filter((d) => CT.isBuilt(ex.id, d.id));
    const all = CT.questions({ exam: ex.id });
    if (!all.length) return [];
    const n = Math.min(ex.maxQuestions, all.length);
    const wsum = built.reduce((s, d) => s + d.weight, 0);
    let picked = [];
    built.forEach((d) => {
      const pool = shuffle(CT.questions({ exam: ex.id, dom: d.id }));
      picked = picked.concat(pool.slice(0, Math.min(pool.length, Math.round(n * d.weight / wsum))));
    });
    if (picked.length < n) {
      const ids = new Set(picked.map((q) => q.id));
      picked = picked.concat(shuffle(all.filter((q) => !ids.has(q.id))).slice(0, n - picked.length));
    }
    return shuffle(picked).slice(0, n);
  }
  function viewMock() {
    const ex = curExam();
    const n = Math.min(ex.maxQuestions, CT.questions({ exam: ex.id }).length);
    const minutes = Math.max(1, Math.ceil(n * ex.minutes / ex.maxQuestions));
    const hist = S.attempts.filter((a) => a.kind === 'mock' && a.exam === ex.id).slice(-6).reverse();
    const builtW = examReadiness(ex).builtWeight;
    app.innerHTML = '<h1>Mock exam</h1><p class="lead">A timed, no-feedback simulation. Answers are revealed only after you submit, just like the real test.</p>' + examTabs('setExam') +
      '<div class="card"><h3>' + esc(ex.name) + ' (' + esc(ex.code) + ')</h3>' +
      (n ? '<div class="grid c3"><div class="stat"><b>' + n + '</b><span>questions</span></div><div class="stat"><b>' + minutes + ' min</b><span>time limit</span></div><div class="stat"><b>' + builtW + '%</b><span>of exam content built</span></div></div>' +
        '<p class="lead" style="margin:.9rem 0">The pacing matches the real exam (' + ex.minutes + ' minutes for up to ' + ex.maxQuestions + ' questions). Until every domain is built this mock covers only the finished domains, so a good score here is not yet a guarantee for the full exam. Questions can be flagged and revisited before you submit.</p><button class="btn primary" data-act="mockStart">Start mock exam</button>'
        : '<p class="lead">No questions are available for this exam yet. Build a domain first.</p>') + '</div>' +
      (hist.length ? '<h2 style="margin-top:1.4rem">Recent mock exams</h2><div class="list">' + hist.map((a) => { const p = a.correct / a.total; return '<div class="item"><div><div class="t">' + fmtDate(a.ts) + ' · ' + a.correct + '/' + a.total + '</div><div class="s">' + fmtTime(a.secs) + '</div></div>' + pill(pct(p) + '%', p >= .8 ? 'ok' : p >= .7 ? 'warn' : 'bad') + '</div>'; }).join('') + '</div>' : '');
    H.setExam = (t) => { S.prefs.exam = t.dataset.id; save(); viewMock(); route(); };
    H.mockStart = () => {
      const qs = buildMock(ex);
      Q = { kind: 'mock', title: ex.name + ' mock exam', exam: ex.id, items: qs.map(makeItem), idx: 0, start: Date.now(), limit: minutes * 60 };
      Q.end = Q.start + Q.limit * 1000;
      nav('#/quiz');
    };
  }

  /* ================================================================== FLASHCARDS */
  let F = null;
  function termsFor(scope) {
    const out = [];
    CT.exams.forEach((ex) => {
      if (scope.exam && scope.exam !== ex.id) return;
      ex.domains.forEach((d) => {
        if (scope.dom && scope.dom !== d.id) return;
        const c = CT.content_for(ex.id, d.id); if (!c) return;
        d.objectives.forEach((o) => {
          if (scope.obj && scope.obj !== o.id) return;
          (c.terms[o.id] || []).forEach((t, i) => out.push({ key: okey(ex.id, d.id, o.id) + ':' + i, obj: o.id, term: t[0], def: t[1] }));
        });
      });
    });
    return out;
  }
  /* Spaced repetition: each card has a level 0-4 and a due time. "Got it" raises the level and pushes the next review out
   * (1, 3, 7, then 14 days); "Again" resets the card so it comes back in this session and is due right away next time. */
  const DAY = 864e5, INTERVALS = [0, 1, 3, 7, 14];
  const isDue = (c) => { const d = S.fdue[c.key]; return d === undefined || d <= Date.now(); };
  const isNewCard = (c) => S.fdue[c.key] === undefined && !(S.flash[c.key] > 0);
  function startFlash(scope, mode) {
    const deck = termsFor(scope);
    if (!deck.length) { toast('No flashcards available for that selection'); return; }
    let pick = deck;
    if (mode !== 'all') {
      const due = deck.filter(isDue);
      if (due.length) pick = due;
      else if (mode === 'due') { toast('Nothing is due right now. Choose "Study all cards" to review anyway.'); return; }
      else toast('Nothing is due, so you are reviewing all cards.');
    }
    const queue = pick.slice().sort((a, b) => ((S.fdue[a.key] || 0) - (S.fdue[b.key] || 0)) || (Math.random() - .5));
    if (mode !== 'all' && queue.length > 40) queue.length = 40;
    F = { queue, total: queue.length, learned: 0, flipped: false, again: 0 };
    nav('#/flash/run');
  }
  const FP = { exam: null, dom: '', obj: '' };
  function viewFlash(p) {
    if (p[0] === 'run') { if (!F) { nav('#/flash'); return; } return flashRun(); }
    if (!FP.exam) FP.exam = curExam().id;
    const ex = CT.exam(FP.exam); const doms = ex.domains.filter((d) => CT.isBuilt(ex.id, d.id));
    if (FP.dom && !doms.find((d) => d.id === FP.dom)) { FP.dom = ''; FP.obj = ''; }
    const dom = doms.find((d) => d.id === FP.dom);
    const deck = termsFor({ exam: ex.id, dom: FP.dom || undefined, obj: FP.obj || undefined });
    const due = deck.filter(isDue).length, fresh = deck.filter(isNewCard).length, known = deck.filter((t) => (S.flash[t.key] || 0) >= 3).length;
    app.innerHTML = '<h1>Flashcards</h1><p class="lead">Flip, rate yourself, and repeat. Cards you know come back after longer and longer gaps (1, 3, 7, then 14 days). Cards you miss come back right away. Keyboard: Space flips, 1 = Again, 2 = Got it.</p>' +
      '<div class="card"><div class="grid c3">' +
      '<label>Exam<select data-chg="fpExam">' + CT.exams.map((e) => '<option value="' + e.id + '" ' + (e.id === ex.id ? 'selected' : '') + '>' + esc(e.name) + '</option>').join('') + '</select></label>' +
      '<label>Domain<select data-chg="fpDom"><option value="">All built domains</option>' + doms.map((d) => '<option value="' + d.id + '" ' + (d.id === FP.dom ? 'selected' : '') + '>D' + d.n + ' ' + esc(d.name) + '</option>').join('') + '</select></label>' +
      '<label>Objective<select data-chg="fpObj" ' + (dom ? '' : 'disabled') + '><option value="">All objectives</option>' + (dom ? dom.objectives.map((o) => '<option value="' + o.id + '" ' + (o.id === FP.obj ? 'selected' : '') + '>' + o.id + '</option>').join('') : '') + '</select></label></div>' +
      '<div class="grid c3" style="margin:1rem 0"><div class="stat"><b>' + due + '</b><span>due now</span></div><div class="stat"><b>' + fresh + '</b><span>new</span></div><div class="stat"><b>' + known + '</b><span>well known</span></div></div>' +
      '<div class="row"><button class="btn primary" data-act="fpStart" ' + (due ? '' : 'disabled') + '>Study due cards (' + Math.min(due, 40) + ')</button><button class="btn" data-act="fpAll" ' + (deck.length ? '' : 'disabled') + '>Study all cards (' + deck.length + ')</button></div></div>';
    H.fpExam = (t) => { FP.exam = t.value; FP.dom = ''; FP.obj = ''; viewFlash([]); };
    H.fpDom = (t) => { FP.dom = t.value; FP.obj = ''; viewFlash([]); };
    H.fpObj = (t) => { FP.obj = t.value; viewFlash([]); };
    H.fpStart = () => startFlash({ exam: ex.id, dom: FP.dom || undefined, obj: FP.obj || undefined }, 'due');
    H.fpAll = () => startFlash({ exam: ex.id, dom: FP.dom || undefined, obj: FP.obj || undefined }, 'all');
  }
  function flashRun() {
    if (!F.queue.length) {
      app.innerHTML = '<h1>Session complete</h1><div class="card"><p>You went through <b>' + F.total + '</b> cards' + (F.again ? ' and needed a second look at <b>' + F.again + '</b> of them' : ' without needing a repeat') + '.</p><div class="row"><a class="btn primary" href="#/flash">New session</a><a class="btn" href="#/practice">Practice questions</a></div></div>';
      F = null; return;
    }
    const c = F.queue[0];
    app.innerHTML = '<div class="row between"><b>Flashcards</b><span class="lead">' + F.learned + ' of ' + F.total + ' learned · ' + F.queue.length + ' left</span></div>' + bar(pct(F.learned / F.total)) +
      '<div class="flash ' + (F.flipped ? 'flipped' : '') + '" style="margin-top:1.2rem"><div class="flash-inner" data-act="flip" role="button" tabindex="0" aria-label="Flashcard: ' + esc(c.term) + '. Press space to flip.">' +
      '<div class="face"><div><small>Objective ' + esc(c.obj) + ' · tap to flip</small><div class="term">' + esc(c.term) + '</div></div></div>' +
      '<div class="face back"><div><small>' + esc(c.term) + '</small>' + esc(c.def) + '</div></div></div></div>' +
      '<div class="row" style="justify-content:center;margin-top:1rem">' + (F.flipped ? '<button class="btn warn" data-act="again">Again</button><button class="btn primary" data-act="got">Got it</button>' : '<button class="btn" data-act="flip">Show answer</button>') + '</div>' +
      '<div class="row" style="justify-content:center;margin-top:1rem"><a class="btn ghost sm" href="#/flash">End session</a></div>';
    H.flip = () => { F.flipped = !F.flipped; flashRun(); };
    H.again = () => { S.flash[c.key] = 0; S.fdue[c.key] = Date.now(); F.again++; F.queue.push(F.queue.shift()); F.flipped = false; touch(); save(); flashRun(); };
    H.got = () => { const lv = Math.min(4, (S.flash[c.key] || 0) + 1); S.flash[c.key] = lv; S.fdue[c.key] = Date.now() + INTERVALS[lv] * DAY; F.queue.shift(); F.learned++; F.flipped = false; touch(); save(); flashRun(); };
  }

  /* ================================================================== READINESS */
  function viewReadiness() {
    const ex = curExam(); const r = examReadiness(ex); const v = verdict(r.overall); const vb = verdict(r.built);
    const weak = weakObjectives(ex);
    const mocks = S.attempts.filter((a) => a.kind === 'mock' && a.exam === ex.id).slice(-8);
    const avgMock = mocks.length ? mocks.slice(-3).reduce((s, a) => s + a.correct / a.total, 0) / Math.min(3, mocks.length) : null;
    const unbuilt = ex.domains.filter((d) => !CT.isBuilt(ex.id, d.id));
    app.innerHTML = '<h1>Readiness</h1><p class="lead">An honest estimate of how prepared you are, based on your recent answers. It is a guide, not a guarantee.</p>' + examTabs('setExam') +
      '<div class="grid c2"><div class="card row">' + ring(r.overall, 'whole exam') + '<div><h3>' + pill(v[0], v[1]) + '</h3><p class="lead" style="margin:.5rem 0 0">Counts every domain at its exam weight. Domains not built yet count as zero, so this reaches 100% only when all ' + ex.domains.length + ' domains are built and mastered.</p></div></div>' +
      '<div class="card row">' + ring(r.built, 'built domains') + '<div><h3>' + pill(vb[0], vb[1]) + '</h3><p class="lead" style="margin:.5rem 0 0">Readiness on the ' + r.builtWeight + '% of the exam that has content so far.' + (avgMock !== null ? '<br>Average of your last ' + Math.min(3, mocks.length) + ' mock exam(s): <b>' + pct(avgMock) + '%</b>' : '') + '</p></div></div></div>' +
      '<h2 style="margin-top:1.6rem">By domain</h2><div class="card"><div class="notes"><table><tr><th>Domain</th><th>Weight</th><th>Seen</th><th>Accuracy</th><th>Readiness</th></tr>' +
      ex.domains.map((d) => { const dr = domainReadiness(ex.id, d); return '<tr><td>D' + d.n + ' ' + esc(d.name) + '</td><td>' + d.weight + '%</td>' + (dr.built ? '<td>' + dr.seen + '/' + dr.total + '</td><td>' + (dr.seen ? pct(dr.acc) + '%' : '–') + '</td><td><b>' + pct(dr.r) + '%</b></td>' : '<td colspan="3"><span class="pill soon">Coming soon</span></td>') + '</tr>'; }).join('') + '</table></div></div>' +
      '<h2 style="margin-top:1.6rem">Focus areas</h2>' +
      (weak.length ? '<div class="list">' + weak.slice(0, 6).map((w) => '<a class="item" href="#/study/' + ex.id + '/' + w.d.id + '/' + w.o.id + '/quiz"><div style="flex:1"><div class="t"><span class="num">' + w.o.id + '</span>' + esc(w.o.title) + '</div>' + bar(pct(w.score), w.score >= .8 ? 'green' : w.score >= .6 ? 'amber' : 'red') + '</div>' + pill(pct(w.score) + '%', w.score >= .8 ? 'ok' : w.score >= .6 ? 'warn' : 'bad') + '</a>').join('') + '</div>' : '<div class="card empty">Answer some practice questions to see where to focus.</div>') +
      (mocks.length ? '<h2 style="margin-top:1.6rem">Mock exam trend</h2><div class="card">' + trendSVG(mocks) + '</div>' : '') +
      (unbuilt.length ? '<h2 style="margin-top:1.6rem">Still to build</h2><div class="card"><p class="lead" style="margin:0">' + unbuilt.map((d) => 'D' + d.n + ' ' + esc(d.name) + ' (' + d.weight + '%)').join(' · ') + '</p></div>' : '') +
      '<div class="card" style="margin-top:1.4rem"><h3>How the score works</h3><p class="lead" style="margin:0">Each question scores the average of your last three attempts. Domain accuracy averages those scores over the questions you have seen, then is scaled by coverage so you must see at least 80% of a domain\'s questions to earn full credit. The exam score weights each domain by its official percentage. Target 85%+ here and 80%+ on repeated mock exams before booking.</p></div>';
    H.setExam = (t) => { S.prefs.exam = t.dataset.id; save(); viewReadiness(); route(); };
  }
  function trendSVG(list) {
    const w = 600, h = 160, pad = 24, n = list.length; const x = (i) => pad + (n === 1 ? (w - 2 * pad) / 2 : i * (w - 2 * pad) / (n - 1)); const y = (p) => h - pad - p * (h - 2 * pad);
    const pts = list.map((a, i) => [x(i), y(a.correct / a.total)]);
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;height:auto" role="img" aria-label="Mock exam scores over time">' +
      '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + y(.8) + '" y2="' + y(.8) + '" style="stroke:var(--amber)" stroke-dasharray="5 5"/><text x="' + (w - pad) + '" y="' + (y(.8) - 5) + '" style="fill:var(--amber)" font-size="11" text-anchor="end">80% target</text>' +
      '<polyline fill="none" style="stroke:var(--teal)" stroke-width="3" points="' + pts.map((p) => p.join(',')).join(' ') + '"/>' +
      pts.map((p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" style="fill:var(--teal)"/><text x="' + p[0] + '" y="' + (p[1] - 10) + '" style="fill:var(--text)" font-size="11" text-anchor="middle">' + pct(list[i].correct / list[i].total) + '%</text>').join('') + '</svg>';
  }

  /* ================================================================== SEARCH, SAVED ITEMS AND NOTES */
  let SIDX = null, SQ = '';
  const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
  function buildIndex() {
    const out = [];
    CT.exams.forEach((ex) => ex.domains.forEach((d) => {
      const c = CT.content_for(ex.id, d.id); if (!c) return;
      const ctx = ex.name + ' · D' + d.n;
      d.objectives.forEach((o) => {
        const base = '#/study/' + ex.id + '/' + d.id + '/' + o.id + '/';
        out.push({ k: 'Objective', t: o.id + ' ' + o.title, ctx, text: o.title, href: base + 'notes' });
        if (c.notes[o.id]) out.push({ k: 'Notes', t: o.id + ' ' + o.title, ctx, text: strip(c.notes[o.id]), href: base + 'notes' });
        (c.terms[o.id] || []).forEach((tm) => out.push({ k: 'Term', t: tm[0], ctx, text: tm[0] + ' ' + tm[1], href: base + 'terms' }));
      });
    }));
    (CT.labs ? CT.labs.list : []).forEach((l) => out.push({ k: 'Lab', t: l.title, ctx: 'Lab · ' + l.level, text: l.summary + ' ' + l.briefing.join(' ') + ' ' + l.tasks.map((t) => t.text).join(' '), href: '#/labs/' + l.id }));
    CT.questions({}).forEach((q) => out.push({ k: 'Question', t: q.q, ctx: (CT.exam(q.exam) || {}).name + ' · ' + q.obj, text: q.q + ' ' + (q.options || []).join(' ') + ' ' + q.explain, href: '#/study/' + q.exam + '/' + q.dom + '/' + q.obj + '/quiz' }));
    out.forEach((i) => { i.low = (i.t + ' ' + i.text).toLowerCase(); i.tl = i.t.toLowerCase(); });
    return out;
  }
  const reEsc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function searchResults(q) {
    const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!toks.length) return '';
    if (!SIDX) SIDX = buildIndex();
    const hits = [];
    SIDX.forEach((i) => {
      if (!toks.every((t) => i.low.indexOf(t) >= 0)) return;
      let sc = i.k === 'Term' ? 3 : i.k === 'Objective' ? 4 : i.k === 'Notes' ? 1 : 0;
      if (toks.every((t) => i.tl.indexOf(t) >= 0)) sc += 5;
      hits.push({ i, sc });
    });
    hits.sort((a, b) => b.sc - a.sc);
    if (!hits.length) return '<div class="card empty">No matches for "' + esc(q) + '".</div>';
    const hl = toks.filter((t) => t.length > 1).map(reEsc);
    const mark = (t) => { const e = esc(t); return hl.length ? e.replace(new RegExp('(' + hl.join('|') + ')', 'gi'), '<mark>$1</mark>') : e; };
    return '<p class="lead">' + hits.length + ' result' + (hits.length === 1 ? '' : 's') + (hits.length > 40 ? ' (showing the best 40)' : '') + '</p><div class="list">' + hits.slice(0, 40).map((h) => {
      const i = h.i; let snip = i.text; const at = snip.toLowerCase().indexOf(toks[0]);
      if (snip.length > 170) { const st = Math.max(0, at - 60); snip = (st ? '…' : '') + snip.slice(st, st + 170) + '…'; }
      return '<a class="item" href="' + i.href + '"><div><div class="t">' + pill(i.k) + ' ' + mark(i.t.length > 110 ? i.t.slice(0, 110) + '…' : i.t) + '</div><div class="s">' + esc(i.ctx) + (i.k === 'Objective' ? '' : ' · ' + mark(snip)) + '</div></div></a>';
    }).join('') + '</div>';
  }
  function savedHTML() {
    const marks = Object.keys(S.marks).sort((a, b) => S.marks[b] - S.marks[a]);
    const objs = [], qs = [];
    marks.forEach((k) => {
      if (k.slice(0, 2) === 'o:') {
        const p = k.slice(2).split(':'); const ex = CT.exam(p[0]); const dom = ex && CT.domain(p[0], p[1]); const o = dom && dom.objectives.find((x) => x.id === p[2]);
        if (o) objs.push('<a class="item" href="#/study/' + p[0] + '/' + p[1] + '/' + p[2] + '/notes"><div><div class="t"><span class="num">' + o.id + '</span>' + esc(o.title) + '</div><div class="s">' + esc(ex.name) + '</div></div></a>');
      } else if (k.slice(0, 2) === 'q:') {
        const q = CT.questions({}).find((x) => x.id === k.slice(2));
        if (q) qs.push('<div class="item"><div><div class="t">' + esc(q.q.length > 140 ? q.q.slice(0, 140) + '…' : q.q) + '</div><div class="s">' + esc((CT.exam(q.exam) || {}).name) + ' · ' + q.obj + '</div></div><div class="row"><a class="btn sm" href="#/study/' + q.exam + '/' + q.dom + '/' + q.obj + '/quiz">Open</a><button class="btn sm ghost" data-act="unsaveQ" data-id="' + esc(q.id) + '">Remove</button></div></div>');
      }
    });
    const notes = Object.keys(S.notes).map((k) => {
      const p = k.split(':'); const ex = CT.exam(p[0]); const dom = ex && CT.domain(p[0], p[1]); const o = dom && dom.objectives.find((x) => x.id === p[2]);
      return o ? '<a class="item" href="#/study/' + p[0] + '/' + p[1] + '/' + p[2] + '/notes"><div><div class="t"><span class="num">' + o.id + '</span>' + esc(ex.name) + '</div><div class="s">' + esc(S.notes[k].slice(0, 140)) + (S.notes[k].length > 140 ? '…' : '') + '</div></div></a>' : '';
    }).filter(Boolean);
    if (!objs.length && !qs.length && !notes.length) return '<div class="card empty">Nothing saved yet. Use ☆ Save on an objective or a question, and write your own notes under any objective\'s notes.</div>';
    return (objs.length ? '<h2>Saved objectives</h2><div class="list">' + objs.join('') + '</div>' : '') + (qs.length ? '<h2 style="margin-top:1.4rem">Saved questions</h2><div class="list">' + qs.join('') + '</div>' : '') + (notes.length ? '<h2 style="margin-top:1.4rem">My notes</h2><div class="list">' + notes.join('') + '</div>' : '');
  }
  function viewSearch() {
    app.innerHTML = '<h1>Search</h1><p class="lead">Search every note, key term, objective and question. Your saved items and personal notes are listed below the box.</p>' +
      '<div class="card"><label>Search<input type="search" id="sbox" class="textbox" data-inp="srch" placeholder="For example: tailgating, CVSS, zero trust" value="' + esc(SQ) + '" autocomplete="off"></label></div>' +
      '<div id="sres" style="margin-top:1rem"></div>';
    const draw = () => { $('#sres').innerHTML = SQ.trim() ? searchResults(SQ) : savedHTML(); };
    draw();
    H.srch = (t) => { SQ = t.value; draw(); };
    H.unsaveQ = (t) => { delete S.marks['q:' + t.dataset.id]; save(); draw(); };
    const b = $('#sbox'); if (b && !SQ) b.focus();
  }

  /* ================================================================== SETTINGS */
  function viewSettings() {
    const fileTxt = !P.supportFile ? 'Not available in this browser (it works in Chrome, Edge and other Chromium browsers). Use Export backup instead.'
      : !P.file ? 'Not connected. Pick a file once and your progress is saved to it automatically after every change.'
      : ({ ok: 'Connected to "' + esc(P.file.name) + '". Progress is saved to it automatically' + (P.lastFile ? ' (last saved ' + new Date(P.lastFile).toLocaleTimeString() + ').' : '.'),
        'needs-permission': 'Connected to "' + esc(P.file.name) + '", but the browser needs your permission again before it can write.',
        error: 'Connected to "' + esc(P.file.name) + '" but writing failed. Try allowing access again or choose a different file.' }[P.fileState] || '');
    const persistTxt = P.persisted === true ? 'Protected: the browser will not clear this site\'s data automatically.' : P.persisted === false ? 'Not guaranteed: the browser may clear this data if the device runs low on space. Use the backup file or export to stay safe.' : 'Unknown in this browser.';
    app.innerHTML = '<h1>Settings</h1>' +
      '<div class="card"><h3>Your progress</h3><p class="lead">Progress is stored on this device only (no account, no server). It is kept in three places: the browser\'s storage, a second copy in the browser\'s database, and, if you connect one, a backup file you choose.</p>' +
      '<ul class="plain"><li><b>Browser storage:</b> ' + (storageOK ? 'working' : '<span style="color:var(--red)">blocked or full</span>') + '</li>' +
      '<li><b>Second copy (IndexedDB):</b> ' + ({ ok: 'working', unavailable: 'not available', checking: 'checking' }[P.idb] || P.idb) + '</li>' +
      '<li><b>Protection from automatic clearing:</b> ' + persistTxt + '</li>' +
      '<li><b>Auto-backup file:</b> ' + fileTxt + '</li>' +
      '<li><b>Last backup:</b> ' + (S.meta.lastBackup ? new Date(S.meta.lastBackup).toLocaleString() : 'never') + '</li></ul>' +
      '<div class="row">' +
      (P.supportFile ? (P.file ? (P.fileState !== 'ok' ? '<button class="btn primary" data-act="fileAllow">Allow access again</button>' : '') + '<button class="btn" data-act="fileRestore">Restore from backup file</button><button class="btn ghost" data-act="fileConnect">Choose a different file</button><button class="btn ghost" data-act="fileOff">Disconnect</button>' : '<button class="btn primary" data-act="fileConnect">Connect auto-backup file</button>') : '') +
      (P.persisted === false ? '<button class="btn" data-act="persist">Ask browser to protect my data</button>' : '') +
      '</div></div>' +
      '<div class="card"><h3>Backup and restore</h3><div class="row"><button class="btn primary" data-act="exp">Export backup</button><label class="btn" style="cursor:pointer">Import backup<input type="file" accept="application/json" data-chg="imp" hidden></label><button class="btn warn" data-act="reset">Reset all progress</button></div></div>' +
      '<div class="card"><h3>Appearance</h3><label>Theme<select data-chg="theme"><option value="auto" ' + (S.prefs.theme === 'auto' ? 'selected' : '') + '>Match my device</option><option value="dark" ' + (S.prefs.theme === 'dark' ? 'selected' : '') + '>Dark</option><option value="light" ' + (S.prefs.theme === 'light' ? 'selected' : '') + '>Light</option></select></label></div>' +
      '<div class="card"><h3>Install and offline use</h3><p class="lead" style="margin:0">Open this app over https (or localhost) and use your browser\'s "Install app" or "Add to Home screen" option. After the first load the whole platform works offline, and updates are picked up automatically when you are online.</p></div>' +
      '<div class="card"><h3>About the content</h3><p class="lead" style="margin:0">Notes and questions are original study material written to the published CompTIA exam objectives. They are not actual exam questions. Exam objectives, formats and passing scores are set by CompTIA and change over time, so always check comptia.org for the current exam details.</p></div>';
    H.theme = (t) => { S.prefs.theme = t.value; save(); applyTheme(); };
    H.exp = () => { exportBackup(); toast('Backup downloaded'); viewSettings(); };
    H.imp = (t) => {
      const f = t.files && t.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { try { const d = JSON.parse(rd.result); if (!d || typeof d !== 'object' || !d.answers) throw new Error('bad'); S = normalize(d); save(); applyTheme(); toast('Backup imported'); route(); } catch (e) { toast('That file is not a valid backup'); } };
      rd.readAsText(f);
    };
    H.reset = () => {
      const warn = P.file ? ' Your connected backup file will also be overwritten with the empty progress.' : '';
      if (confirm('Erase all progress on this device? This cannot be undone.' + warn) && confirm('Really erase everything?')) { S = blank(); save(); persistNow(); applyTheme(); toast('Progress reset'); nav('#/'); }
    };
    H.persist = async () => { try { P.persisted = await navigator.storage.persist(); } catch (e) { /* ignore */ } toast(P.persisted ? 'Your data is now protected' : 'The browser declined. Use the backup file or export.'); viewSettings(); };
    H.fileConnect = async () => {
      try {
        const h = await window.showSaveFilePicker({ suggestedName: 'securityprep-progress.json', types: [{ description: 'SecurityPrep progress', accept: { 'application/json': ['.json'] } }] });
        P.file = h; P.fileState = 'ok'; await idbSet('fileHandle', h).catch(() => {});
        const ok = await writeFile(JSON.stringify(S), true); save();
        toast(ok ? 'Auto-backup file connected' : 'Connected, but the first write failed'); viewSettings();
      } catch (e) { if (!e || e.name !== 'AbortError') toast('Could not connect a file'); }
    };
    H.fileAllow = async () => { const ok = await writeFile(null, true); toast(ok ? 'Auto-backup resumed' : 'Permission was not granted'); viewSettings(); };
    H.fileOff = async () => { P.file = null; P.fileState = 'none'; try { const db = await idbOpen(); db.transaction(DB.store, 'readwrite').objectStore(DB.store).delete('fileHandle'); } catch (e) { /* ignore */ } toast('Auto-backup disconnected'); viewSettings(); };
    H.fileRestore = async () => {
      try {
        if (!(await filePerm(P.file, true))) { toast('Permission was not granted'); return; }
        const d = JSON.parse(await (await P.file.getFile()).text()); if (!d || !d.answers) throw new Error('bad');
        if (!confirm('Replace the progress in this browser with the contents of the backup file?')) return;
        S = normalize(d); save(); applyTheme(); toast('Progress restored from the backup file'); route();
      } catch (e) { toast('Could not read a valid backup from that file'); }
    };
  }

  /* ------------------------------------------------------------------ keyboard shortcuts */
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'textarea' || tag === 'input' || tag === 'select') return;
    const h = location.hash;
    if (h === '#/quiz' && Q) {
      const item = Q.items[Q.idx]; const q = item.q; const mock = Q.kind === 'mock';
      if (/^[a-f1-6]$/i.test(e.key) && (q.type === 'single' || q.type === 'multi')) {
        const pos = /\d/.test(e.key) ? +e.key - 1 : e.key.toLowerCase().charCodeAt(0) - 97; const oi = item.order[pos];
        if (oi !== undefined && !(item.answered && !mock) && H.pick) { H.pick({ dataset: { i: oi } }); e.preventDefault(); }
      } else if (e.key === 'Enter' && tag !== 'button' && !mock) { const f = item.answered ? H.next : H.check; if (f) { f(); e.preventDefault(); } }
      else if (mock && e.key === 'ArrowRight' && H.next) H.next();
      else if (mock && e.key === 'ArrowLeft' && H.prev) H.prev();
    } else if (h === '#/flash/run' && F && H.flip) {
      if ((e.key === ' ' || e.key === 'Enter') && tag !== 'button') { H.flip(); e.preventDefault(); }
      else if (F.flipped && (e.key === 'ArrowLeft' || e.key === '1') && H.again) H.again();
      else if (F.flipped && (e.key === 'ArrowRight' || e.key === '2') && H.got) H.got();
    }
  });

  /* ------------------------------------------------------------------ boot */
  applyTheme();
  route();
  bootStorage();
})();
