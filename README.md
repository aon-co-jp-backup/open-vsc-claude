# Open VSC Claude

VS Code extension: pick a stack, view the generated code, refine it with Claude, save it to a folder.

- **方式 / Style**
  - GraphQL + WunderGraph Cosmo Router (no Node.js, no REST; the router execution config is pre-composed and bundled)
  - TypeScript + Node.js + REST API
  - 自由入力 / Free-form: type the language and framework in your own words and Claude builds the project
- **Gateway (Cosmo style)**: WunderGraph Cosmo Router, **RPoem gateway** (Rust, forwards to subgraphs by root field — implemented and verified together with this extension), or none (direct)
- **Frontend**: HTML5+CSS3+JS, or **Rust + Leptos (WASM via trunk, experimental — no JS/TS to write; Cosmo style)** (REST style also: +TypeScript, +TypeScript+React via Vite)
- **Backend**: Python+FastAPI, Rust+Poem, (REST style also: Node.js+Express/TypeScript)
- **Database**: none / SQLite / PostgreSQL

Command palette: `Open VSC Claude: Open Stack Picker`, `Open VSC Claude: Set Anthropic API Key` (stored in SecretStorage; model via `openVscClaude.model`).

## Develop

```
npm install
npm run compile
npm test            # unit tests (all selectable combinations)
npm run test:vscode # starts a real VS Code (set VSCODE_EXE) and opens the picker
```

Press F5 in VS Code to launch an Extension Development Host.
