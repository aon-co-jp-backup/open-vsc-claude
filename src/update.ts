// Update check against GitHub Releases. Marketplace / Open VSX installs are updated by VS Code itself;
// this covers sideloaded .vsix installs and offers a one-click install on desktop.
import * as vscode from 'vscode';
import { Ui } from './i18n';
import { sha256Hex } from './rand';
import { Release, isNewer, pickAssets } from './updateLogic';

const REPO = 'aon-co-jp/open-vsc-claude';
const DAY = 24 * 60 * 60 * 1000;

async function installFrom(ctx: vscode.ExtensionContext, vsixUrl: string, shaUrl: string | undefined, ui: Ui): Promise<void> {
  if (!shaUrl) throw new Error(ui.updNoChecksum);
  const [res, shaRes] = await Promise.all([fetch(vsixUrl), fetch(shaUrl)]);
  if (!res.ok || !shaRes.ok) throw new Error(`download failed (${res.status}/${shaRes.status})`);
  const data = new Uint8Array(await res.arrayBuffer());
  const expected = (await shaRes.text()).trim().split(/\s+/)[0].toLowerCase();
  if ((await sha256Hex(data)) !== expected) throw new Error(ui.updBadChecksum);
  await vscode.workspace.fs.createDirectory(ctx.globalStorageUri);
  const file = vscode.Uri.joinPath(ctx.globalStorageUri, 'update.vsix');
  await vscode.workspace.fs.writeFile(file, data);
  await vscode.commands.executeCommand('workbench.extensions.installExtension', file);
}

/** `manual` = user ran the command (always answer); otherwise honours the setting and a 24 h throttle. */
export async function checkForUpdates(ctx: vscode.ExtensionContext, ui: Ui, manual: boolean): Promise<void> {
  const mode = vscode.workspace.getConfiguration('openVscClaude').get<string>('autoUpdate', 'notify');
  if (!manual) {
    if (mode === 'off') return;
    const last = ctx.globalState.get<number>('lastUpdateCheck', 0);
    if (Date.now() - last < DAY) return;
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    await ctx.globalState.update('lastUpdateCheck', Date.now()); // only a successful check starts the 24 h throttle
    const rel = (await res.json()) as Release;
    const current = String(ctx.extension.packageJSON.version);
    const latest = (rel.tag_name ?? '').replace(/^v/i, '');
    if (!latest || !isNewer(latest, current)) {
      if (manual) vscode.window.showInformationMessage(ui.updNone.replace('{v}', current));
      return;
    }
    const { vsix, sha } = pickAssets(rel);
    const canInstall = !!vsix && vscode.env.uiKind === vscode.UIKind.Desktop;
    const msg = ui.updAvail.replace('{v}', latest).replace('{c}', current);
    const buttons = canInstall ? [ui.updInstall, ui.updNotes, ui.updLater] : [ui.updNotes, ui.updLater];
    const pick = mode === 'install' && canInstall && !manual ? ui.updInstall : await vscode.window.showInformationMessage(msg, ...buttons);
    if (pick === ui.updInstall && vsix) {
      await installFrom(ctx, vsix, sha, ui);
      const r = await vscode.window.showInformationMessage(ui.updDone, ui.updReload);
      if (r === ui.updReload) await vscode.commands.executeCommand('workbench.action.reloadWindow');
    } else if (pick === ui.updNotes && rel.html_url) {
      await vscode.env.openExternal(vscode.Uri.parse(rel.html_url));
    }
  } catch (e) {
    if (manual) vscode.window.showWarningMessage(ui.updFail.replace('{e}', e instanceof Error ? e.message : String(e)));
  }
}
