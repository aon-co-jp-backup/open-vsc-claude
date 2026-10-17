# CLAUDE.md — Open VSC Claude

Istruzioni per le sessioni di Claude Code che lavorano su questo repository.

## Struttura

- src/catalog.ts: catalogo degli stack e modelli GraphQL + Cosmo; src/restTemplates.ts: modelli REST
- src/webview.ts: HTML dell’interfaccia, condiviso da estensione e demo nel browser
- src/extension.ts: comandi e lato host dell’estensione; src/claude.ts: API Anthropic
- src/update.ts + updateLogic.ts: aggiornamento dalle release di GitHub con verifica SHA-256
- scripts/: build di demo nel browser, estensione web, PWA e documentazione

## Regole

1. Non stampare, registrare né committare mai segreti (chiavi API, token, chiavi SSH); stanno in .txt locali fuori dal repository.
2. Lo stile Cosmo è solo GraphQL: nessun endpoint REST e nessuno strumento Node.js nei progetti generati.
3. La webview deve restare conforme alla CSP: nessun attributo style inline (lo verifica un test unitario).
4. Prima di ogni commit esegui npm test, npm run test:vscode e npm run test:web; verifica le modifiche all’interfaccia in un browser reale.
5. Indica con chiarezza cosa è stato verificato e cosa no; non dichiarare l’esecuzione del Cosmo Router o la pubblicazione sul Marketplace finché non avvengono.

## Comandi

```
npm install
npm run compile          # tsc
npm test                 # unit tests: every selectable combination, webview CSP, notices, updater logic
npm run test:vscode      # real VS Code (set VSCODE_EXE to Code.exe / code)
npm run test:web         # browser VS Code (web extension) through @vscode/test-web
npm run build:demo       # webpage/ : browser demo + PWA
npm run package          # .vsix
node scripts/gen-docs.js # regenerate these documents
```

## Stato

- Verificato: test unitari (129 combinazioni), VS Code reale, VS Code nel browser (estensione web), aggiornamento con checksum, inoltro RPoem, demo nel browser e PWA offline.
- Non verificato: esecuzione del Cosmo Router, generazione Claude con chiave reale, dispositivi iPhone/iPad/Android reali, pubblicazione sul Marketplace.

