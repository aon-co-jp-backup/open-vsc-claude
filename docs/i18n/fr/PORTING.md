# PORTING.md — Open VSC Claude

Notes de passation : ce qui est fait, ce qui ne l’est pas, pièges et procédures.

## Fait

- Extension : choix de la pile, génération Claude, mode libre, vérification des mises à jour.
- Passerelle RPoem avec transfert vers les sous-graphes (dépôt séparé RPoem, commit babc658).
- Démo navigateur + PWA sur easy-web.tokyo/open-vps-claude.
- Documentation en 12 langues.

## À faire

- Publier sur le VS Code Marketplace / Open VSX (compte du propriétaire et jeton requis ; voir PUBLISHING.md).
- Exécuter réellement le Cosmo Router (ni binaire ni Docker sur le PC de développement).
- Tester le mode libre avec une vraie clé d’API Anthropic.
- Tester sur de vrais iPhone, iPad et appareils Android.
- Relecture des traductions par des locuteurs natifs.

## Pièges

- Les fichiers peuvent utiliser CRLF ; un remplacement par script peut échouer silencieusement. Préférez les outils de l’éditeur.
- Les échappements dans les heredoc du shell transforment \n en vrais retours à la ligne ; écrivez d’abord les scripts d’aide dans des fichiers.
- Le navigateur intégré bloque les Service Workers ; testez la PWA avec Chromium sans interface (playwright de @vscode/test-web).
- Ne jamais exécuter git pull dans les dépôts dont l’historique a été réécrit (voir le méta-dépôt).
- Le dépôt s’appelle open-vsc-claude ; le chemin de démo demandé par le propriétaire est /open-vps-claude.

## Procédure de publication

1. Exécutez les tests (compile, test, test:vscode, test:web).
2. Augmentez la version dans package.json et lancez npm run package.
3. gh release create vX.Y.Z avec le .vsix et son .sha256 (la mise à jour vérifie la somme de contrôle).
4. npm run build:demo, puis déployez webpage/ sur le VPS.

