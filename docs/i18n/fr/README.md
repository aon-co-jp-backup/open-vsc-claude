# Open VSC Claude

[English](../../../README.md) · [日本語](../ja/README.md) · [简体中文](../zh-CN/README.md) · [繁體中文（台灣）](../zh-TW/README.md) · [한국어](../ko/README.md) · [Русский](../ru/README.md) · [Українська](../uk/README.md) · [Deutsch](../de/README.md) · [Italiano](../it/README.md) · [Français](../fr/README.md) · [العربية](../ar/README.md) · [فارسی](../fa/README.md)

Extension VS Code : choisissez une pile langage/framework, prévisualisez le code généré, affinez-le avec Claude et enregistrez-le comme projet.

- Démo en ligne: https://easy-web.tokyo/open-vps-claude/
- Code source: https://github.com/aon-co-jp/open-vsc-claude
- Licence : MIT

## Fonctionnalités

- Choisissez l’approche : GraphQL + WunderGraph Cosmo (sans Node.js ni REST), TypeScript + Node.js + REST, ou décrivez n’importe quelle pile avec vos mots.
- Choix du frontend (HTML5+CSS3+JS, Rust+Leptos expérimental, TypeScript, React), de la base de données (aucune / SQLite / PostgreSQL), de la passerelle (Cosmo Router / RPoem / aucune) et du backend (Python+FastAPI, Rust+Poem, Node.js+Express).
- Aperçu de tous les fichiers générés avec numéros de ligne ; copie ou ouverture dans l’éditeur. Changer la sélection met l’aperçu à jour immédiatement.
- « Générer / affiner avec Claude » modifie le projet selon votre demande (clé d’API Anthropic requise).
- Enregistrement dans un dossier (avec confirmation d’écrasement) ou, dans la démo navigateur, téléchargement d’un zip.
- Interface et avis en anglais, japonais, chinois (simplifié/traditionnel) et coréen ; vérification des mises à jour pour les installations manuelles.

## Plateformes prises en charge

Un seul paquet JavaScript pur, sans code natif.

| Plateforme | Utilisation |
| --- | --- |
| Windows / macOS / Linux | Extension VS Code (bureau) |
| Android (phone, tablet) / iPhone / iPad | VS Code dans le navigateur (vscode.dev / github.dev) avec l’extension web, ou la démo navigateur ajoutée à l’écran d’accueil (PWA, fonctionne hors ligne) |
| * | Démo en ligne: https://easy-web.tokyo/open-vps-claude/ |

## Utilisation

1. Exécutez « Open VSC Claude: Open Stack Picker » depuis la palette de commandes.
2. Choisissez la pile : l’aperçu se met à jour immédiatement.
3. Pour la génération avec Claude, chargez votre clé d’API (« Load Anthropic API Key from a .txt file ») puis appuyez sur Ctrl+Entrée.

## Avis

- Le code généré est un point de départ ; vérifiez-le, testez-le et sécurisez-le avant toute mise en production. Aucune garantie.
- La génération avec Claude envoie la pile choisie, les fichiers et votre demande à l’API Anthropic ; n’y mettez ni secrets ni données personnelles.
- Clés d’API, jetons et clés privées SSH : gardez-les dans un .txt local hors de tout dépôt ; ne les commitez jamais et ne les collez pas dans le chat.
- La passerelle RPoem route uniquement par champ racine (les requêtes mêlant plusieurs sous-graphes sont refusées) ; Rust + Leptos est expérimental.
- Les avis complets en cinq langues figurent dans le sélecteur et dans le README de l’extension.

