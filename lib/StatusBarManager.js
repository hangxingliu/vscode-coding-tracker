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
	setStatus2Uploading = () => _updateText(mainStatus = 'Uploading...'),
	setStatus2Uploaded = desc => _updateText(mainStatus = desc || 'Uploaded'),
	setStatus2GotNew1 = () => _updateText(mainStatus = '+1'),
	setStatus2Nothing = () => _updateText(mainStatus = null);

var setLocalServerOn = () => (isLocalServerOn = true, _updateText(), _updateTooltip()),
	setLocalServerOff = () => (isLocalServerOn = false, _updateText(), _updateTooltip());

function _updateText() {
	var text = `$(dashboard) ${mainStatus || MAIN_TITLE}`;
	if (isLocalServerOn) text += ' $(database) LocalServer';
	else text += uploadQueue.length ? ('$(chevron-left) ' + uploadQueue.length) : ''; 	
	statusBarItem.text = text;
	statusBarItem.show();
}
function _updateTooltip() {
	statusBarItem.tooltip = `${MAIN_TITLE} ${isLocalServerOn ? ' - local server is running' : ''}`;
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
		setOn: setLocalServerOn,
		setOff: setLocalServerOff
	}
};