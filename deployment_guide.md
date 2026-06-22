# 🚀 NextT × 盛德好 永續食農沙龍 - 雲端串接與 LINE 通知部署指南

此指南將引導您將目前在 OneDrive 的網頁原型（前台與後台）對接到您的 **Google 試算表 (Google Sheet)**，並設定當有小農登記或消費者下單時，自動發送 **LINE 訊息** 通知您與夥伴。

---

## 步驟一：申請免費的 LINE Notify 權杖 (Token)

這是用來讓系統能自動傳訊息到您的 LINE 群組：

1. 電腦瀏覽器開啟 [LINE Notify 官方網站](https://notify-bot.line.me/)。
2. 使用您的 **LINE 帳號密碼** 登入。
3. 點選右上角您的名稱，選擇 **「個人頁面」 (My Page)**。
4. 下拉找到並點選 **「發行權杖」 (Generate token)**。
5. 設定權杖內容：
   - **名稱**：填寫您想在 LINE 上顯示的機器人名字（例如：`盛德好媒合助理`）。
   - **群組**：選擇您要發送通知的「群組」（例如您與夥伴的 NextT 工作群組），或選擇「透過1對1聊天接收」來自己測試。
6. 點擊 **「發行」**，系統會產生一串很長的英文與數字混合密碼。
7. ⚠️ **重要**：請立刻將這串密碼**「複製」並找地方存起來**。它只會出現一次，關閉視窗後就無法再看到了！

---

## 步驟二：在 Google 試算表設定 Apps Script

1. 開啟您的 Google 試算表（也就是您之前分享連結的那份）。
2. 在上方選單點選 **「擴充功能」 (Extensions)** -> **「Apps Script」**。
3. 進入編輯畫面後，將原本預設的程式碼清空。
4. 打開您電腦中 OneDrive 資料夾內的 [google-apps-script.js](file:///C:/Users/manma/OneDrive/Documents/Antigrivity/NextT/google-apps-script.js) 檔案。
5. 將裡面的程式碼 **全部複製**，貼上到 Apps Script 的編輯器中。
6. 找到程式碼第 18 行：
   ```javascript
   const LINE_NOTIFY_TOKEN = "您的_LINE_NOTIFY_權杖_請貼在此處";
   ```
   將雙引號內的文字替換為您在**步驟一**申請到的 LINE Notify 權杖，例如：
   ```javascript
   const LINE_NOTIFY_TOKEN = "xyz123abc456...";
   ```
7. 點選上方存檔按鈕（💾 磁碟片圖示）。

---

## 步驟三：將 Apps Script 部署為 Web App

為了讓網頁能把資料傳進來，我們必須將這個 Script 發佈成公開 API：

1. 在 Apps Script 編輯器右上角，點選 **「部署」 (Deploy)** -> **「新增部署」 (New deployment)**。
2. 點選左上角「選取類型」的齒輪圖示，選擇 **「網頁應用程式」 (Web app)**。
3. 設定部署參數：
   - **說明**：填寫 `盛德好KOL與預購串接`。
   - **委託身分 (Execute as)**：選擇 **「我」 (Me)**。
   - **誰有權限存取 (Who has access)**：選擇 **「任何人」 (Anyone)** 👈 *這步非常重要，否則前台網頁會因為權限問題無法送出！*
4. 點選下方 **「部署」**。
5. 首次部署時，Google 會彈出視窗要求授權：
   - 點擊 **「授予存取權」**。
   - 選擇您的 Google 帳號。
   - 會出現「Google 未核對此應用程式」的安全性警告，請點選左下角的 **「進階」 (Advanced)**。
   - 點選 **「前往「未命名專案」(不安全)」**。
   - 點選 **「允許」 (Allow)**。
6. 部署成功後，會顯示 **「網頁應用程式 URL」**（結尾是 `/exec` 結尾的長網址）。
7. 請 **複製此網頁應用程式 URL**。

---

## 步驟四：在前端 app.js 中啟用串接

1. 打開您的 OneDrive 檔案：[app.js](file:///C:/Users/manma/OneDrive/Documents/Antigrivity/NextT/app.js)（建議使用記事本或 VS Code 等文字編輯器開啟）。
2. 在 `app.js` 的最前面（或搜尋 `GOOGLE_SCRIPT_URL`），您會看到以下代碼：
   ```javascript
   // Google Apps Script Web App URL (Deploy as Web App, set Who Has Access to Anyone)
   // Paste your Web App URL here once deployed. If empty, it will default to LocalStorage only.
   const GOOGLE_SCRIPT_URL = "";
   ```
3. 將您剛才在**步驟三**複製的 Web App URL 貼入雙引號中，例如：
   ```javascript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby.../exec";
   ```
4. 存檔 `app.js`。

---

## 🎉 完成！開始測試聯動

現在，您的整個系統已經活化了：

1. **消費者預購測試**：
   - 開啟前台 [index.html](file:///C:/Users/manma/OneDrive/Documents/Antigrivity/NextT/index.html)。
   - 在商品型錄加入幾個茶點至選物籃。
   - 輸入姓名電話，點擊「確認送出預購訂單」。
   - **結果**：您的 Google 試算表會自動多出一個名為 **「沙龍選物預購單」** 的分頁，資料會自動新增進去！同時您的 LINE 群組會收到詳細的消費者訂單與 ESG 計算價值推播。

2. **KOL 媒合登記測試**：
   - 在前台的「KOL 合作專區」輸入密碼解鎖，勾選 KOL 並送出登記。
   - **結果**：您的 Google 試算表會自動多出一個名為 **「盛德好KOL登記」** 的分頁，資料寫入！並且 LINE 也會立刻收到這筆登記通知！

*(如果您有將 LINE Notify 帳號加入您設定的 LINE 工作群組，群組內的所有人將會同步收到這些通知，非常適合團隊一起追蹤小農的參與進度！)*
