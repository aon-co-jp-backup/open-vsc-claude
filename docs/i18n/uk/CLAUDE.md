# CLAUDE.md — Open VSC Claude

Інструкції для сесій Claude Code, що працюють із цим репозиторієм.

## Структура

- src/catalog.ts: каталог стеків і шаблони GraphQL + Cosmo; src/restTemplates.ts: шаблони REST
- src/webview.ts: HTML інтерфейсу, спільний для розширення та браузерної демо
- src/extension.ts: команди й бік хоста розширення; src/claude.ts: Anthropic API
- src/update.ts + updateLogic.ts: оновлення з релізів GitHub із перевіркою SHA-256
- scripts/: збирання браузерної демо, веб-розширення, PWA та документації

## Правила

1. Ніколи не виводьте, не логуйте й не комітьте секрети (ключі API, токени, ключі SSH); вони лежать у локальних .txt поза репозиторієм.
2. Стиль Cosmo — лише GraphQL: у згенерованих проєктах немає REST-ендпоінтів та інструментів Node.js.
3. Webview має відповідати CSP: жодних вбудованих атрибутів style (перевіряється модульним тестом).
4. Перед кожним комітом запускайте npm test, npm run test:vscode і npm run test:web; зміни інтерфейсу перевіряйте в реальному браузері.
5. Чітко вказуйте, що перевірено, а що ні; не заявляйте про запуск Cosmo Router чи публікацію в Marketplace, доки цього не зроблено.

## Команди

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

## Стан

- Перевірено: модульні тести (129 комбінацій), справжній VS Code, VS Code у браузері (веб-розширення), оновлення з контрольною сумою, пересилання RPoem, браузерна демо та офлайн-PWA.
- Не перевірено: запуск Cosmo Router, генерація Claude з реальним ключем, реальні iPhone/iPad/Android, публікація в Marketplace.

