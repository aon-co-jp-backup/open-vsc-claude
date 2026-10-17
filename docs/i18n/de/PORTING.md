# PORTING.md — Open VSC Claude

Übergabenotizen: was erledigt ist, was nicht, Stolpersteine und Abläufe.

## Erledigt

- Erweiterung: Stack-Auswahl, Claude-Erzeugung, Freitextmodus, Update-Prüfung.
- RPoem-Gateway mit Weiterleitung an Subgraphen (eigenes Repository RPoem, Commit babc658).
- Browser-Demo + PWA unter easy-web.tokyo/open-vps-claude.
- Dokumentation in 12 Sprachen.

## Offen

- Veröffentlichung im VS Code Marketplace / Open VSX (Konto des Eigentümers und Token nötig; siehe PUBLISHING.md).
- Den Cosmo Router wirklich ausführen (auf dem Entwicklungs-PC gibt es weder Binärdatei noch Docker).
- Freitextmodus mit einem echten Anthropic-API-Schlüssel testen.
- Auf echten iPhone-, iPad- und Android-Geräten testen.
- Übersetzungen von Muttersprachlern prüfen lassen.

## Stolpersteine

- Dateien können CRLF verwenden; skriptbasiertes Ersetzen kann unbemerkt fehlschlagen. Besser die Editor-Werkzeuge nutzen.
- Escapes in Shell-Heredocs machen aus \n echte Zeilenumbrüche; Hilfsskripte zuerst in Dateien schreiben.
- Der In-App-Browser blockiert Service Worker; die PWA mit Headless-Chromium testen (playwright aus @vscode/test-web).
- In Repositories mit umgeschriebener Historie nie git pull ausführen (siehe Meta-Repository).
- Das Repository heißt open-vsc-claude; der vom Eigentümer gewünschte Demo-Pfad ist /open-vps-claude.

## Release-Ablauf

1. Tests ausführen (compile, test, test:vscode, test:web).
2. Version in package.json erhöhen und npm run package ausführen.
3. gh release create vX.Y.Z mit der .vsix und ihrer .sha256 (der Updater prüft die Prüfsumme).
4. npm run build:demo, danach webpage/ auf den VPS bringen.

