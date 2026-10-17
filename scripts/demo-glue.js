// Browser demo glue: runs the real webview HTML in a plain web page with an in-page "extension host".
// Templates are generated locally (no network, no API key); Claude generation is explained as extension-only.
(function () {
  const { generate } = __require('./catalog');
  const { html } = __require('./webview');
  const { pickLang } = __require('./notices');
  const { UI } = __require('./i18n');
  const { PROTOCOL_VERSION } = __require('./protocol');

  const q = new URLSearchParams(location.search).get('lang');
  const lang = pickLang(q || navigator.language || 'en');
  const ui = UI[lang];

  let state;
  try { state = JSON.parse(localStorage.getItem('open-vsc-claude-demo')); } catch (e) { state = undefined; }
  const reply = (m) => setTimeout(() => window.postMessage(m, '*'), 0);

  // ---- minimal stored-zip writer (no dependencies)
  const table = (() => {
    const t = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t.push(c >>> 0);
    }
    return t;
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
  }
})();
  const crc32 = (b) => {
    let c = 0xffffffff;
    for (let i = 0; i < b.length; i++) c = table[(c ^ b[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const u16 = (v) => [v & 255, (v >> 8) & 255];
  const u32 = (v) => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];
  function zip(files) {
    const enc = new TextEncoder();
    const parts = [];
    const central = [];
    let offset = 0;
    for (const [name, content] of Object.entries(files)) {
      const nb = enc.encode(name);
      const data = enc.encode(content);
      const crc = crc32(data);
      const local = new Uint8Array([...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nb.length), ...u16(0)]);
      parts.push(local, nb, data);
      central.push(new Uint8Array([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nb.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset)]), nb);
      offset += local.length + nb.length + data.length;
    }
    const cdSize = central.reduce((n, p) => n + p.length, 0);
    const count = Object.keys(files).length;
    const end = new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(count), ...u16(count), ...u32(cdSize), ...u32(offset), ...u16(0)]);
    return new Blob([...parts, ...central, end], { type: 'application/zip' });
  }
  function download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  window.acquireVsCodeApi = () => ({
    getState: () => state,
    setState: (s) => {
      state = s;
      try { localStorage.setItem('open-vsc-claude-demo', JSON.stringify(s)); } catch (e) { /* private mode */ }
    },
    postMessage: (m) => {
      if (m.type === 'preview') reply({ type: 'files', files: generate(m.selection) });
      else if (m.type === 'init') { reply({ type: 'hello', protocol: PROTOCOL_VERSION, host: 'browser-demo' }); reply({ type: 'keyState', has: false }); }
      else if (m.type === 'generate') reply({ type: 'status', text: ui.demoGen });
      else if (m.type === 'setKey' || m.type === 'loadKey') reply({ type: 'status', text: ui.demoKey });
      else if (m.type === 'save') { download(zip(m.files), 'open-vsc-claude-project.zip'); reply({ type: 'status', text: ui.demoSaved }); }
      else if (m.type === 'openFile') window.open(URL.createObjectURL(new Blob([m.content], { type: 'text/plain;charset=utf-8' })), '_blank');
      else if (m.type === 'copy') { try { navigator.clipboard.writeText(m.text); } catch (e) { /* ignore */ } }
    },
  });

  document.open();
  // The webview markup carries a CSP <meta>; written into a plain page it is ignored (and logs an error), so drop it here.
  const page = html('demo', location.origin, lang)
    .replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, '')
    .replace('</head>', '<meta name="theme-color" content="#0e639c"><link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-180.png"><link rel="stylesheet" href="theme.css"></head>');
  document.open();
  document.write(page);
  document.close();
  const bar = document.createElement('div');
  bar.style.cssText = 'padding:8px 14px;font:12px system-ui,sans-serif;background:#0e639c;color:#fff;line-height:1.7;';
  bar.appendChild(document.createTextNode(ui.demoBanner + '  '));
  for (const [label, href] of [
    ['GitHub →', 'https://github.com/aon-co-jp/open-vsc-claude'],
    ['.vsix →', 'https://github.com/aon-co-jp/open-vsc-claude/releases/latest'],
    ['Docs (12 languages) →', 'https://github.com/aon-co-jp/open-vsc-claude/tree/main/docs/i18n'],
  ]) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.style.cssText = 'color:#fff;font-weight:600;margin-right:12px;white-space:nowrap;';
    bar.appendChild(a);
  }
  document.body.insertBefore(bar, document.body.firstChild);
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
  }
})();
