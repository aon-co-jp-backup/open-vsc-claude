import * as assert from 'assert';
import { OPTIONS, generate } from '../catalog';
import { parseFiles } from '../claude';

type Opt = { id: string; disabled?: boolean; styles?: readonly string[] };
const pick = (list: readonly Opt[], style: string) =>
  list.filter((o) => !o.disabled && (!o.styles || o.styles.includes(style)));

let n = 0;
for (const style of OPTIONS.style.filter((s) => s.id !== 'custom'))
  for (const frontend of pick(OPTIONS.frontend, style.id))
    for (const gateway of style.id === 'cosmo' ? pick(OPTIONS.gateway, 'cosmo') : [{ id: 'none' }])
      for (const database of OPTIONS.database)
        for (const backend of pick(OPTIONS.backend, style.id)) {
          const f = generate({ style: style.id, frontend: frontend.id, gateway: gateway.id, database: database.id, backend: backend.id } as never);
          assert.ok(f['README.md']);
          if (backend.id === 'python-fastapi') assert.ok(f['backend/main.py'] && f['backend/requirements.txt']);
          if (backend.id === 'rust-poem') assert.ok(f['backend/Cargo.toml'] && f['backend/src/main.rs']);
          if (backend.id === 'node-ts') assert.ok(f['backend/src/index.ts'] && f['backend/package.json']);
          if (style.id === 'cosmo') {
            if (backend.id !== 'none' && gateway.id === 'cosmo') assert.ok(JSON.parse(f['gateway/config.json']));
            assert.ok(!Object.keys(f).some((k) => k.endsWith('package.json')), 'no Node in Cosmo stacks');
            assert.ok(!Object.values(f).some((c) => c.includes('/api/items')), 'no REST in Cosmo stacks');
          }
          n++;
        }

// free-form mode and RPoem gateway
assert.ok(generate({ style: 'custom', stack: 'Go + Gin' } as never)['README.md']);
const rp = generate({ style: 'cosmo', frontend: 'html-css', gateway: 'rpoem', database: 'none', backend: 'python-fastapi' } as never);
assert.ok(rp['gateway/rpoem.env'] && !rp['gateway/config.json'] && rp['frontend/app.js'].includes('localhost:8080'));
assert.ok(rp['README.md'].includes('OPEN_RUNO_SUBGRAPHS'));

const p = parseFiles('=== FILE: a/b.txt ===\nhello\n=== FILE: ../evil ===\nx\n=== FILE: c.txt ===\nbye\n');
assert.deepStrictEqual(p, { 'a/b.txt': 'hello\n', 'c.txt': 'bye\n' });
console.log(`ok: ${n} combinations, parser`);

// The webview script must at least parse (it runs inside VS Code where it can't be unit-tested).
import { html } from '../webview';
const m = /<script nonce="n">([\s\S]*?)<\/script>/.exec(html('n', 'csp'));
assert.ok(m, 'webview script missing');
new Function('acquireVsCodeApi', 'document', 'window', m[1]);
console.log('ok: webview script parses');

import { NOTICES, pickLang, noticeHtml } from '../notices';
for (const l of Object.keys(NOTICES) as (keyof typeof NOTICES)[]) assert.strictEqual(NOTICES[l].items.length, NOTICES.en.items.length, 'notice count differs: ' + l);
assert.deepStrictEqual(['ja', 'ko', 'zh-cn', 'zh-tw', 'zh-hk', 'fr'].map(pickLang), ['ja', 'ko', 'zh-cn', 'zh-tw', 'zh-tw', 'en']);
assert.ok(noticeHtml('ja').includes('注意書き'));
console.log('ok: notices');

// Inline style attributes are blocked by the webview CSP (style-src without unsafe-inline).
assert.ok(!/ style="/.test(html('n', 'csp', 'en')), 'inline style attribute in webview html');
console.log('ok: csp-safe markup');

import { isNewer, pickAssets } from '../updateLogic';
assert.ok(isNewer('0.1.1', '0.1.0') && isNewer('v1.0.0', '0.9.9') && isNewer('0.2', '0.1.9'));
assert.ok(!isNewer('0.1.0', '0.1.0') && !isNewer('0.0.9', '0.1.0') && !isNewer('0.1.0-beta', '0.1.0'));
assert.deepStrictEqual(
  pickAssets({ assets: [{ name: 'x-0.1.1.vsix', browser_download_url: 'u1' }, { name: 'x-0.1.1.vsix.sha256', browser_download_url: 'u2' }] }),
  { vsix: 'u1', sha: 'u2' },
);
assert.deepStrictEqual(pickAssets({ assets: [] }), { vsix: undefined, sha: undefined });
console.log('ok: update logic');

import { PROTOCOL_VERSION, protocolCompatible } from '../protocol';
assert.ok(protocolCompatible(PROTOCOL_VERSION) && protocolCompatible(PROTOCOL_VERSION + 0.5) && !protocolCompatible(PROTOCOL_VERSION + 1));
assert.ok(html('n', 'csp', 'en').includes('PROTOCOL = ' + PROTOCOL_VERSION));
console.log('ok: protocol');
