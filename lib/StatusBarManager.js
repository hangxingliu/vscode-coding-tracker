"use strict";

let vscode = require("vscode"),
	{ debugMode } = require('./Log');

const MAIN_TITLE = 'CodingTracker';
const DEBUG_TITLE = 'CodingTracker(Debug)';

let statusBarItem;// = vscode.window.createStatusBarItem();
let uploadQueue = [],
	bindUploadQueueArray = Q => uploadQueue = Q; 

let isLocalServerOn = undefined,
	mainStatus = '';

function init(enable = true) {
	if (statusBarItem && !enable) {
		statusBarItem.dispose();
		statusBarItem = null;
	}

	if(!statusBarItem && enable)
		statusBarItem = vscode.window.createStatusBarItem();
	
	if(typeof isLocalServerOn == 'undefined')
		isLocalServerOn = false;
	mainStatus = '';
	_updateText();
	_updateTooltip();
}

let setStatus2Uploading = () => _update(mainStatus = 'Uploading...'),
	setStatus2Uploaded = desc => _update(mainStatus = desc || 'Uploaded'),
	setStatus2GotNew1 = () => _update(mainStatus = '+1'),
	setStatus2Nothing = () => _update(mainStatus = null);

let setLocalServerOn = () => (isLocalServerOn = true, _update()),
	setLocalServerOff = () => (isLocalServerOn = false, _update());

function _update() {
	if (!statusBarItem) return;
	_updateText();
	_updateTooltip();
}
function _updateText() {
	if (!statusBarItem) return;
	
	let text = debugMode
		? `$(bug) ${mainStatus || DEBUG_TITLE}`
		: `$(dashboard) ${mainStatus || MAIN_TITLE}`;
	if (isLocalServerOn) text += ' $(database) Local';
	text += uploadQueue.length ? ('$(chevron-left) ' + uploadQueue.length) : '';
	statusBarItem.text = text;
	statusBarItem.show();
}
function _updateTooltip() {
	if (!statusBarItem) return;

	let qLen = uploadQueue.length;
	statusBarItem.tooltip = `${MAIN_TITLE} ${isLocalServerOn ? ' - local server is running' : ''}` + 
		(qLen ? `(${qLen} ${qLen > 1 ? 'records are' : 'record is'} waiting upload!)` : '');
	statusBarItem.show();
}

module.exports = {
	init,
	bindUploadQueueArray,
	setStatus2Uploading,
	setStatus2Uploaded,
	setStatus2GotNew1,
	setStatus2Nothing,
	localServer: {
		turnOn: setLocalServerOn,
		turnOff: setLocalServerOff
	}
};