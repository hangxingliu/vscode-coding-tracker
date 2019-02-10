module.exports = {
	cmd: {
		showReport: "檢視你的程式設計記錄報告",
		startLocalServer: "啟動本地記錄伺服器",
		stopLocalServer: "關閉本地記錄伺服器"
	},
	cfg: {
		uploadToken: "你的記錄伺服器的上傳Token",
		serverURL: "你的記錄伺服器的URL",
		computerId: [
			"你本機的標識(用於檢視報告的時候分辨不同的計算機)",
			"(預設值: 'unknown-${os.platform()}')"
		],
		localServerMode: [
			"伴隨VSCode啟動本地記錄伺服器",
			"(如果你希望儲存程式設計記錄到遠端伺服器, 請設定為false)"
		],
		moreThinkingTime: [
			"如果你認為你在程式設計時需要更多時間思考.",
			"(這個值越大, 你在報告頁面上看到的統計時間就越多)",
			"單位: 毫秒. 取值範圍: [-1500, +Infinity)"
		],
		showStatus: "在狀態列顯示狀態資訊",
		proxy: [
			"用於上傳記錄的網路代理.",
			'預設值: "auto" (將自動從選項 `http.proxy` 和系統環境變數中推斷代理資訊).',
			'這個選項的值也可以是: 一個代理伺服器的URL, false 或 "no-proxy"'
		]
	}
}
