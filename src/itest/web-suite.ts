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
  await new Promise((r) => setTimeout(r, 1500));
  const tab = vscode.window.tabGroups.all.flatMap((g) => g.tabs).find((t) => t.input instanceof vscode.TabInputWebview);
  ok(tab, 'webview tab not opened');
  console.log('web integration ok: activated in the browser extension host, webview opened');
}
