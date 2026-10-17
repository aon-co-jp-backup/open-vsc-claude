# PORTING.md — Open VSC Claude

Note di consegna: cosa è fatto, cosa no, insidie e procedure.

## Fatto

- Estensione: selezione dello stack, generazione Claude, modalità a testo libero, controllo aggiornamenti.
- Gateway RPoem con inoltro ai sottografi (repository separato RPoem, commit babc658).
- Demo nel browser + PWA su easy-web.tokyo/open-vps-claude.
- Documentazione in 12 lingue.

## Da fare

- Pubblicare su VS Code Marketplace / Open VSX (servono account del proprietario e token; vedi PUBLISHING.md).
- Eseguire davvero il Cosmo Router (sul PC di sviluppo non ci sono né il binario né Docker).
- Provare la modalità a testo libero con una vera chiave API Anthropic.
- Provare su iPhone, iPad e Android reali.
- Revisione delle traduzioni da parte di madrelingua.

## Insidie

- I file possono usare CRLF; la sostituzione via script può fallire in silenzio. Meglio usare gli strumenti dell’editor.
- Gli escape negli heredoc della shell trasformano \n in veri a capo; scrivi prima gli script di supporto su file.
- Il browser integrato blocca i Service Worker; prova la PWA con Chromium headless (playwright di @vscode/test-web).
- Non eseguire git pull nei repository con cronologia riscritta (vedi il meta-repository).
- Il repository si chiama open-vsc-claude; il percorso della demo richiesto dal proprietario è /open-vps-claude.

## Procedura di rilascio

1. Esegui i test (compile, test, test:vscode, test:web).
2. Aumenta la versione in package.json ed esegui npm run package.
3. gh release create vX.Y.Z con il .vsix e il relativo .sha256 (l’aggiornamento verifica il checksum).
4. npm run build:demo, poi distribuisci webpage/ sul VPS.

