module.exports = {
	cmd: {
		showReport: "Показать отчет",
		startLocalServer: "Запустить локальный сервер",
		stopLocalServer: "Остановить локальный сервер"
	},
	cfg: {
		uploadToken: "Ваш токен",
		serverURL: "URL сервера",
		computerId: [
			"Id вашего компьютера",
			"(стандартное значение: 'unknown-${os.platform()}')"
		],
		localServerMode: [
			"Начинать отслеживание локально при запуске VSCode",
			"(выключите это, если вы хотите сохранять данные на удаленный сервер"
		],
		moreThinkingTime: [
			"Если вы думаете, что время обдумывания во время программирования у вас продолжительное.",
			"(Чем больше число вы установите, тем больше число вы получите в отчете)",
			"Мера измерений: milliseconds. Диапазон: [-1500, +Infinity)"
		],
		showStatus: "Отображение состояния трекера (Загрузка / сервер) в строке состояния",
		proxy: [
			"Network proxy for uploading.",
			'"auto" is the default value, which use proxy from config `http.proxy` and system environments.',
			'And you can use a proxy URL, false or "no-proxy" as the value'
		]
	}
}
