var vscode = require('vscode'),
	ext = require('./VSCodeHelper'),
	Request = require('request'),
	statusBar = require('./StatusBarManager'),
	localServer = require('./LocalServer'),
	log = require('./Log');

var Q = [],
	uploadURL,
	uploadToken,
	uploadHeader = { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
	uploading = 0,
	//Avoid Show error information too many times
	hadShowError = 0,
	retryTime = 0;

var constStatusBarText = 'CodingTracker';

var uploader = {
	init: function (context) {
		statusBar.hasInit() || statusBar.init();
		statusBar.bindUploadQueueArray(Q);
	},
	set: function (url, token) {
		uploadURL = url;
		uploadToken = token;
		log.d('Uploader configurations changed!');
	},
	upload: function (data) {
		Q.push(data);
		statusBar.setStatus2GotNew1();
		process.nextTick(_upload);
	}
}

function _upload() {

	//Upload Lock
	if (uploading)
		return;	
	//Queue is empty
	if (!Q[0]) {
		//Now the queue is empty
		//And check is the server running in the local
		// - If in local, status bar will display "Local", Else not
		localServer.activeCheckIsLocalServerStart();
		return statusBar.setStatus2Nothing();
	}

	uploading = 1;
	
	var data = Q[0];
	//Set up upload token
	data.token = uploadToken;
	
	statusBar.setStatus2Uploading();

	Request(uploadURL, {
		method: 'POST',
		form: data,
		headers: uploadHeader
	}, function (err, res, bd){
		uploading = 0;
		var suc = true,
			returnObject = {error: 'Unable to connect'};

		if (err) {
			suc = false;
			//Upload failed because network error 
			//So check is local server mode ?
			//If is local server mode now, just start a new local server now.
			localServer.iDetectOldSeverMaybeExited_IfLocalMode_StartNew() ||
				showErrorMessage(1, `Could not upload coding record: ${err.stack}`);
		}
		
		//If there are not network error
		if (suc) {
			returnObject = toJSON(bd);
			if (returnObject.JSONError) suc = false, showErrorMessage(2, `Upload error: Server response content is not JSON!`);
			if (returnObject.error) suc = false, showErrorMessage(3, `Upload error: ${returnObject.error}`);
		}

		//update status bar information	
		statusBar.setStatus2Uploaded(returnObject.error || null);

		uploading = 0;		
		//upload failed
		if (!suc) {
			if (retryTime >= 3) return statusBar.setStatus2Nothing();
			retryTime++;
			setTimeout(_upload, 3000);
		} else {
			Q.shift();
			hadShowError = retryTime = 0;
			process.nextTick(_upload);
			log.d('Uploaded success!');
		}

		//End callback
	})
}

//Methods
function toJSON(bd) {
	var retObj;
	try { 
		retObj = JSON.parse(bd);
	} catch (err) {
		retObj = {JSONError: true, error: 'Unrecognized response'};
	}
	return retObj;
}
function showErrorMessage(id, error) {
	log.e(error);
	if (hadShowError == id)
		return;
	hadShowError = id;
	ext.showSingleErrorMsg(error);
}

module.exports = uploader;