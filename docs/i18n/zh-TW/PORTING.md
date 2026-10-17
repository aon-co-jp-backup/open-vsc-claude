# PORTING.md — Open VSC Claude

交接說明：已完成的、未完成的、陷阱與流程。

## 已完成

- 擴充功能：技術堆疊選擇、Claude 產生、自由輸入模式、更新檢查。
- RPoem 閘道轉送至子圖（獨立儲存庫 RPoem，提交 babc658）。
- 瀏覽器示範 + PWA 發布於 easy-web.tokyo/open-vps-claude。
- 12 種語言的文件。

## 待辦

- 發布到 VS Code Marketplace / Open VSX（需要擁有者帳號與權杖，見 PUBLISHING.md）。
- 實際執行 Cosmo Router（開發電腦上沒有執行檔或 Docker）。
- 以真實的 Anthropic API 金鑰測試自由輸入模式。
- 在真實的 iPhone、iPad 與 Android 裝置上測試。
- 由母語人士審閱譯文。

## 陷阱

- 檔案可能使用 CRLF，腳本取代可能悄悄失敗。請優先使用編輯器工具。
- shell heredoc 中的跳脫會把 \n 變成真正的換行；請先把輔助腳本寫入檔案。
- 應用程式內建瀏覽器會阻擋 Service Worker；請以無頭 Chromium（@vscode/test-web 附帶的 playwright）測試 PWA。
- 請勿在已改寫歷史的儲存庫中執行 git pull（見元儲存庫）。
- 儲存庫名稱為 open-vsc-claude；擁有者指定的示範路徑是 /open-vps-claude。

## 發布流程

1. 執行測試（compile、test、test:vscode、test:web）。
2. 提升 package.json 的版本並執行 npm run package。
3. 附上 .vsix 與其 .sha256 執行 gh release create vX.Y.Z（更新功能會驗證檢查碼）。
4. 執行 npm run build:demo，再將 webpage/ 部署到 VPS。

