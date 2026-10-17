# Open VSC Claude

[English](../../../README.md) · [日本語](../ja/README.md) · [简体中文](../zh-CN/README.md) · [繁體中文（台灣）](../zh-TW/README.md) · [한국어](../ko/README.md) · [Русский](../ru/README.md) · [Українська](../uk/README.md) · [Deutsch](../de/README.md) · [Italiano](../it/README.md) · [Français](../fr/README.md) · [العربية](../ar/README.md) · [فارسی](../fa/README.md)

Estensione di VS Code: scegli uno stack di linguaggio/framework, visualizza il codice generato, rifinisci con Claude e salvalo come progetto.

- Demo online: https://easy-web.tokyo/open-vps-claude/
- Codice sorgente: https://github.com/aon-co-jp/open-vsc-claude
- Licenza: MIT

## Funzionalità

- Scegli l’approccio: GraphQL + WunderGraph Cosmo (senza Node.js e REST), TypeScript + Node.js + REST, oppure descrivi qualsiasi stack con parole tue.
- Scegli frontend (HTML5+CSS3+JS, Rust+Leptos sperimentale, TypeScript, React), database (nessuno / SQLite / PostgreSQL), gateway (Cosmo Router / RPoem / nessuno) e backend (Python+FastAPI, Rust+Poem, Node.js+Express).
- Anteprima di tutti i file generati con numeri di riga; copia o apri nell’editor. Cambiando la selezione l’anteprima si aggiorna subito.
- «Genera / rifinisci con Claude» modifica il progetto in base alla tua richiesta (serve una chiave API Anthropic).
- Salva in una cartella (con conferma di sovrascrittura) oppure, nella demo nel browser, scarica uno zip.
- Interfaccia e avvisi in inglese, giapponese, cinese (semplificato/tradizionale) e coreano; controllo aggiornamenti per le installazioni manuali.

## Piattaforme supportate

Un solo pacchetto JavaScript puro, senza codice nativo.

| Piattaforma | Come usarlo |
| --- | --- |
| Windows / macOS / Linux | Estensione di VS Code (desktop) |
| Android (phone, tablet) / iPhone / iPad | VS Code nel browser (vscode.dev / github.dev) con l’estensione web, oppure la demo nel browser aggiunta alla schermata Home (PWA, funziona offline) |
| * | Demo online: https://easy-web.tokyo/open-vps-claude/ |

## Uso

1. Esegui «Open VSC Claude: Open Stack Picker» dalla tavolozza dei comandi.
2. Scegli lo stack: l’anteprima si aggiorna subito.
3. Per la generazione con Claude carica la chiave API («Load Anthropic API Key from a .txt file») e premi Ctrl+Invio.

## Avvertenze

- Il codice generato è un punto di partenza; prima dell’uso in produzione verificalo, testalo e mettilo in sicurezza. Nessuna garanzia.
- La generazione con Claude invia lo stack scelto, i file e la tua richiesta all’API Anthropic; non includere segreti o dati personali.
- Chiavi API, token e chiavi private SSH: tienili in un .txt locale fuori da qualsiasi repository; non farne commit né incollarli in chat.
- Il gateway RPoem instrada solo per campo radice (le query che mescolano sottografi vengono rifiutate); Rust + Leptos è sperimentale.
- Le avvertenze complete in cinque lingue sono nella schermata di selezione e nel README dell’estensione.

