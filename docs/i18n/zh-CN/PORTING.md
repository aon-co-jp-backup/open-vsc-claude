# PORTING.md — Open VSC Claude

交接说明：已完成的、未完成的、陷阱与流程。

## 已完成

- 扩展：技术栈选择、Claude 生成、自由输入模式、更新检查。
- RPoem 网关转发到子图（独立仓库 RPoem，提交 babc658）。
- 浏览器演示 + PWA 发布于 easy-web.tokyo/open-vps-claude。
- 12 种语言的文档。

## 待办

- 发布到 VS Code Marketplace / Open VSX（需要所有者账号和令牌，见 PUBLISHING.md）。
- 实际运行 Cosmo Router（开发电脑上没有二进制文件或 Docker）。
- 用真实的 Anthropic API 密钥测试自由输入模式。
- 在真实的 iPhone、iPad 和 Android 设备上测试。
- 由母语者审校译文。

## 陷阱

- 文件可能使用 CRLF，脚本替换可能悄悄失败。请优先使用编辑器工具。
- shell heredoc 中的转义会把 \n 变成真正的换行；请先把辅助脚本写入文件。
- 应用内浏览器会阻止 Service Worker；请用无头 Chromium（@vscode/test-web 附带的 playwright）测试 PWA。
- 不要在已改写历史的仓库中运行 git pull（见元仓库）。
- 仓库名为 open-vsc-claude；所有者要求的演示路径是 /open-vps-claude。

## 发布流程

1. 运行测试（compile、test、test:vscode、test:web）。
2. 提升 package.json 中的版本并运行 npm run package。
3. 携带 .vsix 及其 .sha256 执行 gh release create vX.Y.Z（更新功能会校验校验和）。
4. 运行 npm run build:demo，然后把 webpage/ 部署到 VPS。

