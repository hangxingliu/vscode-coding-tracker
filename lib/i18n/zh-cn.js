module.exports = {
	cmd: {
		showReport: "查看你的编程记录报告",
		startLocalServer: "启动本地记录服务器",
		stopLocalServer: "关闭本地记录服务器"
	},
	cfg: {
		uploadToken: "你的记录服务器的上传Token",
		serverURL: "你的记录服务器的URL",
		computerId: [
			"你本机的标识(用于查看报告的时候分辨不同的计算机)",
			"(默认值: 'unknown-${os.platform()}')"
		],
		localServerMode: [
			"伴随VSCode启动本地记录服务器",
			"(如果你希望保存编程记录到远端服务器, 请设置为false)"
		],
		moreThinkingTime: [
			"如果你认为你在编程时需要更多时间思考.",
			"(这个值越大, 你在报告页面上看到的统计时间就越多)",
			"单位: 毫秒. 取值范围: [-1500, +Infinity)"
		],
		showStatus: "在状态栏显示状态信息",
		proxy: [
			"用于上传记录的网络代理.",
			'默认值: "auto" (将自动从选项 `http.proxy` 和系统环境变量中推断代理信息).',
			'这个选项的值也可以是: 一个代理服务器的URL, false 或 "no-proxy"'
		]
	}
}
