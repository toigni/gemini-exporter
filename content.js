(() => {
  // 1. Geminiの回答を取得
  const responses = [...document.querySelectorAll("model-response")];

  if (responses.length === 0) {
    alert("回答が見つかりません");
    return;
  }

  responses.forEach(response => {
    // --- 画像・SVG ---
    response.querySelectorAll("svg, img").forEach(el => el.remove());

    // --- TTS関連ボタン ---
    response.querySelectorAll(
      "button, .tts-button, .tts-button-container, .mat-mdc-icon-button, .mdc-icon-button"
    ).forEach(el => el.remove());

    // --- 問題の空白コンテナ（これが本体） ---
    response.querySelectorAll(
      ".response-tts-container"
    ).forEach(el => el.remove());

    // --- Angular Material装飾 ---
    response.querySelectorAll(
      ".mat-mdc-button-touch-target, .mat-focus-indicator, .mdc-icon-button__ripple"
    ).forEach(el => el.remove());

    // --- aria-hidden装飾 ---
    response.querySelectorAll("[aria-hidden='true']").forEach(el => el.remove());

    // --- 念のため inline height を無効化（保険） ---
    response.querySelectorAll("[style]").forEach(el => {
      if (el.style.height) {
        el.style.height = "auto";
        el.style.minHeight = "0";
      }
    });
  });

  // 2. HTML生成
  const html = responses.map(r => r.innerHTML).join("<hr>");

  // 3. 出力
  const win = window.open();
  win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Gemini Answers</title>
<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
               Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
}

/* ===== 印刷時に行間を詰める ===== */
@media print {
  body {
    line-height: 1.25;      /* ← 行間を詰める核心 */
  }

  p {
    margin: 0.2em 0;        /* ← 段落間を最小限に */
  }

  li {
    margin: 0.15em 0;
  }

  ul, ol {
    margin: 0.3em 0 0.3em 1.2em;
  }

  pre {
    margin: 0.4em 0;
    line-height: 1.25;
  }

  h1, h2, h3 {
    margin: 0.8em 0 0.4em 0;
  }

  br {
    display: none;          /* ← 無駄な改行を抑制 */
  }
}
</style>
</head>
<body>
${html}
</body>
</html>
  `);

  win.document.close();
})();