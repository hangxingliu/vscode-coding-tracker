module.exports = {
	cmd: {
		showReport: "Show your coding activities report",
		startLocalServer: "Start tracking server in local",
		stopLocalServer: "Stop tracking server started in local"
	},
	cfg: {
		uploadToken: "Your tracker server upload token",
		serverURL: "Your tracker server URL",
		computerId: [
			"Your computer id(you can recognize different computer in report)",
			"(default value: 'unknown-${os.platform()}')"
		],
		localServerMode: [
			"Start tracking in local when VSCode start",
			"(set this option to false, if you want to upload tracking data to your remote server)"
		],
		moreThinkingTime: [
			"If you believe your thinking time in coding activity is long.",
			"(The bigger number you set the longer time you see in report page)",
			"Unit: milliseconds. Range: [-1500, +Infinity)"
		],
		showStatus: "Display tracker upload/server status on the status bar",
		proxy: [
			"Network proxy for uploading.",
			'"auto" is the default value, which use proxy from config `http.proxy` and system environments.',
			'And you can use a proxy URL, false or "no-proxy" as the value'
		]
	}
}
