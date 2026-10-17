import { OPTIONS } from './catalog';

function select(id: string, opts: readonly { id: string; label: string; disabled?: boolean; styles?: readonly string[] }[], def: string): string {
  return `<select id="${id}">${opts
    .map((o) => `<option data-styles="${(o.styles ?? []).join(',')}" value="${o.id}"${o.id === def ? ' selected' : ''}${o.disabled ? ' disabled' : ''}>${o.label}</option>`)
    .join('')}</select>`;
}

export function html(nonce: string, cspSource: string): string {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
<style nonce="${nonce}">
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 8px 12px; }
  .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: end; margin-bottom: 10px; }
  label { display: flex; flex-direction: column; font-size: 12px; gap: 3px; }
  select, textarea { background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border, #555); padding: 4px; }
  textarea { width: 100%; box-sizing: border-box; min-height: 56px; font-family: inherit; }
  button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: 0; padding: 6px 12px; cursor: pointer; }
  button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
  button:disabled { opacity: .5; cursor: default; }
  #main { display: flex; gap: 10px; min-height: 60vh; }
  #files { width: 230px; flex: none; overflow: auto; border-right: 1px solid var(--vscode-panel-border); }
  #files div { padding: 3px 6px; cursor: pointer; font-family: var(--vscode-editor-font-family); font-size: 12px; white-space: nowrap; }
  #files div.sel { background: var(--vscode-list-activeSelectionBackground); color: var(--vscode-list-activeSelectionForeground); }
  #files div.chg::after { content: ' *'; color: var(--vscode-charts-yellow); }
  pre { flex: 1; margin: 0; overflow: auto; padding: 8px; background: var(--vscode-textCodeBlock-background); font-family: var(--vscode-editor-font-family); font-size: var(--vscode-editor-font-size); }
  #status { margin: 6px 0; font-size: 12px; min-height: 16px; }
</style>
</head>
<body>
<div class="row">
  <label>方式 ${select('style', OPTIONS.style, 'cosmo')}</label>
  <label>Frontend ${select('frontend', OPTIONS.frontend, 'html-css')}</label>
  <label>Database ${select('database', OPTIONS.database, 'sqlite')}</label>
  <label>Gateway ${select('gateway', OPTIONS.gateway, 'cosmo')}</label>
  <label>Backend ${select('backend', OPTIONS.backend, 'python-fastapi')}</label>
  <button id="save">フォルダに保存</button>
  <button id="key" class="secondary">API キー設定</button>
</div>
<textarea id="req" placeholder="Claude への要望 (例: ユーザー認証を追加 / Item に price を追加)"></textarea>
<div class="row" style="margin-top:6px"><button id="gen">Claude で生成・改変</button><button id="reset" class="secondary">テンプレートに戻す</button></div>
<div id="status"></div>
<div id="main"><div id="files"></div><pre id="code"></pre></div>
<script nonce="${nonce}">
  const vscode = acquireVsCodeApi();
  const $ = (id) => document.getElementById(id);
  let files = {}, changed = new Set(), current = null;
  const sel = () => ({ style: $('style').value, frontend: $('frontend').value, database: $('database').value, gateway: $('gateway').value, backend: $('backend').value });

  function render() {
    const list = $('files');
    list.innerHTML = '';
    const names = Object.keys(files).sort();
    if (!names.includes(current)) current = names[0] || null;
    for (const n of names) {
      const d = document.createElement('div');
      d.textContent = n;
      if (n === current) d.classList.add('sel');
      if (changed.has(n)) d.classList.add('chg');
      d.onclick = () => { current = n; render(); };
      list.appendChild(d);
    }
    $('code').textContent = current ? files[current] : '';
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
        el.value = [...el.options].find((o) => !o.hidden && !o.disabled).value;
      }
    }
    $('gateway').parentElement.style.display = st === 'cosmo' ? '' : 'none';
  }
  function preview() { applyStyle(); changed = new Set(); vscode.postMessage({ type: 'preview', selection: sel() }); }
  for (const id of ['style', 'frontend', 'database', 'gateway', 'backend']) $(id).onchange = preview;
  $('reset').onclick = preview;
  $('save').onclick = () => vscode.postMessage({ type: 'save', files });
  $('key').onclick = () => vscode.postMessage({ type: 'setKey' });
  $('gen').onclick = () => {
    $('gen').disabled = true;
    $('status').textContent = 'Claude に問い合わせ中…';
    vscode.postMessage({ type: 'generate', selection: sel(), base: files, request: $('req').value });
  };
  window.addEventListener('message', (e) => {
    const m = e.data;
    if (m.type === 'files') { files = m.files; render(); }
    if (m.type === 'merge') {
      for (const [p, c] of Object.entries(m.files)) { files[p] = c; changed.add(p); }
      render();
    }
    if (m.type === 'status') { $('status').textContent = m.text; $('gen').disabled = false; }
  });
  preview();
</script>
</body>
</html>`;
}
