module.exports = {
	cmd: {
		showReport: "Mostrar informe de su actividad de programación",
		startLocalServer: "Iniciar el servidor de seguimiento en local",
		stopLocalServer: "Detener el servidor de seguimiento local"
	},
	cfg: {
		uploadToken: "El token para subir datos a su servidor de seguimiento",
		serverURL: "La URL de tu servidor",
		computerId: [
			"La identificación de tu computadora (Se utiliza para reconocer diferentes computadoras en la página del informe.)",
			"(valor por defecto: 'unknown-${os.platform()}')"
		],
		localServerMode: [
			"Iniciar el servidor de seguimiento en local cuando se inicia VSCode",
			"(Configure esta opción en false, si desea cargar datos de seguimiento en su servidor remoto)"
		],
		moreThinkingTime: [
			"Si crees que tu tiempo de pensar en la actividad de codificación es largo.",
			"(Cuanto mayor sea el número que establezca, más tiempo verá en la página del informe)",
			"Unidad: milisegundos. Distancia: [-1500, +Infinity)"
		],
		showStatus: "Mostrar el estado del rastreador en la barra de estado",
		proxy: [
			"Proxy de red para subir.",
			'"auto" es el valor predeterminado (Significa usar proxy desde config `http.proxy` y entornos de sistema)',
			'Puede configurarlo en una URL de proxy, falso o "no-proxy"'
		]
	}
}
