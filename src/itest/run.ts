import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
  const root = path.resolve(__dirname, '../..');
  await runTests({
    vscodeExecutablePath: process.env.VSCODE_EXE,
    // e.g. VSCODE_VERSION=1.85.0 checks the minimum supported engine (downloads that VS Code build)
    version: process.env.VSCODE_EXE ? undefined : process.env.VSCODE_VERSION,
    extensionDevelopmentPath: root,
    extensionTestsPath: path.resolve(__dirname, 'suite'),
    launchArgs: ['--disable-extensions', '--user-data-dir', path.join(root, '.vscode-test-user')],
  });
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
