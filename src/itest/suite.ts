import * as assert from 'assert';
import * as vscode from 'vscode';

export async function run(): Promise<void> {
  const ext = vscode.extensions.getExtension('aon-co-jp.open-vsc-claude');
  assert.ok(ext, 'extension not found');
  await ext.activate();
  const cmds = await vscode.commands.getCommands(true);
  assert.ok(cmds.includes('openVscClaude.open'), 'open command missing');
  assert.ok(cmds.includes('openVscClaude.setApiKey'), 'setApiKey command missing');

  await vscode.commands.executeCommand('openVscClaude.open');
  await new Promise((r) => setTimeout(r, 1500));
  const tabs = vscode.window.tabGroups.all.flatMap((g) => g.tabs);
  const tab = tabs.find((t) => t.input instanceof vscode.TabInputWebview);
  assert.ok(tab, 'webview tab not opened');
  assert.ok(tab.label.includes('Open VSC Claude'), 'unexpected tab label: ' + tab.label);
  assert.strictEqual(vscode.workspace.getConfiguration('openVscClaude').get('model'), 'claude-sonnet-5-5');
  console.log('integration ok: activated, commands registered, webview opened');
}
