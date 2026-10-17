import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
  const root = path.resolve(__dirname, '../..');
  await runTests({
    vscodeExecutablePath: process.env.VSCODE_EXE,
    extensionDevelopmentPath: root,
    extensionTestsPath: path.resolve(__dirname, 'suite'),
    launchArgs: ['--disable-extensions', '--user-data-dir', path.join(root, '.vscode-test-user')],
  });
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
