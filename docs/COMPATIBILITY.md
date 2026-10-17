# Compatibility / 互換性

Open VSC Claude is pure JavaScript (no native code) and talks to its host only through a small, versioned contract, so the same
package runs on VS Code (desktop and web), VS Code forks and the browser demo. / 純粋な JavaScript で、ホストとは小さなバージョン付きの規約だけで通信するため、
同じパッケージが VS Code(デスクトップ・Web)、VS Code のフォーク、ブラウザデモで動きます。

## Host matrix / 対応表 (2026-10-18)

| Host / ホスト | Status / 状態 |
| --- | --- |
| VS Code stable, Windows | Verified (`npm run test:vscode`) |
| VS Code 1.85.0 (minimum `engines.vscode`), Windows | Verified (`VSCODE_VERSION=1.85.0 node out/itest/run.js`) |
| VSCodium 1.140 (Code-OSS fork), Windows | Verified (`VSCODE_EXE=…\VSCodium.exe node out/itest/run.js`) |
| VS Code for the Web (browser extension host, headless Chromium) | Verified (`npm run test:web`) |
| Browser demo + PWA (Chromium, desktop and phone sizes, offline) | Verified (`npm run test:demo`) |
| VS Code on macOS / Linux, Safari, real iPhone / iPad / Android | Not verified (no such device or OS here) |
| **dream-os VSC** | **Not available yet**: the `dream-os` repository contains no VS Code build or plugin as of 2026-10-18. The contract below is what such a host must provide. |

## What a host must provide / ホストが提供すべきもの

- VS Code extension API ≥ 1.85, no proposed APIs: `commands`, `window.createWebviewPanel` (scripts enabled), `window.showOpenDialog`,
  `window.showInformationMessage`/`showWarningMessage`, `workspace.fs`, `workspace.getConfiguration`, `env.clipboard`, `env.language`,
  `env.appName`, `env.uiKind`, `ExtensionContext.globalState` / `globalStorageUri`.
- `ExtensionContext.secrets` is preferred for the API key; if it throws (no keyring) the key is kept in `globalState` and the user is warned.
- Global `fetch` (Node ≥ 18 or a browser). Web Crypto when global, otherwise Node `crypto` (VS Code 1.85 ships Node 18).
- Optional: `workbench.extensions.installExtension` (used by the update check on desktop only).

## Webview ⇄ host protocol (version 1) / 通信規約

Source of truth: `src/protocol.ts`. The UI sends `init` with its protocol number; the host answers `hello`. If the major numbers differ the UI shows a
warning asking the user to update. Breaking change ⇒ bump `PROTOCOL_VERSION`.

| webview → host | purpose |
| --- | --- |
| `init {protocol}` | handshake |
| `preview {selection}` | generate the template files for a selection |
| `generate {selection, base, request}` | Claude generation / refinement |
| `save {files}` | write files to a chosen folder (overwrite confirmation) |
| `openFile {path, content}`, `copy {text}` | open in an editor / copy |
| `setKey`, `loadKey` | enter / load the API key |

| host → webview | purpose |
| --- | --- |
| `hello {protocol, host}` | handshake reply |
| `files {files}`, `merge {files}` | full preview / files changed by Claude |
| `status {text}`, `keyState {has}` | message line / API key indicator |

## Identifiers / 識別子

- Commands: `openVscClaude.open`, `openVscClaude.setApiKey`, `openVscClaude.loadApiKeyFromFile`, `openVscClaude.checkForUpdates`.
- Settings: `openVscClaude.model`, `openVscClaude.maxTokens`, `openVscClaude.autoUpdate`.
- Storage keys: `openVscClaude.anthropicApiKey` (secret), `openVscClaude.anthropicApiKey.fallback`, `lastUpdateCheck` (globalState).
- Generated files: UTF-8, LF line endings, relative paths only (absolute paths and `..` are rejected when saving).

## Running the checks / 検証コマンド

```
npm test                                   # unit tests
npm run test:vscode                        # latest VS Code (or set VSCODE_EXE)
VSCODE_VERSION=1.85.0 node out/itest/run.js  # minimum supported VS Code
npm run test:web                           # browser extension host
npm run test:demo                          # browser demo + PWA
```
