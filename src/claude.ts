import { Files, Selection } from './catalog';

const SYSTEM = `You are a code generator embedded in a VS Code extension.
You receive a base project (files) for a chosen stack and a change request.
Return ONLY the files that are new or changed, each as:

=== FILE: relative/path ===
<full file content>

Architecture rules: GraphQL only (never add REST endpoints); backends are subgraphs behind a WunderGraph Cosmo Router; do not introduce Node.js tooling. If the GraphQL schema changes, also update gateway/schema.graphqls and tell the user (in a README.md section) to re-run \`wgc router compose -i gateway/graph.yaml -o gateway/config.json\`.
Rules: no markdown fences, no commentary, keep the chosen stack, keep paths relative to the project root, always output complete files.`;

export function parseFiles(text: string): Files {
  const out: Files = {};
  const re = /^=== FILE: (.+?) ===\r?\n([\s\S]*?)(?=^=== FILE: |(?![\s\S]))/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const p = m[1].trim().replace(/\\/g, '/');
    if (!p || p.startsWith('/') || p.split('/').includes('..') || /^[A-Za-z]:/.test(p)) continue;
    out[p] = m[2].replace(/\s+$/, '') + '\n';
  }
  return out;
}

export async function generateWithClaude(opts: {
  apiKey: string;
  model: string;
  maxTokens: number;
  selection: Selection;
  base: Files;
  request: string;
}): Promise<Files> {
  const baseText = Object.entries(opts.base)
    .map(([p, c]) => `=== FILE: ${p} ===\n${c}`)
    .join('\n');
  const user = `Stack: ${JSON.stringify(opts.selection)}\n\nBase project:\n${baseText}\n\nChange request:\n${opts.request}`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': opts.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens,
      system: SYSTEM,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${(await res.text()).slice(0, 500)}`);
  const json = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = (json.content ?? []).map((b) => (b.type === 'text' ? b.text ?? '' : '')).join('');
  const files = parseFiles(text);
  if (Object.keys(files).length === 0) throw new Error('Claude returned no parsable files.');
  return files;
}
