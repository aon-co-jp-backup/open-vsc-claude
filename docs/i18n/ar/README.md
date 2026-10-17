<div dir="rtl">

# Open VSC Claude

[English](../../../README.md) · [日本語](../ja/README.md) · [简体中文](../zh-CN/README.md) · [繁體中文（台灣）](../zh-TW/README.md) · [한국어](../ko/README.md) · [Русский](../ru/README.md) · [Українська](../uk/README.md) · [Deutsch](../de/README.md) · [Italiano](../it/README.md) · [Français](../fr/README.md) · [العربية](../ar/README.md) · [فارسی](../fa/README.md)

إضافة VS Code: اختر حزمة لغة/إطار عمل، واعرض الشيفرة المولَّدة، وحسّنها باستخدام Claude، ثم احفظها كمشروع.

- عرض تجريبي مباشر: https://easy-web.tokyo/open-vps-claude/
- الشيفرة المصدرية: https://github.com/aon-co-jp/open-vsc-claude
- الترخيص: MIT

## الميزات

- اختيار الأسلوب: GraphQL + WunderGraph Cosmo (بدون Node.js وREST)، أو TypeScript + Node.js + REST، أو وصف أي حزمة بكلماتك.
- اختيار الواجهة الأمامية (HTML5+CSS3+JS، وRust+Leptos التجريبي، وTypeScript، وReact)، وقاعدة البيانات (بدون / SQLite / PostgreSQL)، والبوابة (Cosmo Router / RPoem / بدون)، والواجهة الخلفية (Python+FastAPI وRust+Poem وNode.js+Express).
- معاينة جميع الملفات المولَّدة مع أرقام الأسطر؛ نسخها أو فتحها في المحرر. تغيير الاختيار يحدّث المعاينة فورًا.
- «التوليد/التحسين باستخدام Claude» يعدّل المشروع وفق طلبك (يلزم مفتاح Anthropic API).
- الحفظ في مجلد (مع تأكيد الاستبدال) أو تنزيل ملف zip في العرض التجريبي عبر المتصفح.
- الواجهة والتنبيهات بالإنجليزية واليابانية والصينية (المبسطة/التقليدية) والكورية؛ وفحص التحديثات للتثبيت اليدوي.

## المنصات المدعومة

حزمة JavaScript خالصة واحدة، بلا شيفرة أصلية.

| المنصة | طريقة الاستخدام |
| --- | --- |
| Windows / macOS / Linux | إضافة VS Code (سطح المكتب) |
| Android (phone, tablet) / iPhone / iPad | VS Code في المتصفح (vscode.dev / github.dev) مع إضافة الويب، أو العرض التجريبي المضاف إلى الشاشة الرئيسية (PWA، يعمل دون اتصال) |
| * | عرض تجريبي مباشر: https://easy-web.tokyo/open-vps-claude/ |

## الاستخدام

1. شغّل «Open VSC Claude: Open Stack Picker» من لوحة الأوامر.
2. اختر الحزمة وستتحدّث المعاينة فورًا.
3. للتوليد باستخدام Claude، حمّل مفتاح API («Load Anthropic API Key from a .txt file») ثم اضغط Ctrl+Enter.

## تنبيهات

- الشيفرة المولَّدة نقطة بداية؛ راجعها واختبرها وأمّنها قبل استخدامها في الإنتاج. دون أي ضمان.
- التوليد باستخدام Claude يرسل الحزمة المختارة والملفات وطلبك إلى Anthropic API؛ لا تُدرج أسرارًا أو بيانات شخصية.
- احتفظ بمفاتيح API والرموز ومفاتيح SSH الخاصة في ملف .txt محلي خارج أي مستودع؛ لا تُودِعها ولا تلصقها في المحادثة.
- بوابة RPoem تُوجِّه حسب الحقل الجذري فقط (تُرفض الاستعلامات التي تمزج عدة رسوم فرعية)؛ وRust + Leptos تجريبي.
- التنبيهات الكاملة بخمس لغات تظهر في نافذة الاختيار وفي README الإضافة.


</div>
