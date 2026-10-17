<div dir="rtl">

# CLAUDE.md — Open VSC Claude

دستورالعمل برای نشست‌های Claude Code که روی این مخزن کار می‌کنند.

## ساختار

- src/catalog.ts: فهرست پشته‌ها و قالب‌های GraphQL + Cosmo؛ src/restTemplates.ts: قالب‌های REST
- src/webview.ts: HTML رابط، مشترک بین افزونه و نسخهٔ نمایشی مرورگر
- src/extension.ts: فرمان‌ها و سمت میزبان افزونه؛ src/claude.ts: Anthropic API
- src/update.ts + updateLogic.ts: به‌روزرسانی از انتشارهای GitHub با بررسی SHA-256
- scripts/: ساخت نسخهٔ نمایشی مرورگر، بستهٔ افزونهٔ وب، PWA و مستندات

## قوانین

1. هرگز رمزها (کلیدهای API، توکن‌ها، کلیدهای SSH) را چاپ، ثبت یا کامیت نکنید؛ آن‌ها در فایل‌های .txt محلی بیرون از مخزن هستند.
2. سبک Cosmo فقط GraphQL است: در پروژه‌های تولیدشده نه نقطهٔ پایانی REST هست و نه ابزار Node.js.
3. Webview باید با CSP سازگار بماند: بدون ویژگی style درون‌خطی (یک آزمون واحد این را بررسی می‌کند).
4. پیش از هر کامیت npm test، npm run test:vscode و npm run test:web را اجرا کنید؛ تغییرات رابط را در مرورگر واقعی بررسی کنید.
5. روشن بگویید چه چیزی بررسی شده و چه چیزی نه؛ تا زمانی که اجرای Cosmo Router یا انتشار در Marketplace انجام نشده، آن را انجام‌شده اعلام نکنید.

## فرمان‌ها

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

## وضعیت

- بررسی‌شده: آزمون‌های واحد (۱۲۹ ترکیب)، VS Code واقعی، VS Code در مرورگر (افزونهٔ وب)، به‌روزرسانی با جمع‌کنترلی، انتقال RPoem، نسخهٔ نمایشی مرورگر و PWA آفلاین.
- بررسی‌نشده: اجرای Cosmo Router، تولید با Claude با کلید واقعی، دستگاه‌های واقعی iPhone/iPad/Android، انتشار در Marketplace.


</div>
