# Open VSC Claude

[English](../../../README.md) · [日本語](../ja/README.md) · [简体中文](../zh-CN/README.md) · [繁體中文（台灣）](../zh-TW/README.md) · [한국어](../ko/README.md) · [Русский](../ru/README.md) · [Українська](../uk/README.md) · [Deutsch](../de/README.md) · [Italiano](../it/README.md) · [Français](../fr/README.md) · [العربية](../ar/README.md) · [فارسی](../fa/README.md)

VS Code 擴充功能：選擇語言/框架技術堆疊，預覽產生的程式碼，以 Claude 改良並儲存為專案。

- 線上示範: https://easy-web.tokyo/open-vps-claude/
- 原始碼: https://github.com/aon-co-jp/open-vsc-claude
- 授權：MIT

## 功能

- 選擇方式：GraphQL + WunderGraph Cosmo（不需要 Node.js 與 REST）、TypeScript + Node.js + REST，或以文字描述任意技術堆疊。
- 可選前端（HTML5+CSS3+JS、實驗性的 Rust+Leptos、TypeScript、React）、資料庫（無 / SQLite / PostgreSQL）、閘道（Cosmo Router / RPoem / 無）與後端（Python+FastAPI、Rust+Poem、Node.js+Express）。
- 以行號預覽所有產生的檔案，可複製或在編輯器中開啟；變更選項會立即更新預覽。
- 「使用 Claude 產生/修改」會依您的需求編輯專案（需要 Anthropic API 金鑰）。
- 儲存到資料夾（覆寫前確認）；在瀏覽器示範中可下載 zip。
- 介面與注意事項支援英文、日文、中文（簡體/繁體）與韓文；手動安裝版附更新檢查。

## 支援的平台

單一純 JavaScript 套件，不含原生程式碼。

| 平台 | 使用方式 |
| --- | --- |
| Windows / macOS / Linux | VS Code 擴充功能（桌面版） |
| Android (phone, tablet) / iPhone / iPad | 瀏覽器版 VS Code（vscode.dev / github.dev）的 Web 擴充功能，或加入主畫面的瀏覽器示範（PWA，可離線） |
| * | 線上示範: https://easy-web.tokyo/open-vps-claude/ |

## 使用方式

1. 在命令選擇區執行「Open VSC Claude: Open Stack Picker」。
2. 選擇技術堆疊，預覽會立即更新。
3. 使用 Claude 產生前，先讀取 API 金鑰（「Load Anthropic API Key from a .txt file」），再按 Ctrl+Enter。

## 注意事項

- 產生的程式碼僅作為起點；正式環境使用前請審查、測試並強化安全。不提供保證。
- Claude 產生會將所選技術堆疊、檔案與需求傳送至 Anthropic API；請勿包含機密或個人資料。
- API 金鑰、權杖與 SSH 私密金鑰：請存放於儲存庫之外的本機 .txt 檔，切勿提交或貼到聊天中。
- RPoem 閘道僅依根欄位路由（跨子圖的查詢會被拒絕）；Rust + Leptos 為實驗性。
- 五種語言的完整注意事項顯示於選擇介面與擴充功能的 README。

