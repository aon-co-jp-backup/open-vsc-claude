// Builds webpage/ (static, dependency-free browser demo) from the compiled extension modules in out/.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const writePwa = require('./pwa');
const version = require('../package.json').version;
const mods = ['catalog', 'restTemplates', 'cosmoConfig', 'notices', 'i18n', 'webview'];

let out =
  '(function(){\nconst __defs={};const __cache={};\n' +
  'function __require(n){n=n.replace(/^\\.\\//,"");if(__cache[n])return __cache[n].exports;const m={exports:{}};__cache[n]=m;__defs[n](m,m.exports,__require);return m.exports;}\n';
for (const m of mods) {
  const src = fs.readFileSync(path.join(root, 'out', m + '.js'), 'utf8').replace(/\/\/# sourceMappingURL=.*$/m, '');
  out += '__defs[' + JSON.stringify(m) + ']=function(module,exports,require){\n' + src + '\n};\n';
}
out += fs.readFileSync(path.join(__dirname, 'demo-glue.js'), 'utf8') + '\n})();\n';

const vars = [
  '--vscode-font-family:Segoe UI,system-ui,sans-serif', '--vscode-foreground:#ccc', '--vscode-editor-background:#1e1e1e',
  '--vscode-panel-border:#444', '--vscode-input-background:#3c3c3c', '--vscode-input-foreground:#ccc',
  '--vscode-button-background:#0e639c', '--vscode-button-foreground:#fff', '--vscode-button-hoverBackground:#1177bb',
  '--vscode-button-secondaryBackground:#3a3d41', '--vscode-button-secondaryForeground:#fff', '--vscode-button-secondaryHoverBackground:#45494e',
  '--vscode-focusBorder:#007fd4', '--vscode-list-hoverBackground:#2a2d2e', '--vscode-list-activeSelectionBackground:#094771',
  '--vscode-list-activeSelectionForeground:#fff', '--vscode-charts-green:#89d185', '--vscode-charts-yellow:#cca700',
  '--vscode-textCodeBlock-background:#2b2b2b', '--vscode-editor-font-family:Consolas,monospace', '--vscode-editor-font-size:13px',
].join(';');

fs.mkdirSync(path.join(root, 'webpage'), { recursive: true });
fs.writeFileSync(path.join(root, 'webpage', 'app.js'), out);
fs.writeFileSync(
  path.join(root, 'webpage', 'index.html'),
  '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>Open VSC Claude — demo</title>\n<link rel="stylesheet" href="theme.css">\n</head>\n' +
    '<body><noscript>JavaScript is required for this demo.</noscript><script src="app.js"></script></body>\n</html>\n',
);
fs.writeFileSync(path.join(root, 'webpage', 'theme.css'), ':root{' + vars + '}\nbody{margin:0;background:#1e1e1e;color:#ccc}\n');
writePwa(path.join(root, 'webpage'), version);
console.log('demo built: webpage/ (app.js ' + Math.round(out.length / 1024) + ' KB)');
