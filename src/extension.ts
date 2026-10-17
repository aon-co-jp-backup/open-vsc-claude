import * as vscode from 'vscode';
import { Files, Selection, generate } from './catalog';
import { generateWithClaude } from './claude';
import { Ui, UI } from './i18n';
import { pickLang } from './notices';
import { PROTOCOL_VERSION } from './protocol';
import { randomHex } from './rand';
import { checkForUpdates } from './update';
import { html } from './webview';

const KEY = 'openVscClaude.anthropicApiKey';
const KEY_FALLBACK = 'openVscClaude.anthropicApiKey.fallback';

/** Some VS Code forks / Linux setups have no working keyring; fall back to extension storage and say so. */
async function storeKey(ctx: vscode.ExtensionContext, value: string): Promise<void> {
  try {
    await ctx.secrets.store(KEY, value);
    await ctx.globalState.update(KEY_FALLBACK, undefined);
  } catch {
    await ctx.globalState.update(KEY_FALLBACK, value);
    vscode.window.showWarningMessage(ui().keyFallback);
  }
}

async function readKey(ctx: vscode.ExtensionContext): Promise<string | undefined> {
  try {
    const v = await ctx.secrets.get(KEY);
    if (v) return v;
  } catch {
    /* fall through to the fallback storage */
  }
  return ctx.globalState.get<string>(KEY_FALLBACK);
}

function hostName(): string {
  return `${vscode.env.appName} (${vscode.env.uiKind === vscode.UIKind.Web ? 'web' : 'desktop'})`;
}

function ui(): Ui {
  return UI[pickLang(vscode.env.language)];
}

export function activate(ctx: vscode.ExtensionContext) {
  ctx.subscriptions.push(
    vscode.commands.registerCommand('openVscClaude.open', () => openPanel(ctx)),
    vscode.commands.registerCommand('openVscClaude.setApiKey', () => setKey(ctx)),
    vscode.commands.registerCommand('openVscClaude.loadApiKeyFromFile', () => loadKeyFromFile(ctx)),
    vscode.commands.registerCommand('openVscClaude.checkForUpdates', () => checkForUpdates(ctx, ui(), true)),
  );
  // background check shortly after start (respects openVscClaude.autoUpdate and a 24 h throttle)
  setTimeout(() => void checkForUpdates(ctx, ui(), false), 15000);
  // small API used by the integration tests
  return { storage: ctx.globalStorageUri.fsPath, resetThrottle: () => ctx.globalState.update('lastUpdateCheck', 0), checkForUpdates: (manual: boolean) => checkForUpdates(ctx, ui(), manual) };
}

async function setKey(ctx: vscode.ExtensionContext): Promise<boolean> {
  const v = await vscode.window.showInputBox({ prompt: 'Anthropic API key', password: true, ignoreFocusOut: true });
  if (!v) return false;
  await storeKey(ctx, v.trim());
  return true;
}

/** Reads an API key from a local .txt file (first non-empty line) into SecretStorage; the key is never shown or logged. */
async function loadKeyFromFile(ctx: vscode.ExtensionContext): Promise<boolean> {
  const pick = await vscode.window.showOpenDialog({
    canSelectMany: false,
    openLabel: ui().loadKey,
    filters: { Text: ['txt'] },
  });
  if (!pick?.[0]) return false;
  const text = new TextDecoder().decode(await vscode.workspace.fs.readFile(pick[0]));
  const key = text.split(/\r?\n/).map((l) => l.trim()).find((l) => l.length > 0);
  if (!key || /\s/.test(key) || key.length < 20) {
    vscode.window.showErrorMessage(ui().keyBad);
    return false;
  }
  await storeKey(ctx, key);
  vscode.window.showInformationMessage(ui().keyLoaded);
  return true;
}

function safeRel(p: string): boolean {
  return !!p && !p.startsWith('/') && !/^[A-Za-z]:/.test(p) && !p.split(/[\\/]/).includes('..');
}

const LANG_BY_EXT: Record<string, string> = {
  py: 'python', rs: 'rust', ts: 'typescript', tsx: 'typescriptreact', js: 'javascript', json: 'json', md: 'markdown',
  html: 'html', css: 'css', yml: 'yaml', yaml: 'yaml', toml: 'toml', env: 'properties', graphqls: 'graphql', txt: 'plaintext',
};

function openPanel(ctx: vscode.ExtensionContext): void {
  const panel = vscode.window.createWebviewPanel('openVscClaude', 'Open VSC Claude', vscode.ViewColumn.Active, {
    enableScripts: true,
    retainContextWhenHidden: true,
  });
  panel.webview.html = html(randomHex(16), panel.webview.cspSource, pickLang(vscode.env.language));
  const post = (m: unknown) => panel.webview.postMessage(m);
  const keyState = async () => post({ type: 'keyState', has: !!(await readKey(ctx)) });

  panel.webview.onDidReceiveMessage(async (m) => {
    try {
      if (m.type === 'init') {
        post({ type: 'hello', protocol: PROTOCOL_VERSION, host: hostName() });
        await keyState();
      } else if (m.type === 'preview') {
        post({ type: 'files', files: generate(m.selection as Selection) });
      } else if (m.type === 'setKey') {
        await setKey(ctx);
        await keyState();
      } else if (m.type === 'loadKey') {
        await loadKeyFromFile(ctx);
        await keyState();
      } else if (m.type === 'copy') {
        await vscode.env.clipboard.writeText(String(m.text ?? ''));
      } else if (m.type === 'openFile') {
        const ext = String(m.path ?? '').split('.').pop() ?? '';
        const doc = await vscode.workspace.openTextDocument({ content: String(m.content ?? ''), language: LANG_BY_EXT[ext] ?? 'plaintext' });
        await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.Beside, preview: true });
      } else if (m.type === 'save') {
        await save(m.files as Files);
      } else if (m.type === 'generate') {
        let apiKey = await readKey(ctx);
        if (!apiKey && (await setKey(ctx))) apiKey = await readKey(ctx);
        await keyState();
        if (!apiKey) return post({ type: 'status', text: ui().noKey });
        const cfg = vscode.workspace.getConfiguration('openVscClaude');
        const changed = await generateWithClaude({
          apiKey,
          model: cfg.get<string>('model', 'claude-sonnet-5-5'),
          maxTokens: cfg.get<number>('maxTokens', 8000),
          selection: m.selection,
          base: m.base,
          request: String(m.request ?? ''),
        });
        post({ type: 'merge', files: changed });
        post({ type: 'status', text: `${Object.keys(changed).length}${ui().updated}` });
      }
    } catch (e) {
      post({ type: 'status', text: 'Error: ' + (e instanceof Error ? e.message : String(e)) });
    }
  });
}

async function exists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch {
    return false;
  }
}

async function save(files: Files): Promise<void> {
  const dir = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    openLabel: ui().save,
  });
  if (!dir?.[0]) return;
  const targets = Object.entries(files)
    .filter(([p]) => safeRel(p))
    .map(([p, c]) => ({ uri: vscode.Uri.joinPath(dir[0], ...p.split('/')), c }));
  let clash = 0;
  for (const t of targets) if (await exists(t.uri)) clash++;
  if (clash > 0) {
    const ok = await vscode.window.showWarningMessage(`${clash}${ui().overwrite}`, { modal: true }, ui().overwriteBtn);
    if (!ok) return;
  }
  const enc = new TextEncoder();
  for (const t of targets) await vscode.workspace.fs.writeFile(t.uri, enc.encode(t.c));
  const open = await vscode.window.showInformationMessage(`${targets.length} — ${ui().saved}`, ui().openFolder);
  if (open) await vscode.commands.executeCommand('vscode.openFolder', dir[0], { forceNewWindow: true });
}

export function deactivate(): void {}
