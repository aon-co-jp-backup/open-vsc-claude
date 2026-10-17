// Randomness and hashing that work on every host: Web Crypto where it is global (browser / Node >= 19, which
// includes current VS Code), otherwise Node's own crypto (older desktop hosts such as VS Code 1.85 / Node 18).
type WebCrypto = { getRandomValues<T extends ArrayBufferView>(a: T): T; subtle: { digest(alg: string, data: ArrayBufferView): Promise<ArrayBuffer> } };

function webCrypto(): WebCrypto | undefined {
  return (globalThis as unknown as { crypto?: WebCrypto }).crypto;
}

function nodeCrypto(): typeof import('crypto') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('crypto');
}

export function randomHex(bytes: number): string {
  const c = webCrypto();
  const a = new Uint8Array(bytes);
  if (c?.getRandomValues) c.getRandomValues(a);
  else a.set(nodeCrypto().randomBytes(bytes));
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function sha256Hex(data: Uint8Array): Promise<string> {
  const c = webCrypto();
  if (c?.subtle) {
    const buf = await c.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return nodeCrypto().createHash('sha256').update(data).digest('hex');
}
