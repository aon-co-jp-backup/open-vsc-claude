import * as assert from 'assert';
import * as vscode from 'vscode';

export async function run(): Promise<void> {
  const ext = vscode.extensions.getExtension('aon-co-jp.open-vsc-claude');
  assert.ok(ext, 'extension not found');
  await ext.activate();
  const cmds = await vscode.commands.getCommands(true);
  assert.ok(cmds.includes('openVscClaude.open'), 'open command missing');
  assert.ok(cmds.includes('openVscClaude.setApiKey'), 'setApiKey command missing');
  assert.ok(cmds.includes('openVscClaude.loadApiKeyFromFile'), 'loadApiKeyFromFile command missing');

  await vscode.commands.executeCommand('openVscClaude.open');
  // cold starts are slow: poll for the webview tab instead of a fixed sleep
  const findTab = () => vscode.window.tabGroups.all.flatMap((g) => g.tabs).find((t) => t.input instanceof vscode.TabInputWebview);
  for (let i = 0; i < 60 && !findTab(); i++) await new Promise((r) => setTimeout(r, 250));
  const tab = findTab();
  assert.ok(tab, 'webview tab not opened');
  assert.ok(tab.label.includes('Open VSC Claude'), 'unexpected tab label: ' + tab.label);
  assert.strictEqual(vscode.workspace.getConfiguration('openVscClaude').get('model'), 'claude-sonnet-5-5');
  console.log('integration ok: activated, commands registered, webview opened');

  // ---- updater: fake GitHub release (newer version) served through a stubbed fetch
  const crypto = await import('crypto');
  const fs = await import('fs');
  const path = await import('path');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = (JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8')) as { version: string }).version;
  const vsixPath = path.resolve(__dirname, `../../open-vsc-claude-${version}.vsix`);
  const vsix = fs.readFileSync(vsixPath);
  const good = crypto.createHash('sha256').update(vsix).digest('hex');
  const realFetch = globalThis.fetch;
  let lastStorage = '';
  const run = async (sha: string) => {
    globalThis.fetch = (async (url: string) => {
      const u = String(url);
      if (u.includes('api.github.com')) {
        return new Response(JSON.stringify({ tag_name: 'v9.9.9', html_url: 'https://example.invalid/r', assets: [
          { name: 'x.vsix', browser_download_url: 'https://dl.invalid/x.vsix' },
          { name: 'x.vsix.sha256', browser_download_url: 'https://dl.invalid/x.vsix.sha256' },
        ] }), { status: 200 });
      }
      if (u.endsWith('.sha256')) return new Response(sha + '  x.vsix\n', { status: 200 });
      return new Response(vsix, { status: 200 });
    }) as typeof fetch;
    await vscode.workspace.getConfiguration('openVscClaude').update('autoUpdate', 'install', vscode.ConfigurationTarget.Global);
    const api = (await ext.activate()) as { storage: string; resetThrottle(): Thenable<void>; checkForUpdates(manual: boolean): Promise<void> } | undefined;
    lastStorage = api!.storage;
    await api!.resetThrottle();
    // the success path ends in a non-modal "reload" prompt that never resolves in tests, so race it
    await Promise.race([api!.checkForUpdates(false), new Promise((r) => setTimeout(r, 6000))]);
    globalThis.fetch = realFetch;
  };
  await run('0'.repeat(64)); // wrong checksum: must NOT be written/installed
  assert.ok(!fs.existsSync(path.join(lastStorage, 'update.vsix')), 'bad checksum must not leave a vsix');
  await run(good); // right checksum: downloaded + handed to the installer
  assert.ok(fs.existsSync(path.join(lastStorage, 'update.vsix')), 'verified vsix was not written');
  assert.ok(fs.readFileSync(path.join(lastStorage, 'update.vsix')).equals(vsix), 'vsix content differs');
  console.log('updater ok: bad checksum rejected, verified release downloaded');
  await vscode.workspace.getConfiguration('openVscClaude').update('autoUpdate', undefined, vscode.ConfigurationTarget.Global);
}
