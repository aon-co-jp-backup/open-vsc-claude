import { OPTIONS } from './catalog';
import { UI } from './i18n';
import { Lang, noticeHtml } from './notices';

type Opt = { id: string; label: string; disabled?: boolean; styles?: readonly string[] };

function select(id: string, opts: readonly Opt[], def: string): string {
  return `<select id="${id}">${opts
    .map(
      (o) =>
        `<option data-styles="${(o.styles ?? []).join(',')}" value="${o.id}"${o.id === def ? ' selected' : ''}${o.disabled ? ' disabled' : ''}>${o.label}</option>`,
    )
    .join('')}</select>`;
}

export function html(nonce: string, cspSource: string, lang: Lang = 'en'): string {
  const ui = UI[lang];
  // JSON for the inline script; "<" is escaped so the string can never close the script tag.
  const uiJson = JSON.stringify(ui).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
<style nonce="${nonce}">
  * { box-sizing: border-box; }
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); margin: 0; padding: 0 14px 14px; }
  #bar { position: sticky; top: 0; z-index: 2; background: var(--vscode-editor-background); padding: 10px 0 8px; border-bottom: 1px solid var(--vscode-panel-border); }
  .row { display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; margin-bottom: 8px; }
  label { display: flex; flex-direction: column; font-size: 11px; gap: 3px; min-width: 150px; flex: 1 1 150px; max-width: 280px; }
  select, textarea { background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border, #555); padding: 5px; font-size: 12px; }
  select:focus, textarea:focus, button:focus-visible { outline: 1px solid var(--vscode-focusBorder); }
  textarea { width: 100%; min-height: 54px; resize: vertical; font-family: inherit; }
  button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: 0; padding: 6px 12px; cursor: pointer; font-size: 12px; }
  button:hover { background: var(--vscode-button-hoverBackground); }
  button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
  button.secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }
  button:disabled { opacity: .5; cursor: default; }
  #keystate { font-size: 11px; padding: 2px 8px; border-radius: 10px; border: 1px solid var(--vscode-panel-border); }
  #keystate.ok { color: var(--vscode-charts-green); }
  #keystate.no { color: var(--vscode-charts-yellow); }
  .hidden { display: none; }
  #stack { margin-bottom: 6px; }
  .actions { margin: 6px 0 0; }
  .grow { flex: 1; }
  #hint { font-size: 11px; opacity: .75; margin: 6px 0; }
  #status { font-size: 12px; min-height: 18px; margin: 4px 0; }
  #status.busy::before { content: ''; display: inline-block; width: 10px; height: 10px; margin-right: 6px; border: 2px solid var(--vscode-foreground); border-right-color: transparent; border-radius: 50%; animation: spin .8s linear infinite; vertical-align: -1px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  #main { display: flex; gap: 10px; height: calc(100vh - 330px); min-height: 260px; }
  #files { width: 240px; flex: none; overflow: auto; border-right: 1px solid var(--vscode-panel-border); padding-right: 4px; }
  #files .dir { font-size: 11px; opacity: .7; padding: 6px 4px 2px; font-family: var(--vscode-editor-font-family); }
  #files .f { padding: 3px 6px 3px 14px; cursor: pointer; font-family: var(--vscode-editor-font-family); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  #files .f:hover { background: var(--vscode-list-hoverBackground); }
  #files .f.sel { background: var(--vscode-list-activeSelectionBackground); color: var(--vscode-list-activeSelectionForeground); }
  #files .f.chg::after { content: ' *'; color: var(--vscode-charts-yellow); }
  #view { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  #vbar { display: flex; gap: 8px; align-items: center; margin-bottom: 4px; }
  #vname { flex: 1; font-family: var(--vscode-editor-font-family); font-size: 12px; opacity: .85; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  #code { flex: 1; margin: 0; overflow: auto; padding: 8px 0; background: var(--vscode-textCodeBlock-background); font-family: var(--vscode-editor-font-family); font-size: var(--vscode-editor-font-size); tab-size: 2; }
  #code div { white-space: pre; padding-left: 4.5em; position: relative; min-height: 1.3em; }
  #code div::before { content: attr(data-n); position: absolute; left: 0; width: 3.6em; text-align: right; opacity: .45; user-select: none; }
  #notice { margin-top: 14px; font-size: 12px; opacity: .85; }
  @media (pointer: coarse) { button, select, textarea { font-size: 16px; min-height: 44px; } #files .f { padding: 10px 8px 10px 14px; } #copy, #edit { min-height: 44px; } }
  @media (max-width: 480px) { label { flex: 1 1 100%; max-width: none; } #bar .row > button { flex: 1 1 auto; } }
  @media (max-width: 700px) { #main { flex-direction: column; height: auto; } #files { width: auto; max-height: 160px; border-right: 0; } #code { max-height: 55vh; } }
</style>
</head>
<body>
<div id="bar">
  <div class="row">
    <label>${ui.style} ${select('style', OPTIONS.style, 'cosmo')}</label>
    <label class="stackopt">${ui.frontend} ${select('frontend', OPTIONS.frontend, 'html-css')}</label>
    <label class="stackopt">${ui.database} ${select('database', OPTIONS.database, 'sqlite')}</label>
    <label class="stackopt" id="gwlabel">${ui.gateway} ${select('gateway', OPTIONS.gateway, 'cosmo')}</label>
    <label class="stackopt">${ui.backend} ${select('backend', OPTIONS.backend, 'python-fastapi')}</label>
  </div>
  <textarea id="stack" class="hidden" placeholder="${ui.stackPh}"></textarea>
  <textarea id="req" placeholder="${ui.reqPh}"></textarea>
  <div class="row actions">
    <button id="gen">${ui.generate}</button>
    <button id="reset" class="secondary">${ui.reset}</button>
    <button id="save" class="secondary">${ui.save}</button>
    <span class="grow"></span>
    <span id="keystate" class="no">${ui.keyMissing}</span>
    <button id="key" class="secondary">${ui.setKey}</button>
    <button id="keyfile" class="secondary">${ui.loadKey}</button>
  </div>
</div>
<div id="hint">${ui.hint}</div>
<div id="status"></div>
<div id="main">
  <div id="files" aria-label="${ui.files}"></div>
  <div id="view">
    <div id="vbar"><span id="vname"></span><button id="copy" class="secondary">${ui.copy}</button><button id="edit" class="secondary">${ui.openEditor}</button></div>
    <div id="code" tabindex="0"></div>
  </div>
</div>
${noticeHtml(lang)}
<script nonce="${nonce}">
  const vscode = acquireVsCodeApi();
  const T = ${uiJson};
  const $ = (id) => document.getElementById(id);
  let files = {}, changed = new Set(), current = null;
  const sel = () => ({ stack: $('stack').value, style: $('style').value, frontend: $('frontend').value, database: $('database').value, gateway: $('gateway').value, backend: $('backend').value });

  function saveState() {
    vscode.setState({ sel: sel(), req: $('req').value, stack: $('stack').value });
  }
  function restoreState() {
    const st = vscode.getState();
    if (!st) return;
    for (const id of ['style', 'frontend', 'database', 'gateway', 'backend']) {
      const el = $(id), v = st.sel && st.sel[id];
      if (v && [...el.options].some((o) => o.value === v && !o.disabled)) el.value = v;
    }
    $('req').value = st.req || '';
    $('stack').value = st.stack || '';
  }

  function applyStyle() {
    const st = $('style').value;
    for (const id of ['frontend', 'gateway', 'backend']) {
      const el = $(id);
      for (const o of el.options) {
        const styles = o.dataset.styles;
        o.hidden = !!styles && !styles.split(',').includes(st);
      }
      if (el.selectedOptions[0] && el.selectedOptions[0].hidden) {
        const ok = [...el.options].filter((o) => !o.hidden && !o.disabled);
        const next = ok.find((o) => o.value !== 'none') || ok[0];
        if (next) el.value = next.value;
      }
    }
    const custom = st === 'custom';
    for (const l of document.querySelectorAll('.stackopt')) l.style.display = custom ? 'none' : '';
    $('gwlabel').style.display = st === 'cosmo' ? '' : 'none';
    $('stack').classList.toggle('hidden', !custom);
  }

  function render() {
    const list = $('files');
    list.innerHTML = '';
    const names = Object.keys(files).sort((a, b) => {
      const da = a.includes('/') ? 0 : 1, db = b.includes('/') ? 0 : 1;
      return da - db || a.localeCompare(b);
    });
    if (!names.includes(current)) current = names.includes('README.md') ? 'README.md' : names[0] || null;
    let lastDir = null;
    for (const n of names) {
      const i = n.lastIndexOf('/');
      const dir = i < 0 ? '' : n.slice(0, i), base = n.slice(i + 1);
      if (dir !== lastDir) {
        lastDir = dir;
        { const h = document.createElement('div'); h.className = 'dir'; h.textContent = dir ? dir + '/' : './'; list.appendChild(h); }
      }
      const d = document.createElement('div');
      d.className = 'f' + (n === current ? ' sel' : '') + (changed.has(n) ? ' chg' : '');
      d.textContent = base;
      d.title = n;
      d.onclick = () => { current = n; render(); };
      list.appendChild(d);
    }
    $('vname').textContent = current || '';
    const code = $('code');
    code.innerHTML = '';
    if (current) {
      const lines = files[current].split('\\n');
      if (lines[lines.length - 1] === '') lines.pop();
      const frag = document.createDocumentFragment();
      lines.forEach((t, k) => { const d = document.createElement('div'); d.dataset.n = String(k + 1); d.textContent = t; frag.appendChild(d); });
      code.appendChild(frag);
    }
  }

  function setStatus(text, busy) {
    const s = $('status');
    s.textContent = text || '';
    s.className = busy ? 'busy' : '';
  }
  function setKeyState(has) {
    const k = $('keystate');
    k.textContent = has ? T.keyOk : T.keyMissing;
    k.className = has ? 'ok' : 'no';
  }

  function preview() { applyStyle(); changed = new Set(); saveState(); vscode.postMessage({ type: 'preview', selection: sel() }); }
  for (const id of ['style', 'frontend', 'database', 'gateway', 'backend']) $(id).onchange = preview;
  $('stack').oninput = saveState;
  $('req').oninput = saveState;
  $('reset').onclick = preview;
  $('save').onclick = () => vscode.postMessage({ type: 'save', files });
  $('key').onclick = () => vscode.postMessage({ type: 'setKey' });
  $('keyfile').onclick = () => vscode.postMessage({ type: 'loadKey' });
  $('copy').onclick = async () => {
    if (!current) return;
    try { await navigator.clipboard.writeText(files[current]); } catch (e) { vscode.postMessage({ type: 'copy', text: files[current] }); }
    setStatus(T.copied, false);
  };
  $('edit').onclick = () => current && vscode.postMessage({ type: 'openFile', path: current, content: files[current] });
  function generate() {
    $('gen').disabled = true;
    setStatus(T.running, true);
    saveState();
    vscode.postMessage({ type: 'generate', selection: sel(), base: files, request: $('req').value });
  }
  $('gen').onclick = generate;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !$('gen').disabled) { e.preventDefault(); generate(); }
  });

  window.addEventListener('message', (e) => {
    const m = e.data;
    if (m.type === 'files') { files = m.files; render(); }
    if (m.type === 'merge') {
      for (const [p, c] of Object.entries(m.files)) { files[p] = c; changed.add(p); }
      current = Object.keys(m.files)[0] || current;
      render();
    }
    if (m.type === 'status') { setStatus(m.text, false); $('gen').disabled = false; }
    if (m.type === 'keyState') setKeyState(m.has);
  });
  restoreState();
  preview();
  vscode.postMessage({ type: 'init' });
</script>
</body>
</html>`;
}
