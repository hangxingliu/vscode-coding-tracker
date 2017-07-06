/**
 * This module is about:
 *	1. launch a local tracking server
 *  2. Passing a local tracking server from other VSCode windows context
 *		- (It means stop local tracking server running in other VSCode windows context, and start a new in this windows)
 *  3. Stop a local tracking server
 *  4. Open tracking server report page
 *  
 */

//default open new server listening 10345 port
const DEFAULT_PORT = 10345;
//Just a true const value(for readability)
const SILENT_START_SERVER = true;

//som parameters for start local server
const EXECUTE_CWD = `${__dirname}/../node_modules/vscode-coding-tracker-server/`,
	EXECUTE_BIN_FILE = 'node',
	EXECUTE_PARAMETERS = ['./app',
		'--local',
		'--debug',
		'--public-report',
		`-o`,`${process.env.USERPROFILE||process.env.HOME}/.coding-tracker/`,
		`--port={0}`,
		`--token={1}`
	];


var URL = require('url'),
	request = require('request'),
	log = require('./OutputChannelLog'),
	statusBar = require('./StatusBarManager'),
	{ spawn, exec } = require('child_process'),	
	vscode = require('vscode'),
	ext = require('./VSCodeHelper')

//User config read from vscode configurations
var userConfig = {
	url: '',
	token: '',
	localMode: false
};

//Is local server running under this windows context
var isLocalServerRunningInThisContext = false;
//An child_process spawn object
var serverChildProcess;


//init function.
//it will be call when extension active
function init(extensionContext) {
	var {subscriptions} = extensionContext;
	//Register commands
	subscriptions.push(vscode.commands.registerCommand('codingTracker.showReport', showReport));
	subscriptions.push(vscode.commands.registerCommand('codingTracker.startLocalServer', () => startLocalServer()));
	subscriptions.push(vscode.commands.registerCommand('codingTracker.stopLocalServer', () => stopLocalServer()));

	//Read user config
	userConfig = _readUserConfig();
	
	//if turn on local mode
	if (userConfig.localMode) {
		//Kill/stop old server by requesting /ajax/kill
		log.d(`[LocalMode]: try to kill old tracking server...`);
		request.get(_getKillURL(), { qs: { token: userConfig.token } }, (err, res, bd) => {
			if (err) {
				log.d(`[LocalMode]: there are no old tracking server, just opening a new local server...`);
				return startLocalServer(true);// start a new server
			}
			var result = {};
			try { result = JSON.parse(bd); } catch (e) { log.e('[Error]: parse JSON failed!'); }
			if (result.success) {
				log.d('[Killed]: killed old server! and opening a new local server...');
				return startLocalServer(true); //start a new server
			} else {
				log.d(`[Response]: ${bd}`);
				(result.error || '').indexOf('local') >= 0 ?
					_showError(`start local mode failed!(because the existed server is not a local server)`, { stack: 'Not a local server!' }) :
					_showError(`start local mode failed!(because your token is invalid for existed server)`, { stack: 'token is invalid' });
			}
		});
	}
}

//This function will be call when vscode configurations changed
function updateConfig() {
	var newConfig = _readUserConfig();
	//If the local server is running in this windows and related configurations changed
	// then show a information tip "please reload VSCode"
	if (isLocalServerRunningInThisContext) {
		var shouldToastReloadVSCode = false;
		if (userConfig.localMode) {
			if (userConfig.token != newConfig.token || userConfig.url != newConfig.url || newConfig.localMode == false)
				shouldToastReloadVSCode = true;
		} else if (newConfig.localMode == true) {
			shouldToastReloadVSCode = true;
		}
		log.d(`[ConfigChanged]: please reload vscode to apply it.`);
		shouldToastReloadVSCode && vscode.window.showInformationMessage(
			`CodingTracker: detected your local server configurations changed. Please reload VSCode to apply.`);
	}
	//save new configurations 
	userConfig = newConfig;
}

//Start a new local server in this windows context
//silent == true: there will no any success message box display to user(but user still could see exception info if start failed)
function startLocalServer(silent) {
	var s = spawn(EXECUTE_BIN_FILE, _getLaunchParameters(), { cwd: EXECUTE_CWD });
	s.stdout.setEncoding('utf8');
	s.stderr.setEncoding('utf8');
	s.stdout.on('data', data => log.d(data));
	s.stderr.on('data', data => log.e(`[Error]: ${data}`));
	s.on('error', err => {
		isLocalServerRunningInThisContext = false;
		serverChildProcess = null;
		_showError(`start local server failed!`, err);
	});
	// s.on('exit', code => '"exit" event could not indicated child_process fully exit'+
	// 	'child process maybe create a new child_process, just like `npm start`');
	s.on('close', (code, signal) => {
		isLocalServerRunningInThisContext = false;
		serverChildProcess = null;
		code && _showError(`local server exit with code ${code}!(have you launch another local sever?)`, {
			stack: `[Exit] exit code: ${code}`
		});
	});
	serverChildProcess = s;
	isLocalServerRunningInThisContext = true;
	log.d(`[Launch]: Local server launching...`);
	_checkIsLocalServerStart(silent, 0, false);
}

/**
 * Check is the local server started by requesting welcome information page
 * 
 * @param {boolean} silent  : if local server started, there are no any message
 * @param {number} times   : how many times retry
 * @param {boolean} isActiveCheck   : is this calling from active heart beat (It will be change log content)
 * @returns  
 */
function _checkIsLocalServerStart(silent, times, isActiveCheck) {
	if (times >= 10) return statusBar.localServer.turnOff();
	_checkConnection((networkErr, serverErr, result) => {
		if (result) {
			if (result.localServerMode) {
				silent || vscode.window.showInformationMessage(`CodingTracker: local server started!`);
				isActiveCheck ? log.d(`[Heartbeat]: server in local!`) :
					log.d(`[Launched]: Local server has launching!`);
				statusBar.localServer.turnOn();
			} else {
				statusBar.localServer.turnOff();
			}
		} else if (!networkErr) {
			//connect success, but not local server
			return;
		} else {
			setTimeout(() => _checkIsLocalServerStart(silent, times + 1, isActiveCheck), 800);
		}
	})
}

//Stop local server by requesting API /ajax/kill
function stopLocalServer() {
	log.d(`[Kill]: try to kill local server...`);
	request.get(_getKillURL(), { qs: { token: userConfig.token } }, (err, res, bd) => {
		if (err) return _showError(`kill failed, because could not connect local server`, err);
		var result = {};
		try { result = JSON.parse(bd); } catch (e) { log.e('[Error]: parse JSON failed!'); }
		if (result.success) {
			statusBar.localServer.turnOff()
			log.d(`[Killed]: killed local server!`);
			vscode.window.showInformationMessage(`CodingTracker: local server stopped!`);
		} else {
			log.d(`[Response]: ${bd}`);
			(result.error || '').indexOf('local') >= 0 ?
				_showError(`stop failed!(because this server is not a local server)`, { stack: 'Not a local server!' }) :
				_showError(`stop failed!(because your token is invalid)`, { stack: 'token is invalid' });
		}
	});
}

//Stop local server running in this window by child process tree killing
function stopLocalServerSilentByTreeKill() {
	log.d('[Kill]: try to kill local server by tree kill way...');
	if (serverChildProcess && serverChildProcess.pid)
		require('tree-kill')(serverChildProcess.pid);
	serverChildProcess = null;
}

//Open your coding time report page
function showReport() {
	exec(_getOpenReportCommand(), err =>
		err && _showError(`Execute open report command error!`, err));
}

//check is the server connectable
//then(networkError, serverError, responseBody)
function _checkConnection(then) {
	request.get(_getWelcomeURL(), {}, (err, res, bd) => {
		if (err) return then(err);
		if (res.statusCode != 200) return then(null, `server exception!(${res.statusCode})`);
		try { var result = JSON.parse(bd); } catch (e) { return then(null, `server exception!(illegal welcome json)`); }
		return then(null, null, result);
	});
}

//Generate command for open report page in different OS
function _getOpenReportCommand() {
	const openURLIn = {
		win32: url => `start "" "${url}"`,
		darwin: url => `open "${url}"`,
	};
	return (openURLIn[process.platform] || (url => `xdg-open "${url}"`))(_getReportURL());
}
function _getReportURL() { return `${userConfig.url}/report/` }
function _getTestURL() { return `${userConfig.url}/ajax/test` }
function _getWelcomeURL() { return `${userConfig.url}/` }
function _getKillURL() { return `${userConfig.url}/ajax/kill` }
function _readUserConfig() {
	var configurations = ext.getConfig('codingTracker'),
		token = String(configurations.get('uploadToken')),
		url = String(configurations.get('serverURL')),
		localMode = Boolean(configurations.get('localServerMode'));
	url = url.endsWith('/') ? url.slice(0, -1) : url;
	return { url, token, localMode };
}

function _showError(errOneLine, errObject) {
	const MENU_ITEM_TEXT = 'Show details'
	log.e(`[Error]: ${errOneLine}\n${errObject.stack}`);
	vscode.window.showErrorMessage(`CodingTracker: ${errOneLine}`, MENU_ITEM_TEXT).then(item =>
		item == MENU_ITEM_TEXT ? log.show() : 0);
}
function _getLaunchParameters() {
	var ps = [];
	for (let i = 0; i < EXECUTE_PARAMETERS.length; i++)
		ps.push(EXECUTE_PARAMETERS[i]
			.replace('{0}', _getPortInfoFromURL(userConfig.url))
			.replace('{1}', userConfig.token));
	return ps;
}
function _getPortInfoFromURL(url) { return URL.parse(url).port || DEFAULT_PORT; }

module.exports = {
	init,
	updateConfig,
	activeCheckIsLocalServerStart: () => _checkIsLocalServerStart(true, 9, true),
	detectOldSever_SoStartANewIfUnderLocalMode: () => {
		if (!userConfig.localMode)
			return false;
		log.d('[Launch]: launching a new tracking server because detected old server exited!');
		startLocalServer(SILENT_START_SERVER);
		return true;
	},
	dispose: stopLocalServerSilentByTreeKill
};
