# 【餐桌上的永續影響力】NextT × 盛德好 永續食農沙龍網頁

本專案為 NextT × 盛德好 永續食農選物沙龍的互動展示網頁，包含：
1. **沙龍選物體驗 (`index.html`)**：具備互動式餐桌點擊、格外品/永續故事展示、YouTube 影片燈箱、購物車下單及 ESG 影響力累計功能。
2. **KOL 合作專區 (`index.html` 內頁籤)**：業者輸入密碼 `nextt` 後，可勾選 3 位精選 KOL 並填寫團購方案，即時登記媒合。
3. **後台管理系統 (`admin.html`)**：供 NextT 管理員使用，包含 AI 智能品牌故事精煉、資料即時同步發佈、及 KOL 媒合申請管理。

---

## 🚀 如何將此網頁部署至 GitHub Pages (免費靜態網頁託管)

您可以將此專案推送到 GitHub，並啟用 **GitHub Pages**，這樣小農或消費者就可以直接透過手機或電腦網址線上開啟網頁！

### 第一步：在 GitHub 上建立新的 Repository (儲存庫)
1. 登入您的 [GitHub 帳號](https://github.com/)。
2. 點選右上角的 **「+」** -> **「New repository」**。
3. 設定 Repository 資訊：
   - **Repository name**：輸入專案名稱（例如：`nextt-sustainable-salon`）。
   - **Public/Private**：請選擇 **Public**（公開，這樣才能使用免費的 GitHub Pages）。
   - 不要勾選 Add a README file 或 .gitignore。
4. 點擊 **「Create repository」**。
5. 複製生成的 Git 連線網址（例如：`https://github.com/您的帳號/nextt-sustainable-salon.git`）。

### 第二步：使用 Git 推送代碼
開啟您的終端機 (PowerShell 或 Git Bash)，切換到此專案資料夾並執行以下指令：

```bash
# 初始化 Git
git init

# 將所有檔案加入暫存區
git add .

# 提交第一次 commit
git commit -m "Initial commit - NextT sustainable salon prototype"

# 重新命名分支為 main
git branch -M main

# 關聯到您剛才建立的 GitHub 遠端儲存庫 (請替換為您剛才複製的網址)
git remote add origin https://github.com/您的帳號/nextt-sustainable-salon.git

# 推送到 GitHub
git push -u origin main
```

### 第三步：開啟 GitHub Pages 網頁
1. 回到您的 GitHub Repository 頁面。
2. 點選上方選單的 **「Settings」 (設定)**。
3. 在左側選單找到 **「Pages」**。
4. 在 **Build and deployment** 下方的 **Branch**：
   - 將原本的 `None` 改選為 **`main`**。
   - 後方資料夾保持選擇 **`/ (root)`**。
   - 點選 **「Save」 (儲存)**。
5. 靜待約 1-2 分鐘，重新整理該頁面，上方會出現您的專屬網址，格式如下：
   `https://您的帳號.github.io/nextt-sustainable-salon/`

點擊該網址，即可在線上使用您的前台網頁！

---

## 🛠️ 開發與設定說明
* **資料同步**：本專案前台與後台使用瀏覽器 `localStorage` 進行本地聯動。
* **雲端串接**：若要進行真實線上資料收集，請參考資料夾中的 [deployment_guide.md](deployment_guide.md) 設定 Google Apps Script 與 LINE Notify 通知。
