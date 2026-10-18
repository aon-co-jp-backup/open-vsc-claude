// End-to-end test of the generated Rust + Leptos (trunk) frontend in a real browser.
//   direct : browser -> FastAPI subgraph (:4001)                         (subgraph answers CORS itself)
//   rpoem  : browser -> RPoem gateway (:8080) -> FastAPI subgraph (:4001) (needs the RPoem gateway binary)
// Needs: Rust + wasm32-unknown-unknown + trunk, Python with fastapi/uvicorn/strawberry-graphql, Chromium via playwright.
// Usage: node scripts/e2e-leptos.js [direct|rpoem|all]     env RPOEM_GATEWAY=path\to\open-runo-gateway(.exe)
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const net = require('net');
const { spawn, spawnSync } = require('child_process');
const { chromium } = require('playwright');
const { generate } = require('../out/catalog.js');

const mode = process.argv[2] || 'all';
const isWin = process.platform === 'win32';
const cargoBin = path.join(os.homedir(), '.cargo', 'bin');
const env = { ...process.env, PATH: cargoBin + path.delimiter + process.env.PATH, CARGO_TARGET_DIR: path.join(os.tmpdir(), 'ovc-leptos-target') };
const gatewayBin = process.env.RPOEM_GATEWAY || (isWin ? 'F:/RPoem/target/debug/open-runo-gateway.exe' : path.join(os.homedir(), 'RPoem/target/debug/open-runo-gateway'));

function check(c, m) { if (!c) throw new Error('check failed: ' + m); }
function portOpen(port) {
  return new Promise((res) => { const s = net.connect(port, '127.0.0.1'); s.on('connect', () => { s.destroy(); res(true); }); s.on('error', () => res(false)); });
}
async function waitPort(port, ms = 30000) {
  const t = Date.now();
  while (Date.now() - t < ms) { if (await portOpen(port)) return; await new Promise((r) => setTimeout(r, 300)); }
  throw new Error('port ' + port + ' did not open');
}

function write(dir, files) {
  for (const [p, c] of Object.entries(files)) { const f = path.join(dir, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, c); }
}

function serve(dir, port) {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm' };
  const server = http.createServer((req, res) => {
    const p = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/$/, '/index.html'));
    fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
  });
  return new Promise((r) => server.listen(port, '127.0.0.1', () => r(server)));
}

async function run(variant) {
  const gateway = variant === 'rpoem' ? 'rpoem' : 'none';
  if (variant === 'rpoem' && !fs.existsSync(gatewayBin)) { console.log('skip rpoem: gateway binary not found at ' + gatewayBin); return 'skipped'; }
  for (const p of [4001, 8080]) check(!(await portOpen(p)), 'port ' + p + ' is already in use');

  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ovc-leptos-' + variant + '-'));
  write(root, generate({ style: 'cosmo', frontend: 'rust-leptos', gateway, database: 'none', backend: 'python-fastapi' }));
  const procs = [];
  let server;
  try {
    console.log(`[${variant}] trunk build (first run compiles Leptos, several minutes)`);
    const b = spawnSync('trunk', ['build'], { cwd: path.join(root, 'frontend'), env, shell: isWin, encoding: 'utf8' });
    check(b.status === 0, 'trunk build failed:\n' + (b.stdout || '').slice(-1500) + (b.stderr || '').slice(-1500));
    check(fs.existsSync(path.join(root, 'frontend', 'dist', 'index.html')), 'dist/index.html missing');

    const sub = spawn('python', ['-m', 'uvicorn', 'main:app', '--port', '4001'], { cwd: path.join(root, 'backend'), env, shell: false });
    procs.push(sub);
    await waitPort(4001);
    if (variant === 'rpoem') {
      const gw = spawn(gatewayBin, [], { env: { ...env, OPEN_RUNO_SUBGRAPHS: 'items=http://localhost:4001/graphql' } });
      procs.push(gw);
      await waitPort(8080);
    }
    server = await serve(path.join(root, 'frontend', 'dist'), 8099);

    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      const gql = [];
      page.on('request', (r) => { if (r.url().includes('/graphql') && r.method() === 'POST') gql.push(r.url()); });
      await page.goto('http://127.0.0.1:8099/');
      await page.waitForSelector('input');
      await page.fill('input', 'leptos-' + variant);
      await page.click('button');
      await page.waitForFunction((t) => document.body.innerText.includes(t), 'leptos-' + variant, { timeout: 15000 });
      const expected = variant === 'rpoem' ? ':8080/graphql' : ':4001/graphql';
      check(gql.some((u) => u.includes(expected)), 'GraphQL was not sent to ' + expected + ' (saw ' + gql.join(', ') + ')');
      check(errors.length === 0, 'console errors: ' + errors.join(' | '));
      console.log(`ok: ${variant} (item added and listed through ${expected})`);
    } finally {
      await browser.close();
    }
    return 'ok';
  } finally {
    if (server) server.close();
    for (const p of procs) { try { p.kill(); } catch (e) { /* already gone */ } }
    await new Promise((r) => setTimeout(r, 500));
    if (isWin) for (const name of ['open-runo-gateway.exe']) spawnSync('taskkill', ['/F', '/IM', name], { stdio: 'ignore' });
    fs.rmSync(root, { recursive: true, force: true });
  }
}

(async () => {
  const t = spawnSync('trunk', ['--version'], { env, shell: isWin, encoding: 'utf8' });
  if (t.status !== 0) { console.error('trunk is not installed (cargo install trunk --locked); wasm32-unknown-unknown target is also required'); process.exit(2); }
  const variants = mode === 'all' ? ['direct', 'rpoem'] : [mode];
  const results = {};
  for (const v of variants) results[v] = await run(v);
  console.log('e2e leptos:', JSON.stringify(results));
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
