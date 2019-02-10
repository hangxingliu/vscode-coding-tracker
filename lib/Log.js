//@ts-check
/// <reference path="./index.d.ts" />

const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');

const ENABLE_LOG_FILE = true;

const PREFIX = 'coding-tracker';
const DEBUG_LOG_DIR = path.join(__dirname, '..', 'logs');
const DEBUG_SIGN_FILE = path.join(__dirname, '..', 'DEBUG_SIGN_FILE');
const DEBUG_MODE = isDebugMode();

const logger = {
	debugMode: DEBUG_MODE,

	error: (...msg) => console.error(PREFIX, ...msg),
	warn: (...msg) => console.warn(PREFIX, ...msg),
	debug: (...msg) => void msg,
	end: () => void 0,
};

if (DEBUG_MODE) {
	const vscode = require('vscode');
	const logStream = ENABLE_LOG_FILE && getDebugLogFileStream();

	logger.error = (...msg) => {
		console.error(PREFIX, ...msg);
		vscode.window.showErrorMessage(`${PREFIX}: ${msg.join(' ')}`);
		if(logStream) logStream.write('-ERROR', ...msg);
	};
	logger.warn = (...msg) => {
		console.warn(PREFIX, ...msg);
		vscode.window.showWarningMessage(`${PREFIX}: ${msg.join(' ')}`);
		if(logStream) logStream.write('-WARN', ...msg);
	};
	logger.debug = (...msg) => {
		console.log(PREFIX, ...msg);
		if(logStream) logStream.write('', ...msg);
	};
	logger.end = () => { if (logStream) logStream.end(); };
}

module.exports = logger;

function isDebugMode() { try { return fs.existsSync(DEBUG_SIGN_FILE) } catch (_) { return false;} }
function getDebugLogFileStream() {
	try {
		if (!fs.existsSync(DEBUG_LOG_DIR))
			fs.mkdirSync(DEBUG_LOG_DIR);
	} catch (error) {
		logger.error(`create debug log dir (${DEBUG_LOG_DIR}) failed!`, error);
		return;
	}
	const now = new Date();
	const rand = uuid();
	const id = rand.slice(rand.length - 12);
	const file = padding(now.getFullYear()) + padding(now.getMonth() + 1) + padding(now.getDate()) +
		padding(now.getHours()) + '.log';

	/** @type {fs.WriteStream} */
	let stream;
	let streamErrorOccurred = false;
	try {
		stream = fs.createWriteStream(path.join(DEBUG_LOG_DIR, file), { flags: 'a' });
		stream.on('error', onStreamError);
	} catch (error) {
		logger.error(`create debug log file stream (${file}) failed!`, error);
		return;
	}
	logger.debug(`created debug log file stream: ${file}`);
	return {
		/** @param {string} type */
		write: (type, ...data) => {
			if (!stream) return;
			stream.write(data.map(it => {
				if (Buffer.isBuffer(it)) return it.toString();
				if (it && it.stack) return String(it.stack);
				return String(it);
			}).join('\t').split('\n').map(it => `${id}${type}:\t${it}`).join('\n') + '\n', noop);
		},
		end: () => endStream(),
	};

	function noop() { }
	function padding(num) {
		return 10 > num ? `0${num}` : `${num}`;
	}
	function endStream() {
		try { if (stream) stream.end(); } catch (error) { void error; }
		stream = undefined;
	}
	function onStreamError(error) {
		if (streamErrorOccurred) return;
		streamErrorOccurred = true;
		logger.error('debug log file stream error:', error);
	}
}
