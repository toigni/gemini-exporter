(() => {
  // 1. 質問と回答の候補となる要素をすべて取得
  const chatElements = [...document.querySelectorAll("user-query, .query-text, model-response")];

  if (chatElements.length === 0) {
    alert("内容が見つかりません。");
    return;
  }

  const seenTexts = new Set(); // 重複チェック用のセット
  const formattedChatParts = [];

  chatElements.forEach(el => {
    // クローンを作成して編集
    const clone = el.cloneNode(true);

    // 不要な要素を削除
    const selectorsToRemove = [
      "svg", "img", "button", ".tts-button", ".tts-button-container", 
      ".mat-mdc-icon-button", ".mdc-icon-button", ".response-tts-container",
      ".mat-mdc-button-touch-target", ".mat-focus-indicator", 
      ".mdc-icon-button__ripple", "[aria-hidden='true']", ".model-response-footer",
      ".action-wrapper" // 編集ボタンなどのラッパー
    ];
    selectorsToRemove.forEach(sel => {
      clone.querySelectorAll(sel).forEach(target => target.remove());
    });

    // テキスト内容を抽出（重複チェック用）
    const textContent = clone.innerText.trim();
    
    // 内容が空、または既に同じ内容を処理済みの場合はスキップ
    if (!textContent || seenTexts.has(textContent)) {
      return;
    }
    seenTexts.add(textContent);

    // 質問か回答かの判定
    const isUser = el.tagName.toLowerCase().includes("user") || 
                   el.classList.contains("query-text") ||
                   el.closest(".user-query-container") !== null;
    
    const typeClass = isUser ? "user-query" : "model-response";
    const label = isUser ? "【質問】" : "【回答】";

    formattedChatParts.push(`
      <div class="chat-item ${typeClass}">
        <div class="label">${label}</div>
        <div class="content">${clone.innerHTML}</div>
      </div>
    `);
  });

  const htmlResult = formattedChatParts.join("");

  // 3. 出力
  const win = window.open();
  win.document.write(`
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>Gemini Conversation Export</title>
<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.4; /* 行間を少し詰め気味に設定 */
  color: #333;
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
  background-color: #f5f5f5;
}
h1 { font-size: 1.2em; color: #444; border-bottom: 2px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; }
.chat-item {
  margin-bottom: 12px; /* アイテム間の隙間を削減 */
  padding: 12px 18px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.user-query {
  border-left: 5px solid #4285f4;
  background-color: #f0f7ff;
}
.model-response {
  border-left: 5px solid #34a853;
  background-color: #ffffff;
}
.label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.8em;
  color: #666;
}
.content {
  word-wrap: break-word;
}
.content p { margin: 0.4em 0; } /* 段落間の隙間を削減 */
.content ul, .content ol { padding-left: 1.5em; margin: 0.4em 0; }
.content li { margin-bottom: 0.1em; }

@media print {
  body { background-color: #fff; margin: 0; line-height: 1.2; }
  .chat-item { 
    box-shadow: none; 
    border: 1px solid #eee; 
    border-left-width: 5px;
    page-break-inside: avoid;
    margin-bottom: 10px;
    padding: 8px 15px;
  }
  .label { color: #000; }
}
</style>
</head>
<body>
  <h1>Gemini 会話ログ抽出</h1>
  ${htmlResult}
</body>
</html>
  `);
  win.document.close();
})();