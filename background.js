// 拡張アイコンがクリックされたときに実行される処理
chrome.action.onClicked.addListener((tab) => {

  // chrome.scripting.executeScript:
  // 指定したタブに JavaScript を注入して実行するAPI
  chrome.scripting.executeScript({

    // 実行対象のタブ
    // tab.id は「今クリックしたタブ」
    target: { tabId: tab.id },

    // 実行するスクリプトファイル
    // このJSがページDOM上で動く
    files: ["content.js"]
  });
});