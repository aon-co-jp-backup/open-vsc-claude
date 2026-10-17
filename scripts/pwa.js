// Writes PWA files for the browser demo (installable on iPhone / iPad / Android home screens, works offline).
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const crcTable = (() => {
  const t = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t.push(c >>> 0);
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

// distance from point p to segment ab
function seg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Full-bleed blue square with a white ">_" glyph (safe for maskable icons). */
function icon(size) {
  const ss = 3;
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    for (let x = 0; x < size; x++) {
      let cov = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const u = (x + (sx + 0.5) / ss) / size;
          const v = (y + (sy + 0.5) / ss) / size;
          const chevron = Math.min(seg(u, v, 0.3, 0.32, 0.5, 0.5), seg(u, v, 0.5, 0.5, 0.3, 0.68)) < 0.045;
          const bar = u > 0.55 && u < 0.72 && v > 0.64 && v < 0.7;
          if (chevron || bar) cov++;
        }
      }
      const a = cov / (ss * ss);
      row[1 + x * 3] = Math.round(0x0e + (255 - 0x0e) * a);
      row[2 + x * 3] = Math.round(0x63 + (255 - 0x63) * a);
      row[3 + x * 3] = Math.round(0x9c + (255 - 0x9c) * a);
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

module.exports = function writePwa(dir, version) {
  for (const s of [180, 192, 512]) fs.writeFileSync(path.join(dir, `icon-${s}.png`), icon(s));
  fs.writeFileSync(
    path.join(dir, 'manifest.webmanifest'),
    JSON.stringify(
      {
        name: 'Open VSC Claude',
        short_name: 'OpenVSCClaude',
        description: 'Pick a stack, preview the generated code, download it as a zip.',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#1e1e1e',
        theme_color: '#0e639c',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      null,
      2,
    ) + '\n',
  );
  const files = ['./', 'index.html', 'app.js', 'theme.css', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
  fs.writeFileSync(
    path.join(dir, 'sw.js'),
    `const CACHE = 'open-vsc-claude-${version}';
const FILES = ${JSON.stringify(files)};
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // network first so a new release is picked up on the next visit; cache as the offline fallback
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
`,
  );
};
