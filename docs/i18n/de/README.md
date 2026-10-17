# Open VSC Claude

[English](../../../README.md) · [日本語](../ja/README.md) · [简体中文](../zh-CN/README.md) · [繁體中文（台灣）](../zh-TW/README.md) · [한국어](../ko/README.md) · [Русский](../ru/README.md) · [Українська](../uk/README.md) · [Deutsch](../de/README.md) · [Italiano](../it/README.md) · [Français](../fr/README.md) · [العربية](../ar/README.md) · [فارسی](../fa/README.md)

VS-Code-Erweiterung: Sprach-/Framework-Stack wählen, erzeugten Code ansehen, mit Claude verfeinern und als Projekt speichern.

- Live-Demo: https://easy-web.tokyo/open-vps-claude/
- Quellcode: https://github.com/aon-co-jp/open-vsc-claude
- Lizenz: MIT

## Funktionen

- Ansatz wählen: GraphQL + WunderGraph Cosmo (ohne Node.js und REST), TypeScript + Node.js + REST oder einen beliebigen Stack in eigenen Worten beschreiben.
- Frontend (HTML5+CSS3+JS, experimentell Rust+Leptos, TypeScript, React), Datenbank (keine / SQLite / PostgreSQL), Gateway (Cosmo Router / RPoem / keines) und Backend (Python+FastAPI, Rust+Poem, Node.js+Express) wählbar.
- Alle erzeugten Dateien mit Zeilennummern ansehen, kopieren oder im Editor öffnen. Eine geänderte Auswahl aktualisiert die Vorschau sofort.
- „Mit Claude erzeugen / verfeinern“ bearbeitet das Projekt nach Ihrer Anfrage (Anthropic-API-Schlüssel erforderlich).
- In einen Ordner speichern (mit Überschreib-Bestätigung) oder in der Browser-Demo ein ZIP herunterladen.
- Oberfläche und Hinweise auf Englisch, Japanisch, Chinesisch (vereinfacht/traditionell) und Koreanisch; Update-Prüfung für manuell installierte Versionen.

## Unterstützte Plattformen

Ein reines JavaScript-Paket ohne nativen Code.

| Plattform | Verwendung |
| --- | --- |
| Windows / macOS / Linux | VS-Code-Erweiterung (Desktop) |
| Android (phone, tablet) / iPhone / iPad | VS Code im Browser (vscode.dev / github.dev) mit der Web-Erweiterung oder die Browser-Demo auf dem Startbildschirm (PWA, offline nutzbar) |
| * | Live-Demo: https://easy-web.tokyo/open-vps-claude/ |

## Verwendung

1. Im Befehlspalette „Open VSC Claude: Open Stack Picker“ ausführen.
2. Stack wählen – die Vorschau wird sofort aktualisiert.
3. Für die Claude-Erzeugung den API-Schlüssel laden („Load Anthropic API Key from a .txt file“) und Strg+Enter drücken.

## Hinweise

- Erzeugter Code ist ein Ausgangspunkt; vor dem Produktiveinsatz prüfen, testen und absichern. Keine Gewährleistung.
- Die Claude-Erzeugung sendet den gewählten Stack, die Dateien und Ihre Anfrage an die Anthropic-API; keine Geheimnisse oder personenbezogenen Daten angeben.
- API-Schlüssel, Tokens und private SSH-Schlüssel in einer lokalen .txt-Datei außerhalb jedes Repositorys aufbewahren; nie committen oder in den Chat einfügen.
- Das RPoem-Gateway routet nur nach Root-Feldern (Abfragen über mehrere Subgraphen werden abgelehnt); Rust + Leptos ist experimentell.
- Die vollständigen Hinweise in fünf Sprachen stehen in der Auswahl und in der README der Erweiterung.

