/* Lab sandbox core: pure logic with no DOM, so it can be unit-tested in Node.
 * Everything here simulates systems in memory. Nothing runs real commands, opens network connections, or touches files. */
(function () {
  'use strict';
  const CT = window.CT;
  const C = (CT.labsCore = {});

  /* ------------------------------------------------------------------ registry */
  const L = (CT.labs = { list: [], byId: {} });
  L.register = function (lab) { if (L.byId[lab.id]) throw new Error('duplicate lab id ' + lab.id); L.list.push(lab); L.byId[lab.id] = lab; };
  L.forObjective = function (exam, obj) { return L.list.filter((l) => (l.objectives || []).some((o) => o.exam === exam && o.obj === obj)); };

  /* ------------------------------------------------------------------ answers */
  const norm = (s) => String(s === undefined || s === null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
  C.norm = norm;
  /* accept: array of strings (compared after trimming, lowercasing, collapsing spaces) and/or RegExp objects */
  C.matches = function (accept, raw) {
    const v = norm(raw); if (!v) return false;
    return (accept || []).some((a) => (a instanceof RegExp ? a.test(v) : norm(a) === v));
  };

  /* set answers: every expected item must be present and nothing else, in any order (for example "22, 25, 80") */
  C.matchesSet = function (accept, raw) {
    const got = String(raw === undefined ? '' : raw).toLowerCase().split(/[\s,;]+/).filter(Boolean).sort();
    const want = (accept || []).map((x) => String(x).toLowerCase()).sort();
    return got.length > 0 && got.length === want.length && got.every((v, i) => v === want[i]);
  };

  /* small seeded random generator so generated logs are identical every time */
  C.rng = function (seed) { let a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  C.pick = (r, arr) => arr[Math.floor(r() * arr.length)];

  /* ------------------------------------------------------------------ simulated Linux shell */
  C.makeShell = function (spec) {
    spec = spec || {};
    const user = spec.user || 'analyst', host = spec.host || 'lab', home = spec.home || '/home/' + user;
    const mkdir = (mode, owner, group) => ({ t: 'd', mode: mode === undefined ? 0o755 : mode, owner: owner || 'root', group: group || owner || 'root', kids: {} });
    const mkfile = (content, o) => { o = o || {}; return { t: 'f', content: String(content), mode: o.mode === undefined ? 0o644 : o.mode, owner: o.owner || 'root', group: o.group || o.owner || 'root' }; };
    const root = mkdir(0o755, 'root', 'root');
    const sh = { cwd: spec.cwd || home, user, host, home, history: [] };

    const segs = (p) => p.split('/').filter(Boolean);
    function get(path) { let n = root; for (const s of segs(path)) { if (n.t !== 'd' || !n.kids[s]) return null; n = n.kids[s]; } return n; }
    function ensureDir(path, o) {
      let n = root, cur = '';
      segs(path).forEach((s) => { cur += '/' + s; if (!n.kids[s]) n.kids[s] = mkdir(0o755, 'root', 'root'); n = n.kids[s]; });
      if (o) { if (o.mode !== undefined) n.mode = o.mode; if (o.owner) { n.owner = o.owner; n.group = o.group || o.owner; } }
      return n;
    }
    ensureDir(home, { owner: user, group: user });
    Object.keys(spec.dirs || {}).forEach((d) => ensureDir(d, spec.dirs[d]));
    Object.keys(spec.files || {}).forEach((p) => {
      const v = spec.files[p]; const parts = segs(p); const name = parts.pop();
      const parent = ensureDir('/' + parts.join('/'));
      parent.kids[name] = typeof v === 'string' ? mkfile(v) : mkfile(v.content, v);
    });
    const resolve = (p) => {
      p = p || '.'; if (p === '~' || p.slice(0, 2) === '~/') p = home + p.slice(1);
      const parts = p[0] === '/' ? [] : segs(sh.cwd);
      p.split('/').forEach((s) => { if (!s || s === '.') return; if (s === '..') parts.pop(); else parts.push(s); });
      return '/' + parts.join('/');
    };
    sh.stat = (p) => { const n = get(resolve(p)); return n ? { type: n.t, mode: n.mode, owner: n.owner, group: n.group, size: n.t === 'f' ? n.content.length : 4096 } : null; };
    sh.read = (p) => { const n = get(resolve(p)); return n && n.t === 'f' ? n.content : null; };
    sh.list = (p) => { const n = get(resolve(p || '.')); return n && n.t === 'd' ? Object.keys(n.kids).sort().map((k) => k + (n.kids[k].t === 'd' ? '/' : '')) : []; };
    sh.prompt = () => user + '@' + host + ':' + (sh.cwd === home ? '~' : sh.cwd.indexOf(home + '/') === 0 ? '~' + sh.cwd.slice(home.length) : sh.cwd) + '$ ';

    const modeStr = (n) => {
      const m = n.mode; const t = n.t === 'd' ? 'd' : '-'; let s = t;
      [[6, 0o4000, 's', 'S'], [3, 0o2000, 's', 'S'], [0, 0o1000, 't', 'T']].forEach((g) => {
        const bits = (m >> g[0]) & 7; const special = (m & g[1]) !== 0;
        s += (bits & 4 ? 'r' : '-') + (bits & 2 ? 'w' : '-') + (special ? (bits & 1 ? g[2] : g[3]) : (bits & 1 ? 'x' : '-'));
      });
      return s;
    };
    C.modeStr = modeStr;

    /* ---- parsing ---- */
    function parseLine(line) {
      const lists = []; let pipe = [], argv = [], cur = '', has = false, glob = false, q = '';
      const endTok = () => { if (has) { argv.push({ s: cur, glob }); } cur = ''; has = false; glob = false; };
      const endCmd = () => { endTok(); if (argv.length) pipe.push(argv); argv = []; };
      const endPipe = () => { endCmd(); if (pipe.length) lists.push(pipe); pipe = []; };
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (q) { if (ch === q) q = ''; else if (ch === '\\' && q === '"' && i + 1 < line.length && '"\\$'.indexOf(line[i + 1]) >= 0) cur += line[++i]; else cur += ch; continue; }
        if (ch === '"' || ch === "'") { q = ch; has = true; continue; }
        if (ch === '\\' && i + 1 < line.length) { cur += line[++i]; has = true; continue; }
        if (/\s/.test(ch)) { endTok(); continue; }
        if (ch === '|') { if (line[i + 1] === '|') throw new Error('bash: "||" is not supported in this sandbox'); endCmd(); continue; }
        if (ch === ';') { endPipe(); continue; }
        if (ch === '&') { if (line[i + 1] === '&') { i++; endPipe(); continue; } throw new Error('bash: background jobs are not available in this sandbox'); }
        if (ch === '>' || ch === '<') throw new Error('bash: redirection is disabled in this sandbox. Use pipes (|) to chain commands.');
        if (ch === '*' || ch === '?') glob = true;
        cur += ch; has = true;
      }
      if (q) throw new Error('bash: unexpected EOF while looking for matching ' + q);
      endPipe();
      return lists;
    }
    function expand(tok) {
      if (!tok.glob) return [tok.s];
      const i = tok.s.lastIndexOf('/'); const dirPart = i >= 0 ? tok.s.slice(0, i + 1) : ''; const pat = tok.s.slice(i + 1);
      const d = get(resolve(dirPart || '.')); if (!d || d.t !== 'd') return [tok.s];
      const re = new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
      const hits = Object.keys(d.kids).filter((k) => re.test(k) && (pat[0] === '.' || k[0] !== '.')).sort();
      return hits.length ? hits.map((k) => dirPart + k) : [tok.s];
    }

    /* ---- helpers for commands ---- */
    const lines = (t) => { const a = String(t).split('\n'); if (a.length && a[a.length - 1] === '') a.pop(); return a; };
    const join = (a) => (a.length ? a.join('\n') + '\n' : '');
    const ok = (out) => ({ out: out || '', err: '' });
    const bad = (msg) => ({ out: '', err: msg });
    function opts(args, valued) {
      const f = {}, rest = [];
      for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a === '--') { rest.push.apply(rest, args.slice(i + 1)); break; }
        if (/^-\d+$/.test(a)) { f.num = +a.slice(1); continue; }
        if (/^-[A-Za-z]/.test(a)) {
          for (let k = 1; k < a.length; k++) { const ch = a[k]; if (valued.indexOf(ch) >= 0) { f[ch] = a.slice(k + 1) || args[++i]; break; } f[ch] = true; }
        } else rest.push(a);
      }
      return { f, rest };
    }
    function inputs(cmd, files, input) {
      if (!files.length) return { list: [{ name: '(standard input)', text: input || '' }], errs: '' };
      const list = []; let errs = '';
      files.forEach((p) => {
        const n = get(resolve(p));
        if (!n) errs += cmd + ': ' + p + ': No such file or directory\n';
        else if (n.t === 'd') errs += cmd + ': ' + p + ': Is a directory\n';
        else list.push({ name: p, text: n.content });
      });
      return { list, errs };
    }
    function walk(path, fn) {
      const n = get(path); if (!n) return;
      fn(path, n);
      if (n.t === 'd') Object.keys(n.kids).sort().forEach((k) => walk((path === '/' ? '' : path) + '/' + k, fn));
    }
    function toRegex(pat, ere, ci) {
      let src = pat;
      if (!ere) { /* basic regex: + ? | ( ) { } are literal unless escaped */
        let o = '';
        for (let i = 0; i < pat.length; i++) {
          const c = pat[i];
          if (c === '\\' && i + 1 < pat.length) { const d = pat[++i]; o += '+?|(){}'.indexOf(d) >= 0 ? d : '\\' + d; }
          else if ('+?|(){}'.indexOf(c) >= 0) o += '\\' + c; else o += c;
        }
        src = o;
      }
      return new RegExp(src, ci ? 'i' : '');
    }
    const sha = async (algo, text) => {
      const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    };

    /* ---- awk subset: [pattern] {print items}, -F separator, END {print NR} ---- */
    function awkFields(line, sep) { return sep ? line.split(sep) : line.trim().split(/\s+/).filter((x) => x !== ''); }
    function awkAtom(a, F, line, NR) {
      a = a.trim();
      if (a === '$0') return line;
      if (a === 'NR') return String(NR);
      if (a === '$NF') return F[F.length - 1] === undefined ? '' : F[F.length - 1];
      let m = /^\$\(NF-(\d+)\)$/.exec(a); if (m) return F[F.length - 1 - +m[1]] === undefined ? '' : F[F.length - 1 - +m[1]];
      m = /^\$(\d+)$/.exec(a); if (m) return F[+m[1] - 1] === undefined ? '' : F[+m[1] - 1];
      m = /^"(.*)"$/.exec(a); if (m) return m[1];
      throw new Error('awk: unsupported expression: ' + a);
    }
    function splitTop(s, ch) { const out = []; let cur = '', q = false, d = 0; for (const c of s) { if (c === '"') q = !q; if (!q && c === '(') d++; if (!q && c === ')') d--; if (!q && !d && c === ch) { out.push(cur); cur = ''; } else cur += c; } out.push(cur); return out; }
    function awkAtoms(s) { const out = []; let cur = '', q = false, d = 0; for (const c of s) { if (c === '"') q = !q; if (!q && c === '(') d++; if (!q && c === ')') d--; if (!q && !d && /\s/.test(c)) { if (cur) out.push(cur); cur = ''; } else cur += c; } if (cur) out.push(cur); return out; }
    function awk(prog, sep, text) {
      prog = prog.trim();
      const em = /^END\s*\{\s*print\s+NR\s*\}$/.exec(prog);
      if (em) return String(lines(text).length) + '\n';
      const m = /^(?:(\/.+\/)\s*)?(?:(\$NF|\$\(NF-\d+\)|\$\d+|NR)\s*(==|!=|>=|<=|>|<|~|!~)\s*("[^"]*"|\S+?)\s*)?(?:\{\s*print\s*(.*?)\s*\}\s*)?$/.exec(prog);
      if (!m) throw new Error('awk: this sandbox supports: [/regex/ | $N op value] {print $N, "text"} and END {print NR}');
      const re = m[1] ? new RegExp(m[1].slice(1, -1)) : null; const out = [];
      lines(text).forEach((ln, idx) => {
        const F = awkFields(ln, sep);
        if (re && !re.test(ln)) return;
        if (m[2]) {
          const lhs = awkAtom(m[2], F, ln, idx + 1); let rhs = m[4]; if (rhs[0] === '"') rhs = rhs.slice(1, -1);
          const num = lhs !== '' && !isNaN(lhs) && !isNaN(rhs); const a = num ? +lhs : lhs, b = num ? +rhs : rhs; let pass;
          switch (m[3]) { case '==': pass = a === b; break; case '!=': pass = a !== b; break; case '>': pass = a > b; break; case '<': pass = a < b; break; case '>=': pass = a >= b; break; case '<=': pass = a <= b; break; case '~': pass = new RegExp(rhs).test(lhs); break; default: pass = !new RegExp(rhs).test(lhs); }
          if (!pass) return;
        }
        if (m[5] === undefined || m[5] === '') { out.push(ln); return; }
        out.push(splitTop(m[5], ',').map((piece) => awkAtoms(piece).map((a) => awkAtom(a, F, ln, idx + 1)).join('')).join(' '));
      });
      return join(out);
    }

    /* ---- chmod ---- */
    function applyMode(node, spec) {
      if (/^[0-7]{3,4}$/.test(spec)) { node.mode = parseInt(spec, 8); return true; }
      let m = node.mode;
      for (const clause of spec.split(',')) {
        const c = /^([ugoa]*)([+\-=])([rwxst]*)$/.exec(clause); if (!c) return false;
        const who = c[1] || 'a'; const op = c[2]; const perms = c[3];
        const targets = who.indexOf('a') >= 0 ? ['u', 'g', 'o'] : who.split('');
        let mask = 0;
        targets.forEach((t) => {
          const sh2 = t === 'u' ? 6 : t === 'g' ? 3 : 0;
          if (perms.indexOf('r') >= 0) mask |= 4 << sh2; if (perms.indexOf('w') >= 0) mask |= 2 << sh2; if (perms.indexOf('x') >= 0) mask |= 1 << sh2;
          if (perms.indexOf('s') >= 0) { if (t === 'u') mask |= 0o4000; if (t === 'g') mask |= 0o2000; }
          if (perms.indexOf('t') >= 0) mask |= 0o1000;
        });
        if (op === '+') m |= mask; else if (op === '-') m &= ~mask; else { const clear = targets.reduce((a, t) => a | (7 << (t === 'u' ? 6 : t === 'g' ? 3 : 0)), 0); m = (m & ~clear) | mask; }
      }
      node.mode = m; return true;
    }

    /* ---- commands ---- */
    const cmds = {};
    cmds.help = async () => ok('Commands in this sandbox:\n  ls cd pwd cat head tail wc grep sort uniq cut awk sed echo find chmod chown\n  sha256sum sha1sum base64 date whoami id hostname uname history clear help\nPipes (|) and ; work. Globs like *.log work. Redirection (>) is disabled.\nTip: grep -c counts matches, sort | uniq -c counts repeats, sort -nr ranks them.\n');
    cmds.pwd = async () => ok(sh.cwd + '\n');
    cmds.whoami = async () => ok(user + '\n');
    cmds.id = async () => ok('uid=1000(' + user + ') gid=1000(' + user + ') groups=1000(' + user + ')\n');
    cmds.hostname = async () => ok(host + '\n');
    cmds.uname = async () => ok('Linux\n');
    cmds.date = async () => ok('Thu Mar 14 11:30:00 UTC 2024\n');
    cmds.clear = async () => ({ out: '', err: '', clear: true });
    cmds.history = async () => ok(join(sh.history.map((h, i) => String(i + 1).padStart(4) + '  ' + h)));
    cmds.echo = async (a) => { const o = opts(a, ''); return ok(o.rest.join(' ') + (o.f.n ? '' : '\n')); };
    cmds.cd = async (a) => { const p = resolve(a[0] || '~'); const n = get(p); if (!n) return bad('bash: cd: ' + (a[0] || '~') + ': No such file or directory'); if (n.t !== 'd') return bad('bash: cd: ' + a[0] + ': Not a directory'); sh.cwd = p; return ok(); };
    cmds.ls = async (a) => {
      const o = opts(a, ''); const targets = o.rest.length ? o.rest : ['.']; let out = '', err = '';
      const row = (name, n) => (o.f.l ? modeStr(n) + ' 1 ' + n.owner.padEnd(8) + ' ' + n.group.padEnd(8) + ' ' + String(n.t === 'f' ? n.content.length : 4096).padStart(6) + ' Mar 14 02:00 ' + name : name);
      targets.forEach((t, ti) => {
        const n = get(resolve(t));
        if (!n) { err += 'ls: cannot access \'' + t + '\': No such file or directory\n'; return; }
        if (n.t === 'f') { out += row(t, n) + '\n'; return; }
        if (targets.length > 1) out += (ti ? '\n' : '') + t + ':\n';
        const names = Object.keys(n.kids).sort().filter((k) => o.f.a || k[0] !== '.');
        if (o.f.l) out += 'total ' + names.length + '\n';
        const items = names.map((k) => row(k, n.kids[k]));
        out += o.f.l ? join(items) : (items.length ? items.join('  ') + '\n' : '');
      });
      return { out, err };
    };
    cmds.cat = async (a, input) => { const r = inputs('cat', a, input); return { out: r.list.map((x) => x.text).join(''), err: r.errs }; };
    cmds.head = async (a, input) => { const o = opts(a, 'n'); const n = o.f.n !== undefined ? +o.f.n : o.f.num || 10; const r = inputs('head', o.rest, input); return { out: r.list.map((x) => join(lines(x.text).slice(0, n))).join(''), err: r.errs }; };
    cmds.tail = async (a, input) => { const o = opts(a, 'n'); const n = o.f.n !== undefined ? +o.f.n : o.f.num || 10; const r = inputs('tail', o.rest, input); return { out: r.list.map((x) => join(lines(x.text).slice(-n))).join(''), err: r.errs }; };
    cmds.wc = async (a, input) => {
      const o = opts(a, ''); const r = inputs('wc', o.rest, input); const any = o.f.l || o.f.w || o.f.c;
      return { out: r.list.map((x) => { const L2 = lines(x.text).length, W = x.text.split(/\s+/).filter(Boolean).length, B = x.text.length; const parts = any ? [o.f.l ? L2 : null, o.f.w ? W : null, o.f.c ? B : null].filter((v) => v !== null) : [L2, W, B]; return parts.join(' ') + (o.rest.length ? ' ' + x.name : '') + '\n'; }).join(''), err: r.errs };
    };
    cmds.grep = async (a, input) => {
      const o = opts(a, 'e'); const pat = o.f.e !== undefined ? o.f.e : o.rest.shift();
      if (pat === undefined) return bad('Usage: grep [OPTION]... PATTERN [FILE]...');
      let re; try { re = toRegex(pat, !!o.f.E, !!o.f.i); } catch (e) { return bad('grep: invalid regular expression'); }
      let files = o.rest;
      if (o.f.r) { const exp = []; (files.length ? files : ['.']).forEach((p) => { const base = resolve(p); walk(base, (path, n) => { if (n.t === 'f') exp.push(path); }); }); files = exp; }
      const r = inputs('grep', files, input); let out = '', total = 0;
      r.list.forEach((x) => {
        let c = 0;
        lines(x.text).forEach((ln, i) => {
          const hit = re.test(ln) !== !!o.f.v; if (!hit) return; c++;
          if (o.f.c) return;
          const pre = (r.list.length > 1 ? x.name + ':' : '') + (o.f.n ? (i + 1) + ':' : '');
          if (o.f.o) { const mm = ln.match(new RegExp(re.source, re.flags + 'g')); (mm || []).forEach((s) => { out += pre + s + '\n'; }); } else out += pre + ln + '\n';
        });
        total += c; if (o.f.c) out += (r.list.length > 1 ? x.name + ':' : '') + c + '\n';
      });
      return { out, err: r.errs };
    };
    cmds.sort = async (a, input) => {
      const o = opts(a, 'kt'); const r = inputs('sort', o.rest, input); let ls = [];
      r.list.forEach((x) => { ls = ls.concat(lines(x.text)); });
      const key = (ln) => { if (o.f.k === undefined) return ln; const parts = o.f.t ? ln.split(o.f.t) : ln.trim().split(/\s+/); return parts[+o.f.k - 1] === undefined ? '' : parts[+o.f.k - 1]; };
      const num = (s) => { const m = /^\s*(-?\d+(\.\d+)?)/.exec(s); return m ? parseFloat(m[1]) : 0; };
      ls.sort((x, y) => { const kx = key(x), ky = key(y); const c = o.f.n ? num(kx) - num(ky) : (kx < ky ? -1 : kx > ky ? 1 : 0); return c || (x < y ? -1 : x > y ? 1 : 0); });
      if (o.f.r) ls.reverse(); if (o.f.u) ls = ls.filter((v, i) => !i || v !== ls[i - 1]);
      return { out: join(ls), err: r.errs };
    };
    cmds.uniq = async (a, input) => {
      const o = opts(a, ''); const r = inputs('uniq', o.rest, input); const out = []; let prev = null, cnt = 0;
      const flush = () => { if (prev !== null) out.push(o.f.c ? String(cnt).padStart(7) + ' ' + prev : prev); };
      r.list.forEach((x) => lines(x.text).forEach((ln) => { if (ln === prev) cnt++; else { flush(); prev = ln; cnt = 1; } }));
      flush(); return { out: join(out), err: r.errs };
    };
    cmds.cut = async (a, input) => {
      const o = opts(a, 'dfc'); const r = inputs('cut', o.rest, input); if (o.f.f === undefined) return bad('cut: you must specify a list of fields (-f)');
      const idx = []; String(o.f.f).split(',').forEach((p) => { const m = /^(\d+)(?:-(\d+))?$/.exec(p); if (m) { for (let i = +m[1]; i <= (m[2] ? +m[2] : +m[1]); i++) idx.push(i - 1); } });
      const d = o.f.d === undefined ? '\t' : o.f.d;
      return { out: join(r.list.reduce((acc, x) => acc.concat(lines(x.text).map((ln) => { const p = ln.split(d); return p.length === 1 && d !== ln ? ln : idx.map((i) => p[i]).filter((v) => v !== undefined).join(d); })), [])), err: r.errs };
    };
    cmds.awk = async (a, input) => {
      const o = opts(a, 'F'); const prog = o.rest.shift(); if (prog === undefined) return bad('awk: no program given');
      const r = inputs('awk', o.rest, input); try { return { out: r.list.map((x) => awk(prog, o.f.F, x.text)).join(''), err: r.errs }; } catch (e) { return bad(e.message); }
    };
    cmds.sed = async (a, input) => {
      const o = opts(a, 'e'); const prog = o.f.e !== undefined ? o.f.e : o.rest.shift(); const m = /^s\/((?:[^\/\\]|\\.)*)\/((?:[^\/\\]|\\.)*)\/([gi]*)$/.exec(prog || '');
      if (!m) return bad('sed: this sandbox supports only: s/pattern/replacement/[g]'); const r = inputs('sed', o.rest, input);
      let re; try { re = new RegExp(m[1], m[3]); } catch (e) { return bad('sed: invalid regular expression'); }
      return { out: r.list.map((x) => join(lines(x.text).map((ln) => ln.replace(re, m[2])))).join(''), err: r.errs };
    };
    cmds.find = async (a) => {
      const o = []; let start = '.'; const rest = a.slice(); if (rest.length && rest[0][0] !== '-') start = rest.shift();
      let name = null, type = null, perm = null, owner = null;
      for (let i = 0; i < rest.length; i++) { const k = rest[i], v = rest[i + 1]; if (k === '-name') { name = v; i++; } else if (k === '-type') { type = v; i++; } else if (k === '-perm') { perm = v; i++; } else if (k === '-user') { owner = v; i++; } else return bad('find: unsupported option: ' + k); }
      const base = resolve(start); if (!get(base)) return bad("find: '" + start + "': No such file or directory");
      const re = name ? new RegExp('^' + name.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$') : null;
      walk(base, (path, n) => {
        if (type && ((type === 'f') !== (n.t === 'f') || (type === 'd') !== (n.t === 'd'))) return;
        if (re && !re.test(path.split('/').pop())) return;
        if (owner && n.owner !== owner) return;
        if (perm) { const all = perm[0] === '-'; const bits = parseInt(perm.replace(/^[-\/]/, ''), 8); if (all ? (n.mode & bits) !== bits : perm[0] === '/' ? (n.mode & bits) === 0 : (n.mode & 0o7777) !== bits) return; }
        o.push(start[0] === '/' || start === '.' ? (start === '.' ? '.' + path.slice(sh.cwd === '/' ? 0 : sh.cwd.length) || '.' : path) : path);
      });
      return ok(join(o.map((p) => (p === '' ? '.' : p))));
    };
    cmds.chmod = async (a) => {
      const o = opts(a.filter((x) => !/^-[ugoa]*[+\-=]/.test(x) || /^-R$/.test(x)), ''); const f = a.filter((x) => /^-[ugoa]*[+\-=]/.test(x));
      const rest = o.f.R ? o.rest : o.rest; const spec = f.length ? f[0].slice(1) : rest.shift();
      if (!spec || !rest.length) return bad('chmod: missing operand');
      let err = '';
      rest.forEach((p) => { const n = get(resolve(p)); if (!n) { err += "chmod: cannot access '" + p + "': No such file or directory\n"; return; } const targets = []; if (o.f.R) walk(resolve(p), (pp, nn) => targets.push(nn)); else targets.push(n); targets.forEach((nn) => { if (!applyMode(nn, spec)) err = "chmod: invalid mode: '" + spec + "'\n"; }); });
      return { out: '', err };
    };
    cmds.chown = async (a) => {
      const o = opts(a, ''); const spec = o.rest.shift(); if (!spec || !o.rest.length) return bad('chown: missing operand'); const parts = spec.split(':'); let err = '';
      o.rest.forEach((p) => { const n = get(resolve(p)); if (!n) { err += "chown: cannot access '" + p + "': No such file or directory\n"; return; } if (parts[0]) n.owner = parts[0]; if (parts[1]) n.group = parts[1]; });
      return { out: '', err };
    };
    const hasher = (name, algo) => async (a, input) => {
      const o = opts(a, ''); let out = '', err = '';
      if (o.f.c) {
        const mf = o.rest[0]; const txt = mf ? sh.read(mf) : input; if (txt === null || txt === undefined) return bad(name + ': ' + mf + ': No such file or directory'); let failed = 0;
        for (const ln of lines(txt)) { const m = /^([0-9a-f]+)\s+\*?(.+)$/.exec(ln.trim()); if (!m) continue; const c = sh.read(m[2]); if (c === null) { out += m[2] + ': FAILED open or read\n'; failed++; continue; } const h = await sha(algo, c); if (h === m[1]) out += m[2] + ': OK\n'; else { out += m[2] + ': FAILED\n'; failed++; } }
        if (failed) err = name + ': WARNING: ' + failed + ' computed checksum' + (failed > 1 ? 's' : '') + ' did NOT match\n';
        return { out, err };
      }
      const r = inputs(name, o.rest, input); err = r.errs;
      for (const x of r.list) out += (await sha(algo, x.text)) + '  ' + (o.rest.length ? x.name : '-') + '\n';
      return { out, err };
    };
    cmds.sha256sum = hasher('sha256sum', 'SHA-256'); cmds.sha1sum = hasher('sha1sum', 'SHA-1');
    cmds.base64 = async (a, input) => {
      const o = opts(a, ''); const r = inputs('base64', o.rest, input);
      try { return { out: r.list.map((x) => (o.f.d ? decodeURIComponent(escape(atob(x.text.replace(/\s+/g, '')))) : btoa(unescape(encodeURIComponent(x.text))) + '\n')).join(''), err: r.errs }; } catch (e) { return bad('base64: invalid input'); }
    };

    sh.commands = Object.keys(cmds).filter((k) => k !== 'clear');
    /* run one command line; resolves to { out, err, clear } */
    sh.run = async function (line) {
      line = line.trim(); if (!line) return { out: '', err: '' };
      sh.history.push(line); let lists;
      try { lists = parseLine(line); } catch (e) { return { out: '', err: e.message + '\n' }; }
      let out = '', err = '', clear = false;
      for (const pipe of lists) {
        let input = null, last = '';
        for (const argv of pipe) {
          const args = []; argv.forEach((t) => { expand(t).forEach((s) => args.push(s)); });
          const name = args.shift(); const fn = cmds[name];
          if (!fn) { err += 'bash: ' + name + ': command not found\n'; last = ''; input = ''; continue; }
          let r; try { r = await fn(args, input); } catch (e) { r = bad(name + ': ' + e.message); }
          if (r.err) err += r.err.slice(-1) === '\n' ? r.err : r.err + '\n';
          if (r.clear) clear = true; input = r.out || ''; last = input;
        }
        out += last;
      }
      return { out, err, clear };
    };
    return sh;
  };

  /* ------------------------------------------------------------------ firewall */
  const ipInt = (s) => { const m = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(s); if (!m) return null; const o = m.slice(1).map(Number); if (o.some((x) => x > 255)) return null; return ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0; };
  C.ipInt = ipInt;
  C.cidr = function (s) {
    s = String(s || '').trim(); if (s.toLowerCase() === 'any') return { any: true };
    const m = /^(\d+\.\d+\.\d+\.\d+)(?:\/(\d+))?$/.exec(s); if (!m) return null;
    const base = ipInt(m[1]); if (base === null) return null; const bits = m[2] === undefined ? 32 : +m[2]; if (bits > 32) return null;
    const mask = bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0; return { base: (base & mask) >>> 0, mask };
  };
  C.ipIn = (ip, c) => { if (!c) return false; if (c.any) return true; const v = ipInt(ip); return v !== null && ((v & c.mask) >>> 0) === c.base; };
  C.portSpec = function (s) {
    s = String(s === undefined ? '' : s).trim().toLowerCase(); if (s === 'any' || s === '') return { any: true };
    let m = /^(\d+)$/.exec(s); if (m && +m[1] <= 65535) return { lo: +m[1], hi: +m[1] };
    m = /^(\d+)-(\d+)$/.exec(s); if (m && +m[1] <= +m[2] && +m[2] <= 65535) return { lo: +m[1], hi: +m[2] }; return null;
  };
  C.fwRuleError = function (r) {
    if (!C.cidr(r.src)) return 'Source must be "any", an address, or a CIDR such as 10.0.1.0/24';
    if (!C.cidr(r.dst)) return 'Destination must be "any", an address, or a CIDR such as 10.0.5.10';
    if (r.proto !== 'icmp' && r.proto !== 'any' && !C.portSpec(r.port)) return 'Port must be "any", a number, or a range such as 1000-2000';
    return '';
  };
  C.fwEval = function (rules, p) {
    for (let i = 0; i < rules.length; i++) {
      const r = rules[i]; if (C.fwRuleError(r)) continue;
      if (r.proto !== 'any' && r.proto !== p.proto) continue;
      if (!C.ipIn(p.src, C.cidr(r.src)) || !C.ipIn(p.dst, C.cidr(r.dst))) continue;
      if (p.proto === 'tcp' || p.proto === 'udp') { const ps = C.portSpec(r.port); if (r.proto === 'any' && r.port && String(r.port).toLowerCase() !== 'any' && !ps) continue; if (ps && !ps.any && (p.port < ps.lo || p.port > ps.hi)) continue; }
      return { action: r.action, rule: i };
    }
    return { action: 'deny', rule: -1 };
  };

  /* Build the state object that task checks read, for a firewall lab given a rule list. Shared by the UI and the tests. */
  C.fwContext = function (d, rules) {
    const ctx = { rules, results: {}, constraints: {}, constraintsOk: true };
    d.tests.forEach((t) => { const r = C.fwEval(rules, { proto: t.proto, src: t.src, dst: t.dst, port: t.port }); ctx.results[t.id] = { ok: r.action === t.expect, action: r.action, rule: r.rule }; });
    (d.constraints || []).forEach((c) => { let ok = false; try { ok = !!c.check(rules); } catch (e) { ok = false; } ctx.constraints[c.id] = ok; if (!ok) ctx.constraintsOk = false; });
    return ctx;
  };
  C.configContext = function (d, text) {
    const ctx = { text, checks: {} };
    d.checks.forEach((c) => { let ok = false; try { ok = !!c.test(text); } catch (e) { ok = false; } ctx.checks[c.id] = ok; });
    return ctx;
  };

  /* ------------------------------------------------------------------ config files */
  C.cfg = {
    /* last uncommented "key value" or "key=value" line, or null */
    value(text, key, sep) {
      let v = null;
      String(text).split('\n').forEach((ln) => { const t = ln.trim(); if (!t || t[0] === '#' || t[0] === ';') return; const m = sep === '=' ? new RegExp('^' + key + '\\s*=\\s*(.*?)\\s*$', 'i').exec(t) : new RegExp('^' + key + '\\s+(.*?)\\s*$', 'i').exec(t); if (m) v = m[1].replace(/\s*#.*$/, ''); });
      return v;
    },
    all(text, key, sep) { const out = []; String(text).split('\n').forEach((ln) => { const t = ln.trim(); if (!t || t[0] === '#') return; const m = (sep === '=' ? new RegExp('^' + key + '\\s*=\\s*(.*?)\\s*$', 'i') : new RegExp('^' + key + '\\s+(.*?)\\s*$', 'i')).exec(t); if (m) out.push(m[1]); }); return out; },
    has(text, re) { return String(text).split('\n').some((ln) => { const t = ln.trim(); return t && t[0] !== '#' && re.test(t); }); },
    num(text, key, sep) { const v = C.cfg.value(text, key, sep); return v === null || isNaN(v) ? null : +v; }
  };

  /* ------------------------------------------------------------------ packet capture filter */
  const PROTO_WORDS = ['tcp', 'udp', 'icmp', 'arp', 'dns', 'http', 'ftp', 'telnet', 'tls', 'ssh', 'smtp'];
  function clause(raw) {
    let c = raw.trim(); if (!c) return null; let neg = false;
    if (c[0] === '!') { neg = true; c = c.slice(1).trim(); }
    let m, f;
    if ((m = /^ip\.(addr|src|dst)\s*(==|!=)\s*(\S+)$/i.exec(c))) { const k = m[1].toLowerCase(), eq = m[2] === '==', v = m[3]; f = (p) => ((k === 'addr' ? p.src === v || p.dst === v : k === 'src' ? p.src === v : p.dst === v) === eq); }
    else if ((m = /^(tcp|udp)\.(port|srcport|dstport)\s*(==|!=)\s*(\d+)$/i.exec(c))) { const pr = m[1].toLowerCase(), k = m[2].toLowerCase(), eq = m[3] === '==', v = +m[4]; f = (p) => p.proto === pr && ((k === 'port' ? p.sport === v || p.dport === v : k === 'srcport' ? p.sport === v : p.dport === v) === eq); }
    else if ((m = /^tcp\.flags\.(syn|ack|rst|fin|psh)\s*==\s*([01])$/i.exec(c))) { const ch = { syn: 'S', ack: 'A', rst: 'R', fin: 'F', psh: 'P' }[m[1].toLowerCase()], want = m[2] === '1'; f = (p) => p.proto === 'tcp' && ((p.flags || '').indexOf(ch) >= 0) === want; }
    else if ((m = /^(?:frame|info|payload|dns\.qry\.name|http\.request\.uri|http|ftp|data)?\s*contains\s+"?([^"]+?)"?$/i.exec(c))) { const v = m[1].toLowerCase(); f = (p) => ((p.info || '') + ' ' + (p.payload || '')).toLowerCase().indexOf(v) >= 0; }
    else if ((m = /^len\s*(>=|<=|>|<|==)\s*(\d+)$/i.exec(c))) { const v = +m[2], op = m[1]; f = (p) => (op === '>' ? p.len > v : op === '<' ? p.len < v : op === '>=' ? p.len >= v : op === '<=' ? p.len <= v : p.len === v); }
    else if (PROTO_WORDS.indexOf(c.toLowerCase()) >= 0) { const w = c.toLowerCase(); f = (p) => p.proto === w || p.app === w; }
    else return { error: 'Unrecognized filter: ' + raw.trim() };
    return { f: neg ? (p) => !f(p) : f };
  }
  /* filter syntax: clauses joined with "and" / "&&" (all must match); groups joined with "or" / "||" */
  C.pcapFilter = function (text) {
    text = String(text || '').trim(); if (!text) return { f: () => true };
    const groups = text.split(/\s+or\s+|\|\|/i).map((g) => g.split(/\s+and\s+|&&/i).map(clause));
    for (const g of groups) for (const c of g) { if (!c) return { error: 'Empty condition in filter' }; if (c.error) return { error: c.error }; }
    return { f: (p) => groups.some((g) => g.every((c) => c.f(p))) };
  };
  C.countBy = function (arr, fn) { const m = {}; arr.forEach((x) => { const k = fn(x); m[k] = (m[k] || 0) + 1; }); return Object.keys(m).map((k) => [k, m[k]]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)); };

  /* ------------------------------------------------------------------ phishing / classify scoring */
  C.emailResult = function (data, st) {
    const bad = data.indicators.filter((i) => i.bad).map((i) => i.id), flagged = Object.keys(st.flags).filter((k) => st.flags[k]);
    const missed = bad.filter((id) => flagged.indexOf(id) < 0), falseFlags = flagged.filter((id) => bad.indexOf(id) < 0);
    return { missed, falseFlags, flagsOk: !missed.length && !falseFlags.length, verdictOk: st.verdict === data.verdict, actionOk: st.action === data.action };
  };
  C.classifyResult = function (data, answers) {
    const wrong = data.items.filter((it) => answers[it.id] !== it.correct).map((it) => it.id);
    return { wrong, correct: data.items.length - wrong.length, total: data.items.length, allOk: !wrong.length };
  };
})();
