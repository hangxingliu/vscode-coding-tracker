var vscode = require("vscode");

const MAIN_TITLE = 'CodingTracker';

var statusBarItem;// = vscode.window.createStatusBarItem();
var uploadQueue = [],
	bindUploadQueueArray = Q => uploadQueue = Q; 

var isLocalServerOn = false,
	mainStatus = '';

function init() {
	if (statusBarItem) statusBarItem.dispose();
	statusBarItem = vscode.window.createStatusBarItem();
	isLocalServerOn = false;
	mainStatus = '';
	_updateText();
	_updateTooltip();
}

var hasInit = () => !!statusBarItem,
	setStatus2Uploading = () => _update(mainStatus = 'Uploading...'),
	setStatus2Uploaded = desc => _update(mainStatus = desc || 'Uploaded'),
	setStatus2GotNew1 = () => _update(mainStatus = '+1'),
	setStatus2Nothing = () => _update(mainStatus = null);

var setLocalServerOn = () => (isLocalServerOn = true, _update()),
	setLocalServerOff = () => (isLocalServerOn = false, _update());

function _update() {
	_updateText();
	_updateTooltip();
}
function _updateText() {
	var text = `$(dashboard) ${mainStatus || MAIN_TITLE}`;
	if (isLocalServerOn) text += ' $(database) Local';
	text += uploadQueue.length ? ('$(chevron-left) ' + uploadQueue.length) : ''; 	
	statusBarItem.text = text;
	statusBarItem.show();
}
function _updateTooltip() {
	var qLen = uploadQueue.length;
	statusBarItem.tooltip = `${MAIN_TITLE} ${isLocalServerOn ? ' - local server is running' : ''}` + 
		(qLen ? `(${qLen} ${qLen > 1 ? 'records are' : 'record is'} waiting upload!)` : '');
	statusBarItem.show();
}

module.exports = {
	init,
	hasInit,
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