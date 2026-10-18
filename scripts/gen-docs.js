// Generates README / CLAUDE / PORTING in 12 languages from scripts/docs-data*.js.
//   root: README.md (English), CLAUDE.md and PORTING.md (Japanese + English)
//   docs/i18n/<code>/{README,CLAUDE,PORTING}.md for the other languages
// Run: node scripts/gen-docs.js   (needs `npm run compile` first for the notices block)
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const data = Object.assign({}, require('./docs-data'), require('./docs-data-eu'), require('./docs-data-rtl'));
const { noticeMarkdown } = require('../out/notices.js');

const DEMO = 'https://easy-web.tokyo/open-vps-claude/';
const REPO = 'https://github.com/aon-co-jp/open-vsc-claude';
const ORDER = ['en', 'ja', 'zh-CN', 'zh-TW', 'ko', 'ru', 'uk', 'de', 'it', 'fr', 'ar', 'fa'];
const COMMANDS = [
  'npm install',
  'npm run compile          # tsc',
  'npm test                 # unit tests: every selectable combination, webview CSP, notices, updater logic',
  'npm run test:vscode      # real VS Code (set VSCODE_EXE to Code.exe / code)',
  'npm run test:web         # browser VS Code (web extension) through @vscode/test-web',
  'npm run test:leptos      # generated Rust + Leptos (trunk) frontend in real Chromium: direct and through the RPoem gateway (needs Rust, trunk, Python)',
  'npm run build:demo       # webpage/ : browser demo + PWA',
  'npm run package          # .vsix',
  'node scripts/gen-docs.js # regenerate these documents',
].join('\n');

const bullets = (a) => a.map((x) => '- ' + x).join('\n');
const numbered = (a) => a.map((x, i) => `${i + 1}. ${x}`).join('\n');
const wrap = (d, md) => (d.rtl ? `<div dir="rtl">\n\n${md}\n\n</div>\n` : md + '\n');

function nav(from) {
  // from: 'root' or a language code (files live in docs/i18n/<code>/)
  const link = (code) => {
    if (code === 'en') return from === 'root' ? 'README.md' : '../../../README.md';
    return from === 'root' ? `docs/i18n/${code}/README.md` : `../${code}/README.md`;
  };
  return ORDER.map((c) => `[${data[c].name}](${link(c)})`).join(' · ');
}

function readme(code) {
  const d = data[code];
  const from = code === 'en' ? 'root' : code;
  return wrap(
    d,
    `# Open VSC Claude\n\n${nav(from)}\n\n${d.tagline}\n\n- ${d.liveDemo}: ${DEMO}\n- ${d.source}: ${REPO}\n- ${d.license}\n\n` +
      `## ${d.featuresTitle}\n\n${bullets(d.f)}\n\n` +
      `## ${d.platformsTitle}\n\n${d.platformsIntro}\n\n| ${d.thPlatform} | ${d.thHow} |\n| --- | --- |\n` +
      `| Windows / macOS / Linux | ${d.rowDesktop} |\n| Android (phone, tablet) / iPhone / iPad | ${d.rowMobile} |\n| ${code === 'en' ? 'Any modern browser' : '*'} | ${d.rowAny}: ${DEMO} |\n\n` +
      `## ${d.usageTitle}\n\n${numbered(d.u)}\n\n` +
      `## ${d.noticesTitle}\n\n${bullets(d.n)}\n` +
      (code === 'en' ? `\n<!-- notices-in-5-languages -->\n${noticeMarkdown()}\n\n## Development\n\n\`\`\`\n${COMMANDS}\n\`\`\`\n\nSee [PUBLISHING.md](PUBLISHING.md) for Marketplace / Open VSX publication and [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md) for the host matrix (VS Code 1.85+, VSCodium, web, browser demo) and the host contract.\n` : ''),
  );
}

function claude(code) {
  const d = data[code];
  return wrap(
    d,
    `# CLAUDE.md — Open VSC Claude\n\n${d.claudePurpose}\n\n## ${d.layoutTitle}\n\n${bullets(d.l)}\n\n## ${d.rulesTitle}\n\n${numbered(d.r)}\n\n## ${d.commandsTitle}\n\n\`\`\`\n${COMMANDS}\n\`\`\`\n\n## ${d.statusTitle}\n\n${bullets(d.s)}\n`,
  );
}

function porting(code) {
  const d = data[code];
  return wrap(
    d,
    `# PORTING.md — Open VSC Claude\n\n${d.portingPurpose}\n\n## ${d.doneTitle}\n\n${bullets(d.d)}\n\n## ${d.todoTitle}\n\n${bullets(d.t)}\n\n## ${d.pitfallsTitle}\n\n${bullets(d.k)}\n\n## ${d.releaseTitle}\n\n${numbered(d.rel)}\n`,
  );
}

function write(p, s) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
}

// bilingual hand-off / resume message, shared by the root documents
const handoff = '\n---\n\n' + fs.readFileSync(path.join(root, 'docs', 'HANDOFF.md'), 'utf8').trim() + '\n';
write(path.join(root, 'README.md'), readme('en') + handoff);
// root CLAUDE.md / PORTING.md: Japanese first, then English (the project convention)
write(path.join(root, 'CLAUDE.md'), `${claude('ja')}\n---\n\n${claude('en')}${handoff}`);
write(path.join(root, 'PORTING.md'), `${porting('ja')}\n---\n\n${porting('en')}${handoff}`);
for (const code of ORDER) {
  if (code === 'en') continue;
  write(path.join(root, 'docs', 'i18n', code, 'README.md'), readme(code));
  if (code === 'ja') continue; // Japanese CLAUDE / PORTING live in the root files
  write(path.join(root, 'docs', 'i18n', code, 'CLAUDE.md'), claude(code));
  write(path.join(root, 'docs', 'i18n', code, 'PORTING.md'), porting(code));
}
console.log('docs generated for', ORDER.length, 'languages');
