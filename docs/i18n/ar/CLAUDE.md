<div dir="rtl">

# CLAUDE.md — Open VSC Claude

تعليمات لجلسات Claude Code التي تعمل على هذا المستودع.

## البنية

- src/catalog.ts: فهرس الحزم وقوالب GraphQL + Cosmo؛ src/restTemplates.ts: قوالب REST
- src/webview.ts: HTML الواجهة، مشترك بين الإضافة والعرض التجريبي
- src/extension.ts: الأوامر وجانب مضيف الإضافة؛ src/claude.ts: Anthropic API
- src/update.ts + updateLogic.ts: التحديث من إصدارات GitHub مع التحقق من SHA-256
- scripts/: بناء العرض التجريبي وحزمة إضافة الويب وPWA والوثائق

## القواعد

1. لا تطبع الأسرار (مفاتيح API والرموز ومفاتيح SSH) ولا تسجّلها ولا تُودِعها؛ مكانها ملفات .txt محلية خارج المستودع.
2. أسلوب Cosmo هو GraphQL فقط: لا نقاط REST ولا أدوات Node.js في المشاريع المولَّدة.
3. يجب أن تبقى الواجهة متوافقة مع CSP: لا سمات style مضمَّنة (يتحقق منها اختبار وحدة).
4. شغّل npm test وnpm run test:vscode وnpm run test:web قبل كل إيداع؛ وتحقق من تغييرات الواجهة في متصفح حقيقي.
5. اذكر بوضوح ما جرى التحقق منه وما لم يجرِ؛ لا تعلن تشغيل Cosmo Router أو النشر في Marketplace قبل حدوثهما.

## الأوامر

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

## الحالة

- تم التحقق: اختبارات الوحدة (129 تركيبة)، VS Code حقيقي، VS Code في المتصفح (إضافة ويب)، التحديث مع المجموع الاختباري، تمرير RPoem، العرض التجريبي وPWA دون اتصال.
- لم يتم التحقق: تشغيل Cosmo Router، التوليد باستخدام Claude بمفتاح حقيقي، أجهزة iPhone/iPad/Android الحقيقية، النشر في Marketplace.


</div>
