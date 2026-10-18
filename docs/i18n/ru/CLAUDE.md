# CLAUDE.md — Open VSC Claude

Инструкции для сессий Claude Code, работающих с этим репозиторием.

## Структура

- src/catalog.ts: каталог стеков и шаблоны GraphQL + Cosmo; src/restTemplates.ts: шаблоны REST
- src/webview.ts: HTML интерфейса, общий для расширения и браузерной демо
- src/extension.ts: команды и сторона хоста расширения; src/claude.ts: Anthropic API
- src/update.ts + updateLogic.ts: обновление из релизов GitHub с проверкой SHA-256
- scripts/: сборка браузерной демо, веб-расширения, PWA и документации

## Правила

1. Никогда не выводите, не логируйте и не коммитьте секреты (ключи API, токены, ключи SSH); они лежат в локальных .txt вне репозитория.
2. Стиль Cosmo — только GraphQL: в сгенерированных проектах нет REST-эндпоинтов и инструментов Node.js.
3. Webview должен соответствовать CSP: никаких встроенных атрибутов style (проверяется модульным тестом).
4. Перед каждым коммитом запускайте npm test, npm run test:vscode и npm run test:web; изменения интерфейса проверяйте в реальном браузере.
5. Чётко указывайте, что проверено, а что нет; не заявляйте о запуске Cosmo Router или публикации в Marketplace, пока это не сделано.

## Команды

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

## Состояние

- Проверено: модульные тесты (129 комбинаций), настоящий VS Code, VS Code в браузере (веб-расширение), обновление с контрольной суммой, пересылка RPoem, браузерная демо и офлайн-PWA.
- Не проверено: запуск Cosmo Router, генерация Claude с реальным ключом, реальные iPhone/iPad/Android, публикация в Marketplace.

