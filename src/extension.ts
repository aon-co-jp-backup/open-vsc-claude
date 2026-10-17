import * as vscode from 'vscode';
import { randomBytes } from 'crypto';
import { Files, Selection, generate } from './catalog';
import { generateWithClaude } from './claude';
import { pickLang } from './notices';
import { html } from './webview';

const KEY = 'openVscClaude.anthropicApiKey';

export function activate(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.commands.registerCommand('openVscClaude.open', () => openPanel(ctx)),
    vscode.commands.registerCommand('openVscClaude.setApiKey', () => setKey(ctx)),
    vscode.commands.registerCommand('openVscClaude.loadApiKeyFromFile', () => loadKeyFromFile(ctx)),
  );
}

async function setKey(ctx: vscode.ExtensionContext): Promise<boolean> {
  const v = await vscode.window.showInputBox({ prompt: 'Anthropic API key', password: true, ignoreFocusOut: true });
  if (!v) return false;
  await ctx.secrets.store(KEY, v.trim());
  return true;
}

/** Reads an API key from a local .txt file (first non-empty line) into SecretStorage; the key is never shown or logged. */
async function loadKeyFromFile(ctx: vscode.ExtensionContext): Promise<boolean> {
  const pick = await vscode.window.showOpenDialog({
    canSelectMany: false,
    openLabel: 'このファイルから読み込む',
    filters: { Text: ['txt'] },
  });
  if (!pick?.[0]) return false;
  const text = new TextDecoder().decode(await vscode.workspace.fs.readFile(pick[0]));
  const key = text.split(/\r?\n/).map((l) => l.trim()).find((l) => l.length > 0);
  if (!key || /\s/.test(key) || key.length < 20) {
    vscode.window.showErrorMessage('API キーを読み取れませんでした(1行目にキーだけを書いてください)。');
    return false;
  }
  await ctx.secrets.store(KEY, key);
  vscode.window.showInformationMessage('API キーを読み込みました(SecretStorage に保存、ファイルは変更していません)。');
  return true;
}

function safeRel(p: string): boolean {
  return !!p && !p.startsWith('/') && !/^[A-Za-z]:/.test(p) && !p.split(/[\\/]/).includes('..');
}

function openPanel(ctx: vscode.ExtensionContext): void {
  const panel = vscode.window.createWebviewPanel('openVscClaude', 'Open VSC Claude', vscode.ViewColumn.Active, {
    enableScripts: true,
  });
  panel.webview.html = html(randomBytes(16).toString('hex'), panel.webview.cspSource, pickLang(vscode.env.language));

  panel.webview.onDidReceiveMessage(async (m) => {
    try {
      if (m.type === 'preview') {
        panel.webview.postMessage({ type: 'files', files: generate(m.selection as Selection) });
      } else if (m.type === 'setKey') {
        await setKey(ctx);
      } else if (m.type === 'loadKey') {
        await loadKeyFromFile(ctx);
      } else if (m.type === 'save') {
        await save(m.files as Files);
      } else if (m.type === 'generate') {
        let apiKey = await ctx.secrets.get(KEY);
        if (!apiKey && (await setKey(ctx))) apiKey = await ctx.secrets.get(KEY);
        if (!apiKey) return panel.webview.postMessage({ type: 'status', text: 'API キーが未設定です。' });
        const cfg = vscode.workspace.getConfiguration('openVscClaude');
        const changed = await generateWithClaude({
          apiKey,
          model: cfg.get<string>('model', 'claude-sonnet-5-5'),
          maxTokens: cfg.get<number>('maxTokens', 8000),
          selection: m.selection,
          base: m.base,
          request: String(m.request ?? ''),
        });
        panel.webview.postMessage({ type: 'merge', files: changed });
        panel.webview.postMessage({ type: 'status', text: `${Object.keys(changed).length} 個のファイルを更新しました (* 付き)。` });
      }
    } catch (e) {
      panel.webview.postMessage({ type: 'status', text: 'エラー: ' + (e instanceof Error ? e.message : String(e)) });
    }
  });
}

async function save(files: Files): Promise<void> {
  const dir = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    openLabel: 'ここに保存',
  });
  if (!dir?.[0]) return;
  const enc = new TextEncoder();
  let n = 0;
  for (const [p, c] of Object.entries(files)) {
    if (!safeRel(p)) continue;
    await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(dir[0], ...p.split('/')), enc.encode(c));
    n++;
  }
  const open = await vscode.window.showInformationMessage(`${n} ファイルを保存しました。`, 'フォルダを開く');
  if (open) await vscode.commands.executeCommand('vscode.openFolder', dir[0], { forceNewWindow: true });
}

export function deactivate(): void {}
