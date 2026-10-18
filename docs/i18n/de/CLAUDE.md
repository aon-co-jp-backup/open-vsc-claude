# CLAUDE.md — Open VSC Claude

Anweisungen für Claude-Code-Sitzungen, die an diesem Repository arbeiten.

## Aufbau

- src/catalog.ts: Stack-Katalog und GraphQL-+-Cosmo-Vorlagen; src/restTemplates.ts: REST-Vorlagen
- src/webview.ts: Oberflächen-HTML, gemeinsam für die Erweiterung und die Browser-Demo
- src/extension.ts: Befehle und Host-Seite der Erweiterung; src/claude.ts: Anthropic-API
- src/update.ts + updateLogic.ts: Updater für GitHub-Releases mit SHA-256-Prüfung
- scripts/: Builds für Browser-Demo, Web-Erweiterung, PWA und Dokumentation

## Regeln

1. Geheimnisse (API-Schlüssel, Tokens, SSH-Schlüssel) nie ausgeben, protokollieren oder committen; sie liegen in lokalen .txt-Dateien außerhalb des Repositorys.
2. Der Cosmo-Stil ist reines GraphQL: keine REST-Endpunkte und kein Node.js-Tooling in erzeugten Projekten.
3. Die Webview muss CSP-konform bleiben: keine Inline-style-Attribute (ein Unit-Test prüft das).
4. Vor jedem Commit npm test, npm run test:vscode und npm run test:web ausführen; UI-Änderungen in einem echten Browser prüfen.
5. Klar benennen, was geprüft wurde und was nicht; den Lauf des Cosmo Routers und die Marketplace-Veröffentlichung erst als erledigt melden, wenn sie es sind.

## Befehle

```
npm install
npm run compile          # tsc
npm test                 # unit tests: every selectable combination, webview CSP, notices, updater logic
npm run test:vscode      # real VS Code (set VSCODE_EXE to Code.exe / code)
npm run test:web         # browser VS Code (web extension) through @vscode/test-web
npm run test:leptos      # generated Rust + Leptos (trunk) frontend in real Chromium: direct and through the RPoem gateway (needs Rust, trunk, Python)
npm run build:demo       # webpage/ : browser demo + PWA
npm run package          # .vsix
node scripts/gen-docs.js # regenerate these documents
```

## Stand

- Geprüft: Unit-Tests (129 Kombinationen), echtes VS Code, VS Code im Browser (Web-Erweiterung), Updater mit Prüfsumme, RPoem-Weiterleitung, Browser-Demo und Offline-PWA.
- Nicht geprüft: Ausführung des Cosmo Routers, Claude-Erzeugung mit echtem Schlüssel, echte iPhone-/iPad-/Android-Geräte, Marketplace-Veröffentlichung.

