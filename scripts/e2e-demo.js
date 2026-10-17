// End-to-end check of the browser demo in real Chromium (desktop + phone, touch): needs `npm run build:demo` first
// and the Chromium that @vscode/test-web installs through playwright.  Usage: node scripts/e2e-demo.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const dir = path.resolve(__dirname, '..', 'webpage');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\/$/, '/index.html'));
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
    res.end(data);
  });
});

function check(cond, msg) {
  if (!cond) throw new Error('check failed: ' + msg);
}

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch();
  try {
    for (const [name, vp, mobile] of [['desktop', { width: 1280, height: 800 }, false], ['phone', { width: 390, height: 844 }, true]]) {
      const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(base + '?lang=en');
      await page.waitForSelector('#files .f');
      check(!(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), name + ': horizontal scroll');

      await page.selectOption('#style', 'rest');
      await page.selectOption('#frontend', 'html-css-ts-react');
      await page.selectOption('#backend', 'node-ts');
      await page.waitForFunction(() => [...document.querySelectorAll('#files .f')].some((f) => f.title === 'frontend/src/App.tsx'));
      const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#save')]);
      check(dl.suggestedFilename() === 'open-vsc-claude-project.zip', name + ': zip name');

      await page.selectOption('#style', 'custom');
      check(await page.isVisible('#stack'), name + ': free-form textarea not visible');
      check(!(await page.isVisible('#frontend')), name + ': stack selects should be hidden in free-form mode');
      await page.click('#gen');
      await page.waitForFunction(() => document.getElementById('status').textContent.length > 0);

      await page.selectOption('#style', 'cosmo');
      check(await page.isVisible('#gwlabel'), name + ': gateway select missing in cosmo style');
      await page.selectOption('#gateway', 'rpoem');
      await page.waitForFunction(() => [...document.querySelectorAll('#files .f')].some((f) => f.title === 'gateway/rpoem.env'));
      const links = await page.$$eval('body > div:first-child a', (as) => as.map((a) => a.textContent));
      check(links.length === 3, name + ': intro links');
      check(errors.length === 0, name + ': console errors: ' + errors.join(' | '));
      console.log('ok:', name);
      await ctx.close();
    }
    console.log('e2e demo ok');
  } finally {
    await browser.close();
    server.close();
  }
})().catch((e) => {
  console.error('FAIL', e.message);
  process.exit(1);
});
