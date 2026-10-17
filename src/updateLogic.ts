// Pure helpers for the updater (no vscode dependency).
export interface Release {
  tag_name?: string;
  html_url?: string;
  assets?: { name: string; browser_download_url: string }[];
}

/** true when `latest` is a higher semver than `current` (leading "v" and pre-release suffix ignored). */
export function isNewer(latest: string, current: string): boolean {
  const parse = (v: string) => v.replace(/^v/i, '').split('-')[0].split('.').map((n) => parseInt(n, 10) || 0);
  const a = parse(latest);
  const b = parse(current);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const d = (a[i] ?? 0) - (b[i] ?? 0);
    if (d !== 0) return d > 0;
  }
  return false;
}

export function pickAssets(r: Release): { vsix?: string; sha?: string } {
  const vsix = r.assets?.find((a) => a.name.endsWith('.vsix'));
  const sha = vsix && r.assets?.find((a) => a.name === vsix.name + '.sha256');
  return { vsix: vsix?.browser_download_url, sha: sha?.browser_download_url };
}
