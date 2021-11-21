//@ts-check
/// <reference path="./index.d.ts" />
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { isDebugMode, prefix } = require('./Constants');

/** @type {(...args) => void} */
const noop = () => { };

const logger = {
	error: (...msg) => console.error(prefix, ...msg),
	warn: (...msg) => console.warn(prefix, ...msg),
	debug: noop,
	end: noop,
};

if (isDebugMode)
	setupDebugLogger();

module.exports = logger;


//#====================================
//#region module private functions

/**
 * Setup logger to debug mode (show message box, write log to file)
 */
function setupDebugLogger() {
	const vscode = require('vscode');
	const logStream = getDebugLogFileStream();

	logger.error = (...msg) => {
		console.error(prefix, ...msg);
		vscode.window.showErrorMessage(`${prefix}: ${msg.join(' ')}`);
		if (logStream)
			logStream.write('-ERROR', ...msg);
	};
	logger.warn = (...msg) => {
		console.warn(prefix, ...msg);
		vscode.window.showWarningMessage(`${prefix}: ${msg.join(' ')}`);
		if (logStream)
			logStream.write('-WARN', ...msg);
	};
	logger.debug = (...msg) => {
		console.log(prefix, ...msg);
		if (logStream)
			logStream.write('', ...msg);
	};
	logger.end = () => {
		if (logStream)
			logStream.end();
	};
}

function getDebugLogFileStream() {
	const { v4: uuidV4 } = require('uuid');

	const DEBUG_LOG_DIR = path.join(__dirname, '..', 'logs');

	try {
		if (!fs.existsSync(DEBUG_LOG_DIR))
			fs.mkdirSync(DEBUG_LOG_DIR);
	} catch (error) {
		logger.error(`create debug log dir (${DEBUG_LOG_DIR}) failed!`, error);
		return;
	}
	const now = new Date();
	const rand = uuidV4();
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
//#endregion
