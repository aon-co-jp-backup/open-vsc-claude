// Builds out/web/extension.js: a single-file bundle for the browser (web worker) extension host
// (vscode.dev, github.dev, iPad / iPhone / Android browsers). No bundler dependency.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mods = ['catalog', 'restTemplates', 'cosmoConfig', 'notices', 'i18n', 'webview', 'claude', 'updateLogic', 'update', 'extension'];

let out =
  '"use strict";\n(function(){\nconst __defs={};const __cache={};\n' +
  'function __require(n){\n' +
  '  if(n==="vscode") return require("vscode");\n' +
  '  n=n.replace(/^\\.\\//,"");\n' +
  '  if(__cache[n]) return __cache[n].exports;\n' +
  '  const m={exports:{}};__cache[n]=m;__defs[n](m,m.exports,__require);return m.exports;\n}\n';
for (const m of mods) {
  const src = fs.readFileSync(path.join(root, 'out', m + '.js'), 'utf8').replace(/\/\/# sourceMappingURL=.*$/m, '');
  out += '__defs[' + JSON.stringify(m) + ']=function(module,exports,require){\n' + src + '\n};\n';
}
out += 'const __ext=__require("extension");\nexports.activate=__ext.activate;\nexports.deactivate=__ext.deactivate;\n})();\n';

// test suite bundle (single module exporting run), used by `npm run test:web`
const suiteSrc = fs.readFileSync(path.join(root, 'out', 'itest', 'web-suite.js'), 'utf8').replace(/\/\/# sourceMappingURL=.*$/m, '');
fs.mkdirSync(path.join(root, 'out', 'web'), { recursive: true });
fs.writeFileSync(path.join(root, 'out', 'web', 'suite.js'), '"use strict";\n(function(){\n' + suiteSrc + '\n})();\n');
fs.writeFileSync(path.join(root, 'out', 'web', 'extension.js'), out);
console.log('web extension bundle: out/web/extension.js (' + Math.round(out.length / 1024) + ' KB)');
