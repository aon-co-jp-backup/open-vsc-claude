# Open VSC Claude

[English](../../../README.md) · [日本語](../ja/README.md) · [简体中文](../zh-CN/README.md) · [繁體中文（台灣）](../zh-TW/README.md) · [한국어](../ko/README.md) · [Русский](../ru/README.md) · [Українська](../uk/README.md) · [Deutsch](../de/README.md) · [Italiano](../it/README.md) · [Français](../fr/README.md) · [العربية](../ar/README.md) · [فارسی](../fa/README.md)

VS Code 扩展：选择语言/框架技术栈，预览生成的代码，用 Claude 改进并保存为项目。

- 在线演示: https://easy-web.tokyo/open-vps-claude/
- 源代码: https://github.com/aon-co-jp/open-vsc-claude
- 许可证：MIT

## 功能

- 选择方式：GraphQL + WunderGraph Cosmo（无需 Node.js 和 REST）、TypeScript + Node.js + REST，或用自然语言描述任意技术栈。
- 可选前端（HTML5+CSS3+JS、实验性的 Rust+Leptos、TypeScript、React）、数据库（无 / SQLite / PostgreSQL）、网关（Cosmo Router / RPoem / 无）和后端（Python+FastAPI、Rust+Poem、Node.js+Express）。
- 带行号预览所有生成的文件，可复制或在编辑器中打开；更改选项会立即更新预览。
- “使用 Claude 生成/修改”会根据您的需求编辑项目（需要 Anthropic API 密钥）。
- 保存到文件夹（覆盖前确认）；在浏览器演示中可下载 zip。
- 界面和注意事项支持英语、日语、中文（简体/繁体）和韩语；手动安装版带更新检查。

## 支持的平台

单一纯 JavaScript 包，无原生代码。

| 平台 | 使用方式 |
| --- | --- |
| Windows / macOS / Linux | VS Code 扩展（桌面版） |
| Android (phone, tablet) / iPhone / iPad | 浏览器版 VS Code（vscode.dev / github.dev）的 Web 扩展，或添加到主屏幕的浏览器演示（PWA，可离线） |
| * | 在线演示: https://easy-web.tokyo/open-vps-claude/ |

## 使用方法

1. 在命令面板中运行“Open VSC Claude: Open Stack Picker”。
2. 选择技术栈，预览会立即更新。
3. 使用 Claude 生成前，先读取 API 密钥（“Load Anthropic API Key from a .txt file”），然后按 Ctrl+Enter。

## 注意事项

- 生成的代码仅作为起点；用于生产环境前请审查、测试并加固安全。不提供担保。
- Claude 生成会把所选技术栈、文件和需求发送到 Anthropic API；请勿包含机密或个人数据。
- API 密钥、令牌和 SSH 私钥：请保存在仓库之外的本地 .txt 文件中，切勿提交或粘贴到聊天。
- RPoem 网关仅按根字段路由（跨子图的查询会被拒绝）；Rust + Leptos 为实验性。
- 五种语言的完整注意事项显示在选择界面和扩展的 README 中。

