#!/usr/bin/env node
/* Browser smoke test. Serves this folder locally, opens tests/smoke.html in headless Chrome or Edge (driven over the DevTools
 * protocol, in real time), and prints the PASS/FAIL lines the page produces. Needs Node 22+ and Chrome or Edge installed
 * (set BROWSER=/path/to/browser to override). No npm packages required.
 * Usage: node tests/smoke.js */
'use strict';
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const root = path.join(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const candidates = [process.env.BROWSER,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
const browser = candidates.find((p) => { try { return fs.existsSync(p); } catch (e) { return false; } });
if (!browser) { console.log('No Chrome or Edge found. Set BROWSER to its path.'); process.exit(2); }
if (typeof WebSocket === 'undefined') { console.log('This script needs Node 22 or newer (built-in WebSocket).'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
});

async function run(port) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'secprep-smoke-'));
  const child = spawn(browser, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });
  const cleanup = () => { try { child.kill(); } catch (e) { /* ignore */ } setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* ignore */ } }, 800); };
  try {
    let dport = 0;
    for (let i = 0; i < 100 && !dport; i++) { try { dport = parseInt(fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0], 10); } catch (e) { await sleep(100); } }
    if (!dport) throw new Error('the browser did not start');
    const url = 'http://127.0.0.1:' + port + '/tests/smoke.html';
    const t = await (await fetch('http://127.0.0.1:' + dport + '/json/new?' + encodeURIComponent(url), { method: 'PUT' })).json();
    const ws = new WebSocket(t.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('could not connect to the browser')); });
    let id = 0; const pending = new Map();
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
    const evalJs = (expression) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method: 'Runtime.evaluate', params: { expression, returnByValue: true } })); });
    const started = Date.now(); let text = '', done = false;
    while (Date.now() - started < 180000) {
      const r = await evalJs('JSON.stringify({done: document.body && document.body.getAttribute("data-finished") === "yes", out: (document.getElementById("out") || {}).textContent || ""})');
      try { const v = JSON.parse(r.result.result.value); text = v.out; done = v.done; } catch (e) { /* page still loading */ }
      if (done) break;
      await sleep(400);
    }
    ws.close();
    return { text, done };
  } finally { cleanup(); }
}

server.listen(0, '127.0.0.1', async () => {
  let result = { text: '', done: false };
  try { result = await run(server.address().port); } catch (e) { console.log('Error: ' + e.message); }
  server.close();
  console.log(result.text.trim() || 'No results were produced.');
  const bad = (result.text.match(/^FAIL/gm) || []).length, good = (result.text.match(/^PASS/gm) || []).length;
  console.log('\n' + good + ' passed, ' + bad + ' failed' + (result.done ? '' : ' (the run did not finish)'));
  process.exit(result.done && !bad && good ? 0 : 1);
});
