import type { Lang } from './notices';

export interface Ui {
  style: string; frontend: string; database: string; gateway: string; backend: string;
  save: string; setKey: string; loadKey: string; generate: string; reset: string;
  stackPh: string; reqPh: string; files: string; copy: string; copied: string; openEditor: string;
  keyOk: string; keyMissing: string; running: string; updated: string; hint: string;
  overwrite: string; overwriteBtn: string; saved: string; openFolder: string; keyBad: string; keyLoaded: string; noKey: string; demoBanner: string; demoGen: string; demoKey: string; demoSaved: string; keyFallback: string; protoMismatch: string; updAvail: string; updInstall: string; updNotes: string; updLater: string; updDone: string; updReload: string; updNone: string; updFail: string; updNoChecksum: string; updBadChecksum: string;
}

export const UI: Record<Lang, Ui> = {
  ja: {
    style: '方式', frontend: 'フロント', database: 'DB', gateway: 'ゲートウェイ', backend: 'バックエンド',
    save: 'フォルダに保存', setKey: 'API キー入力', loadKey: 'キーを txt から読込', generate: 'Claude で生成・改変', reset: 'テンプレートに戻す',
    stackPh: '使う言語・フレームワーク・作りたいものを言葉で入力 (例: Go + Gin + PostgreSQL で ToDo API。Dockerfile も)',
    reqPh: 'Claude への要望 (例: ユーザー認証を追加 / Item に price を追加)  Ctrl+Enter で実行',
    files: 'ファイル', copy: 'コピー', copied: 'コピーしました', openEditor: 'エディタで開く',
    keyOk: 'API キー: 設定済み', keyMissing: 'API キー: 未設定', running: 'Claude に問い合わせ中…', updated: '個のファイルを更新しました (* 付き)。',
    hint: '選択を変えると即プレビューされます。* は Claude が変更したファイルです。',
    overwrite: '個の既存ファイルを上書きします。よろしいですか?', overwriteBtn: '上書き保存', saved: 'ファイルを保存しました。', openFolder: 'フォルダを開く',
    keyBad: 'API キーを読み取れませんでした(1行目にキーだけを書いてください)。', keyLoaded: 'API キーを読み込みました(SecretStorage に保存、ファイルは変更していません)。', noKey: 'API キーが未設定です。',
    demoBanner: 'DEMO: ブラウザ上でテンプレートのプレビューと zip 保存が試せます。Claude 生成は VS Code 拡張で使えます。', demoGen: 'デモでは Claude 生成は使えません。VS Code 拡張をインストールして API キーを設定してください。', demoKey: 'デモでは API キーは使えません(VS Code 拡張で設定します)。', demoSaved: 'zip をダウンロードしました。',
    updAvail: "更新があります: v{v}(現在 v{c})。", updInstall: "今すぐ更新", updNotes: "リリースノート", updLater: "後で", updDone: "更新しました。再読み込みで反映されます。", updReload: "再読み込み", updNone: "最新です(v{v})。", updFail: "更新の確認に失敗しました: {e}", updNoChecksum: "チェックサムが無いため自動インストールできません。リリースページから手動で入れてください。", updBadChecksum: "チェックサムが一致しません。インストールを中止しました。",
    keyFallback: "このホストでは SecretStorage を使えないため、API キーをこの拡張の保存領域(暗号化なし)に保存しました。共有 PC では使わないでください。", protoMismatch: "ホストのプロトコル v{h} は、この UI の v{u} と互換性がありません。拡張を更新してください。",
  },
  en: {
    style: 'Style', frontend: 'Frontend', database: 'Database', gateway: 'Gateway', backend: 'Backend',
    save: 'Save to folder', setKey: 'Enter API key', loadKey: 'Load key from .txt', generate: 'Generate / refine with Claude', reset: 'Reset to template',
    stackPh: 'Describe the language, framework and what to build (e.g. Go + Gin + PostgreSQL ToDo API with a Dockerfile)',
    reqPh: 'Request for Claude (e.g. add user auth / add a price field to Item)  Ctrl+Enter to run',
    files: 'Files', copy: 'Copy', copied: 'Copied', openEditor: 'Open in editor',
    keyOk: 'API key: set', keyMissing: 'API key: not set', running: 'Asking Claude…', updated: ' file(s) updated (marked with *).',
    hint: 'Changing a selection previews instantly. * marks files changed by Claude.',
    overwrite: ' existing file(s) will be overwritten. Continue?', overwriteBtn: 'Overwrite', saved: 'Files saved.', openFolder: 'Open folder',
    keyBad: 'Could not read an API key (put only the key on the first line).', keyLoaded: 'API key loaded (stored in SecretStorage; the file was not modified).', noKey: 'API key is not set.',
    demoBanner: 'DEMO: preview templates and download a zip right in your browser. Claude generation works in the VS Code extension.', demoGen: 'Claude generation is not available in the demo. Install the VS Code extension and set your API key.', demoKey: 'API keys are not used in the demo (set them in the VS Code extension).', demoSaved: 'zip downloaded.',
    updAvail: "Update available: v{v} (current v{c}).", updInstall: "Update now", updNotes: "Release notes", updLater: "Later", updDone: "Updated. Reload to apply.", updReload: "Reload", updNone: "You are up to date (v{v}).", updFail: "Update check failed: {e}", updNoChecksum: "No checksum is published, so it cannot be installed automatically. Install it manually from the release page.", updBadChecksum: "Checksum mismatch. Installation aborted.",
    keyFallback: "SecretStorage is unavailable on this host, so the API key was stored in the extension storage (not encrypted). Do not use this on a shared computer.", protoMismatch: "Host protocol v{h} is not compatible with this UI (v{u}). Please update the extension.",
  },
  'zh-cn': {
    style: '方式', frontend: '前端', database: '数据库', gateway: '网关', backend: '后端',
    save: '保存到文件夹', setKey: '输入 API 密钥', loadKey: '从 txt 读取密钥', generate: '使用 Claude 生成/修改', reset: '恢复模板',
    stackPh: '用文字描述语言、框架和要做的东西（例：Go + Gin + PostgreSQL 的待办 API，并附 Dockerfile）',
    reqPh: '给 Claude 的需求（例：添加用户认证 / 给 Item 添加 price）  Ctrl+Enter 执行',
    files: '文件', copy: '复制', copied: '已复制', openEditor: '在编辑器中打开',
    keyOk: 'API 密钥：已设置', keyMissing: 'API 密钥：未设置', running: '正在询问 Claude…', updated: ' 个文件已更新（带 * 标记）。',
    hint: '更改选项会立即预览。带 * 的是 Claude 修改过的文件。',
    overwrite: ' 个现有文件将被覆盖，是否继续？', overwriteBtn: '覆盖保存', saved: '文件已保存。', openFolder: '打开文件夹',
    keyBad: '无法读取 API 密钥（第一行只写密钥）。', keyLoaded: '已读取 API 密钥（存入 SecretStorage，文件未被修改）。', noKey: '尚未设置 API 密钥。',
    demoBanner: '演示：可在浏览器中预览模板并下载 zip。Claude 生成功能请在 VS Code 扩展中使用。', demoGen: '演示中无法使用 Claude 生成。请安装 VS Code 扩展并设置 API 密钥。', demoKey: '演示中不使用 API 密钥（请在 VS Code 扩展中设置）。', demoSaved: '已下载 zip。',
    updAvail: "有可用更新：v{v}（当前 v{c}）。", updInstall: "立即更新", updNotes: "发行说明", updLater: "稍后", updDone: "已更新，重新加载后生效。", updReload: "重新加载", updNone: "已是最新版本（v{v}）。", updFail: "检查更新失败：{e}", updNoChecksum: "未提供校验和，无法自动安装。请从发布页面手动安装。", updBadChecksum: "校验和不匹配，已中止安装。",
    keyFallback: "此环境无法使用 SecretStorage，API 密钥已保存在扩展存储中（未加密）。请勿在共用电脑上使用。", protoMismatch: "宿主协议 v{h} 与此界面（v{u}）不兼容。请更新扩展。",
  },
  'zh-tw': {
    style: '方式', frontend: '前端', database: '資料庫', gateway: '閘道', backend: '後端',
    save: '儲存到資料夾', setKey: '輸入 API 金鑰', loadKey: '從 txt 讀取金鑰', generate: '使用 Claude 產生/修改', reset: '還原範本',
    stackPh: '用文字描述語言、框架與要做的東西（例：Go + Gin + PostgreSQL 的待辦 API，並附 Dockerfile）',
    reqPh: '給 Claude 的需求（例：新增使用者驗證 / 為 Item 新增 price）  Ctrl+Enter 執行',
    files: '檔案', copy: '複製', copied: '已複製', openEditor: '在編輯器中開啟',
    keyOk: 'API 金鑰：已設定', keyMissing: 'API 金鑰：未設定', running: '正在詢問 Claude…', updated: ' 個檔案已更新（標有 *）。',
    hint: '變更選項會立即預覽。標有 * 的是 Claude 修改過的檔案。',
    overwrite: ' 個既有檔案將被覆寫，是否繼續？', overwriteBtn: '覆寫儲存', saved: '檔案已儲存。', openFolder: '開啟資料夾',
    keyBad: '無法讀取 API 金鑰（第一行只寫金鑰）。', keyLoaded: '已讀取 API 金鑰（存入 SecretStorage，檔案未被修改）。', noKey: '尚未設定 API 金鑰。',
    demoBanner: '示範：可在瀏覽器預覽範本並下載 zip。Claude 產生功能請於 VS Code 擴充功能使用。', demoGen: '示範中無法使用 Claude 產生。請安裝 VS Code 擴充功能並設定 API 金鑰。', demoKey: '示範中不使用 API 金鑰（請於 VS Code 擴充功能設定）。', demoSaved: '已下載 zip。',
    updAvail: "有可用更新：v{v}（目前 v{c}）。", updInstall: "立即更新", updNotes: "版本資訊", updLater: "稍後", updDone: "已更新，重新載入後生效。", updReload: "重新載入", updNone: "已是最新版本（v{v}）。", updFail: "檢查更新失敗：{e}", updNoChecksum: "未提供檢查碼，無法自動安裝。請從發行頁面手動安裝。", updBadChecksum: "檢查碼不符，已中止安裝。",
    keyFallback: "此環境無法使用 SecretStorage，API 金鑰已儲存於擴充功能儲存區（未加密）。請勿在共用電腦上使用。", protoMismatch: "主機通訊協定 v{h} 與此介面（v{u}）不相容。請更新擴充功能。",
  },
  ko: {
    style: '방식', frontend: '프런트엔드', database: 'DB', gateway: '게이트웨이', backend: '백엔드',
    save: '폴더에 저장', setKey: 'API 키 입력', loadKey: 'txt에서 키 불러오기', generate: 'Claude로 생성/수정', reset: '템플릿으로 되돌리기',
    stackPh: '사용할 언어·프레임워크·만들고 싶은 것을 글로 입력 (예: Go + Gin + PostgreSQL ToDo API, Dockerfile 포함)',
    reqPh: 'Claude에게 요청 (예: 사용자 인증 추가 / Item에 price 추가)  Ctrl+Enter로 실행',
    files: '파일', copy: '복사', copied: '복사됨', openEditor: '에디터에서 열기',
    keyOk: 'API 키: 설정됨', keyMissing: 'API 키: 미설정', running: 'Claude에게 문의 중…', updated: '개 파일이 수정되었습니다(* 표시).',
    hint: '선택을 바꾸면 즉시 미리보기됩니다. *는 Claude가 변경한 파일입니다.',
    overwrite: '개의 기존 파일을 덮어씁니다. 계속할까요?', overwriteBtn: '덮어쓰기', saved: '파일을 저장했습니다.', openFolder: '폴더 열기',
    keyBad: 'API 키를 읽을 수 없습니다(첫 줄에 키만 작성하십시오).', keyLoaded: 'API 키를 불러왔습니다(SecretStorage에 저장, 파일은 변경되지 않음).', noKey: 'API 키가 설정되지 않았습니다.',
    demoBanner: '데모: 브라우저에서 템플릿 미리보기와 zip 다운로드를 체험할 수 있습니다. Claude 생성은 VS Code 확장에서 사용하십시오.', demoGen: '데모에서는 Claude 생성을 사용할 수 없습니다. VS Code 확장을 설치하고 API 키를 설정하십시오.', demoKey: '데모에서는 API 키를 사용하지 않습니다(VS Code 확장에서 설정).', demoSaved: 'zip을 다운로드했습니다.',
    updAvail: "업데이트가 있습니다: v{v} (현재 v{c}).", updInstall: "지금 업데이트", updNotes: "릴리스 노트", updLater: "나중에", updDone: "업데이트했습니다. 다시 로드하면 적용됩니다.", updReload: "다시 로드", updNone: "최신 버전입니다 (v{v}).", updFail: "업데이트 확인 실패: {e}", updNoChecksum: "체크섬이 없어 자동 설치할 수 없습니다. 릴리스 페이지에서 수동으로 설치하십시오.", updBadChecksum: "체크섬이 일치하지 않아 설치를 중단했습니다.",
    keyFallback: "이 호스트에서는 SecretStorage를 사용할 수 없어 API 키를 확장 저장소(암호화 없음)에 저장했습니다. 공용 컴퓨터에서는 사용하지 마십시오.", protoMismatch: "호스트 프로토콜 v{h}가 이 UI(v{u})와 호환되지 않습니다. 확장을 업데이트하십시오.",
  },
};
