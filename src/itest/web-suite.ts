// Runs inside the browser (web worker) extension host via @vscode/test-web; no Node modules.
import * as vscode from 'vscode';

function ok(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

export async function run(): Promise<void> {
  const ext = vscode.extensions.getExtension('aon-co-jp.open-vsc-claude');
  ok(ext, 'extension not found');
  await ext.activate();
  const cmds = await vscode.commands.getCommands(true);
  ok(cmds.includes('openVscClaude.open'), 'open command missing');
  await vscode.commands.executeCommand('openVscClaude.open');
  const findTab = () => vscode.window.tabGroups.all.flatMap((g) => g.tabs).find((t) => t.input instanceof vscode.TabInputWebview);
  for (let i = 0; i < 60 && !findTab(); i++) await new Promise((r) => setTimeout(r, 250));
  const tab = findTab();
  ok(tab, 'webview tab not opened');
  console.log('web integration ok: activated in the browser extension host, webview opened');
}
