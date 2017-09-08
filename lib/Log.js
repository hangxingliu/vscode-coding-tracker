//@ts-check
/// <reference path="./index.d.ts" />
/// <reference path="../vscode.d.ts" />
"use strict";

const PREFIX = ['coding-tracker'];
const DEBUG_MODE = require('fs').existsSync(`${__dirname}/../DEBUG_SIGN_FILE`);


/** @type {Logger} */
let Log = null;
//@ts-ignore
Log = (...fields) => console.log(PREFIX, ...fields);
Log.debugMode = DEBUG_MODE;

if (DEBUG_MODE) {
	// Debug Mode
	let vscode = require('vscode');
	Log.e = (...fields) => {
		console.error(PREFIX, ...fields);
		vscode.window.showErrorMessage(`${PREFIX}: ${fields.join(' ')}`);
	}
	Log.w = (...fields) => {
		console.error(PREFIX, ...fields);
		vscode.window.showWarningMessage(`${PREFIX}: ${fields.join(' ')}`);
	}
	Log.d = (...fields) => console.log(PREFIX, ...fields);
} else {
	// Release Mode
	Log.e = (...fields) => console.error(PREFIX, ...fields);
	Log.w = (...fields) => console.warn(PREFIX, ...fields);
	Log.d = () => undefined;
}

module.exports = Log;