# 小小發聲器 — GitHub Pages 版本

這是可直接上傳到 GitHub Pages 的靜態網站。無需 Node.js、資料庫、伺服器或付費服務。

## 一、上傳網站

1. 登入 GitHub，建立一個新的 Repository，例如 `little-voice`。
2. 解壓縮本 ZIP，將其中 **所有檔案** 上傳到 Repository 的**根目錄**（不要只上傳 ZIP，也不要把檔案包在另一層資料夾內）。
3. 在 GitHub Repository 的 **Settings → Pages** 中，將 **Build and deployment** 的 Source 設為 **Deploy from a branch**。
4. 選擇 **main** 分支以及 **/(root)** 資料夾，按 **Save**。
5. 等待 GitHub Pages 完成部署，開啟頁面顯示的網址。一般格式為：
   `https://你的帳號.github.io/little-voice/`
6. iPad、iPhone 或 Android 用瀏覽器開啟該網址即可使用。

## 二、包含的檔案

- `index.html`：主要介面、滾輪選字、語音朗讀、快速說話。
- `editor.js`：新增、修改、刪除詞彙與常用句。
- `backup.js`：JSON 詞庫匯出與匯入。
- `manifest.webmanifest`：網頁應用程式設定。
- `sw.js`：離線快取功能。
- `.nojekyll`：讓 GitHub Pages 直接發佈靜態檔案。

請保留這些檔案的原始名稱及相對位置。

## 三、使用與資料注意事項

- 網站本身可在手機、平板上使用。音訊採用裝置內建的繁體中文語音合成；聲音及自動朗讀效果會因瀏覽器而異。
- 自訂詞庫儲存於**各裝置各瀏覽器**的 localStorage，並不會隨 GitHub 同步。
- 如需跨裝置搬移詞庫，使用「管理詞彙與常用句」內的「匯出詞庫」與「匯入詞庫」。
- 匯入會取代該裝置現有詞庫，建議先匯出備份。
- 首次開啟網站需要網路；日後可能使用快取離線開啟，但離線語音仍取決於裝置語音系統。
- 網站程式碼若放在公開 Repository，任何人都可以看到程式碼；**自訂詞庫不會被上傳到 GitHub**。

## 四、後續更新

以更新後的同名檔案取代 GitHub Repository 根目錄中的檔案即可。更新 `sw.js` 時請同步更改 CACHE 版本名稱（例如 v4），讓已安裝裝置取得新版快取。
