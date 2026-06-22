/**
 * NextT × 盛德好 - 永續食農沙龍表單系統 (Google Apps Script)
 * 
 * 使用方式：
 * 1. 在您的 Google 試算表點選「擴充功能」->「Apps Script」。
 * 2. 清空原本的代碼，將此段程式碼完整複製貼上。
 * 3. 修改下方的 LINE_NOTIFY_TOKEN 為您申請的 LINE Notify 權杖。
 * 4. 點選「部署」->「新增部署」：
 *    - 類型選擇「網頁應用程式 (Web App)」。
 *    - 執行身分設定為「我 (您的 Google 帳號)」。
 *    - 誰有權生存取設定為「任何人 (Anyone)」（重要：這樣前台 HTML 才能免登入直接 POST 資料）。
 * 5. 複製生成的「網頁應用程式 URL」，將其填入您前端網頁 app.js 的 GOOGLE_SCRIPT_URL 變數中。
 */

// =================【個人設定區】=================
// 請至 LINE Notify 官網 (https://notify-bot.line.me/) 登入並「發行權杖」
const LINE_NOTIFY_TOKEN = "您的_LINE_NOTIFY_權杖_請貼在此處";
// ===============================================

function doPost(e) {
  try {
    const jsonString = e.postData.contents;
    const data = JSON.parse(jsonString);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (data.type === "kol") {
      // 處理盛德好 KOL 媒合登記
      let sheet = ss.getSheetByName("盛德好KOL登記");
      if (!sheet) {
        // 如果分頁不存在則自動建立，並寫入標頭
        sheet = ss.insertSheet("盛德好KOL登記");
        sheet.appendRow(["申請時間", "品牌名稱", "主打團購商品與方案", "分潤比例", "想媒合的KOL", "處理狀態"]);
        // 格式美化
        sheet.getRange("A1:F1").setFontWeight("bold").setBackground("#e0f2fe");
      }
      
      sheet.appendRow([
        data.time || new Date().toLocaleString(),
        data.brandName,
        data.propose,
        data.rate,
        data.kols,
        data.status || "待審核"
      ]);
      
      // 發送 LINE 通知
      sendLineNotification(
        `🔔 【盛德好 KOL 團購登記】\n` +
        `• 登記品牌：${data.brandName}\n` +
        `• 預計方案：${data.propose}\n` +
        `• 合作分潤：${data.rate}\n` +
        `• 欲合作 KOL：${data.kols}\n` +
        `• 填寫時間：${data.time || new Date().toLocaleString()}\n` +
        `--------------------\n` +
        `👉 請至 Google 試算表查看詳細資料！`
      );
      
    } else if (data.type === "cart") {
      // 處理消費者預購單
      let sheet = ss.getSheetByName("沙龍選物預購單");
      if (!sheet) {
        sheet = ss.insertSheet("沙龍選物預購單");
        sheet.appendRow(["下單時間", "姓名", "電話", "預購明細", "活化農地(坪)", "循環水(L)", "賸食格外品(kg)", "契作/青銀就業(人)"]);
        sheet.getRange("A1:H1").setFontWeight("bold").setBackground("#dcfce7");
      }
      
      sheet.appendRow([
        data.time || new Date().toLocaleString(),
        data.name,
        data.phone,
        data.itemsSummary,
        data.impact.land,
        data.impact.water,
        data.impact.waste,
        data.impact.jobs.toFixed(2)
      ]);
      
      // 發送 LINE 通知
      sendLineNotification(
        `🛒 【永續沙龍選物 - 新訂購單】\n` +
        `• 訂購人：${data.name} (${data.phone})\n` +
        `• 明細：\n${data.itemsSummary}\n` +
        `• 創造 ESG 價值：\n` +
        `  - 活化農地: ${data.impact.land} 坪\n` +
        `  - 循環水節省: ${data.impact.water} L\n` +
        `  - 格外品利用: ${data.impact.waste} kg\n` +
        `  - 契作青銀就業: ${data.impact.jobs.toFixed(2)} 人\n` +
        `--------------------\n` +
        `👉 請至試算表確認出貨事宜！`
      );
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data saved successfully" }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// 發送 LINE Notify 的輔助函式
function sendLineNotification(message) {
  if (!LINE_NOTIFY_TOKEN || LINE_NOTIFY_TOKEN.indexOf("您的_LINE_NOTIFY_權杖") > -1) {
    Logger.log("未設定有效的 LINE Notify Token，取消發送通知。");
    return;
  }
  
  const url = "https://notify-api.line.me/api/notify";
  const payload = {
    "message": message
  };
  
  const options = {
    "method": "post",
    "headers": {
      "Authorization": "Bearer " + LINE_NOTIFY_TOKEN
    },
    "payload": payload,
    "muteHttpExceptions": true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  Logger.log("LINE Notify 回傳：" + response.getContentText());
}
