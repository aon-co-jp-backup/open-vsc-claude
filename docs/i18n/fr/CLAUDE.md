# CLAUDE.md — Open VSC Claude

Instructions pour les sessions Claude Code travaillant sur ce dépôt.

## Organisation

- src/catalog.ts : catalogue des piles et modèles GraphQL + Cosmo ; src/restTemplates.ts : modèles REST
- src/webview.ts : HTML de l’interface, partagé par l’extension et la démo navigateur
- src/extension.ts : commandes et côté hôte de l’extension ; src/claude.ts : API Anthropic
- src/update.ts + updateLogic.ts : mise à jour depuis les versions GitHub avec vérification SHA-256
- scripts/ : constructions de la démo navigateur, de l’extension web, de la PWA et de la documentation

## Règles

1. Ne jamais afficher, journaliser ni commiter de secrets (clés d’API, jetons, clés SSH) ; ils vivent dans des .txt locaux hors du dépôt.
2. Le style Cosmo est uniquement GraphQL : aucun point d’accès REST ni outil Node.js dans les projets générés.
3. La webview doit rester conforme à la CSP : aucun attribut style en ligne (un test unitaire le vérifie).
4. Avant chaque commit, exécutez npm test, npm run test:vscode et npm run test:web ; vérifiez les changements d’interface dans un vrai navigateur.
5. Indiquez clairement ce qui a été vérifié ou non ; ne déclarez l’exécution du Cosmo Router ni la publication sur le Marketplace avant qu’elles aient eu lieu.

## Commandes

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

## État

- Vérifié : tests unitaires (129 combinaisons), vrai VS Code, VS Code dans le navigateur (extension web), mise à jour avec somme de contrôle, transfert RPoem, démo navigateur et PWA hors ligne.
- Non vérifié : exécution du Cosmo Router, génération Claude avec une vraie clé, vrais appareils iPhone/iPad/Android, publication sur le Marketplace.

