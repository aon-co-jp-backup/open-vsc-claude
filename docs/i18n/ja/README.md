# Open VSC Claude

[English](../../../README.md) · [日本語](../ja/README.md) · [简体中文](../zh-CN/README.md) · [繁體中文（台灣）](../zh-TW/README.md) · [한국어](../ko/README.md) · [Русский](../ru/README.md) · [Українська](../uk/README.md) · [Deutsch](../de/README.md) · [Italiano](../it/README.md) · [Français](../fr/README.md) · [العربية](../ar/README.md) · [فارسی](../fa/README.md)

VS Code 拡張: 言語・フレームワークを選んで生成コードをプレビューし、Claude で改良してプロジェクトとして保存できます。

- ライブデモ: https://easy-web.tokyo/open-vps-claude/
- ソースコード: https://github.com/aon-co-jp/open-vsc-claude
- ライセンス: MIT

## 機能

- 方式を選択: GraphQL + WunderGraph Cosmo(Node.js・REST 不要)、TypeScript + Node.js + REST、または任意の構成を言葉で指定。
- フロント(HTML5+CSS3+JS、実験的な Rust+Leptos、TypeScript、React)、DB(なし / SQLite / PostgreSQL)、ゲートウェイ(Cosmo Router / RPoem / なし)、バックエンド(Python+FastAPI、Rust+Poem、Node.js+Express)を選べます。
- 生成された全ファイルを行番号付きでプレビュー。コピーやエディタで開く操作も可能。選択を変えると即座に更新されます。
- 「Claude で生成・改変」で要望に沿ってプロジェクトを編集します(Anthropic API キーが必要)。
- フォルダへ保存(上書き確認つき)。ブラウザ版デモでは zip をダウンロードできます。
- UI と注意書きは英語・日本語・中国語(簡体/繁体)・韓国語。手動インストール版は更新確認つき。

## 対応環境

純粋な JavaScript の 1 パッケージで、ネイティブコードはありません。

| 環境 | 使い方 |
| --- | --- |
| Windows / macOS / Linux | VS Code 拡張(デスクトップ) |
| Android (phone, tablet) / iPhone / iPad | ブラウザ版 VS Code(vscode.dev / github.dev)の Web 拡張、またはホーム画面に追加したブラウザデモ(PWA、オフライン可) |
| * | ライブデモ: https://easy-web.tokyo/open-vps-claude/ |

## 使い方

1. コマンドパレットで「Open VSC Claude: Open Stack Picker」を実行します。
2. スタックを選ぶと、すぐにプレビューが更新されます。
3. Claude 生成には API キーを読み込み(「Load Anthropic API Key from a .txt file」)、Ctrl+Enter を押します。

## 注意書き

- 生成コードは出発点です。本番利用の前に確認・テスト・セキュリティ対策を行ってください。保証はありません。
- Claude 生成は、選択したスタック・ファイル・要望を Anthropic API へ送信します。秘密情報や個人情報を含めないでください。
- API キー・トークン・SSH 秘密鍵は、リポジトリ外のローカル .txt に置き、コミットやチャットへの貼り付けをしないでください。
- RPoem ゲートウェイはルートフィールド単位の振り分けのみ(複数サブグラフにまたがるクエリは拒否)。Rust + Leptos は実験的です。
- 5 言語の全文の注意書きは、選択画面と拡張の README にあります。

