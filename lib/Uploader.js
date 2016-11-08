var vscode = require('vscode'),
	ext = require('./VSCodeHelper'),
	Request = require('request');

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
		updateStatusBar(constStatusBarText);
	},
	set: function (url, token) {
		uploadURL = url;
		uploadToken = token;
		Log.d('Uploader configurations changed!');
	},
	upload: function (data) {
		Q.push(data);
		updateStatusBar('+1');
		process.nextTick(_upload);
	}
}

function _upload() {

	//Upload Lock
	if (uploading)
		return;	
	//Queue is empty
	if (!Q[0])
		return updateStatusBar(constStatusBarText);

	uploading = 1;
	
	var data = Q[0];
	//Set up upload token
	data.token = uploadToken;
	
	updateStatusBar('Uploading...');

	Request(uploadURL, {
		method: 'POST',
		form: data,
		headers: uploadHeader
	}, function (err, res, bd){
		uploading = 0;
		var suc = true,
			returnObject = {error: 'Unable to connect'};
		err && (suc = false, showErrorMessage(1, `Could not upload coding record: ${err.stack}`) );
		
		//如果没有网络错误
		if (suc) {
			returnObject = toJSON(bd);
			if (returnObject.JSONError) suc = false, showErrorMessage(2, `Upload error: Server response content is not JSON!`);
			if (returnObject.error) suc = false, showErrorMessage(3, `Upload error: ${returnObject.error}`);
		}

		//更新状态栏		
		updateStatusBar(suc ? 'Uploaded' : returnObject.error);

		uploading = 0;		
		//上传失败
		if (!suc) {
			if (retryTime >= 3) return updateStatusBar(constStatusBarText);
			retryTime++;
			setTimeout(_upload, 3000);
		} else {
			Q.shift();
			hadShowError = retryTime = 0;
			process.nextTick(_upload);
			Log.d('Uploaded success!');
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
	Log.e(error);
	if (hadShowError == id)
		return;
	hadShowError = id;
	ext.showSingleErrorMsg(error);
}
function updateStatusBar(status) {
	status ? ext.setStatusBar(`$(clock) ${status} ${Q.length ? ('$(chevron-left) ' + Q.length) : ''}`, 'Coding Tracker')
		: ext.setStatusBar();	
}

module.exports = uploader;