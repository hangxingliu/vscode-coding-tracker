//@ts-check
/// <reference path="./index.d.ts" />

"use strict";

let vscode = require('vscode'),
	ext = require('./VSCodeHelper'),
	Request = require('request'),
	statusBar = require('./StatusBarManager'),
	localServer = require('./LocalServer'),
	log = require('./Log');

let Q = [],
	uploadURL,
	uploadToken,
	uploadHeader = { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
	uploading = 0,
	//Avoid Show error information too many times
	hadShowError = 0,
	retryTime = 0,
	uploadProxy = undefined;

let uploader = {
	init: function () {
		statusBar.bindUploadQueueArray(Q);
	},
	/**
	 * @param {string} url
	 * @param {string} token
	 * @param {string|boolean|undefined} proxy
	 */
	set: function (url, token, proxy) {
		uploadURL = url;
		uploadToken = token;
		uploadProxy = proxy;
		log.debug('uploader configurations changed!');
	},
	upload: function (data) {
		if (!data)
			return log.debug(`new upload object(ignored): ${data}`);
		log.debug(`new upload object: ${data.type};${data.time};${data.long};${data.file}`);
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

	/** @type {Request.CoreOptions} */
	const uploadOptions = { method: 'POST', form: data, headers: uploadHeader };
	if (typeof uploadProxy !== 'undefined')
		uploadOptions.proxy = uploadProxy;

	// if (log.debugMode) {
	// 	const dump = JSON.stringify(uploadOptions, null, 2).split('\n').map(it => `  ${it}`);
	// 	log.debug(`Upload options:\n${dump}`);
	// }

	Request(uploadURL, uploadOptions, function (err, res, bd) {
		uploading = 0;

		let success = true;
		let returnObject = {error: 'Unable to connect'};

		if (err) {
			success = false;
			//Upload failed because network error
			//So check is local server mode ?
			//If is local server mode now, just start a new local server now.
			localServer.detectOldSever_SoStartANewIfUnderLocalMode() ||
				showErrorMessage(1, `Could not upload coding record: ${err.stack}`);
		}

		//If there are not network error
		if (success) {
			if (res.statusCode === 200 || res.statusCode === 403) {
				returnObject = toJSON(bd);
				if (returnObject.JSONError) {
					success = false;
					showErrorMessage(2, `Upload error: Server response content is not JSON!`);
				}
				if (returnObject.error) {
					success = false;
					showErrorMessage(3, `Upload error: ${returnObject.error}`);
				}
			} else {
				success = false;
				showErrorMessage(2, `Upload error: Response: ${res.statusCode} (${res.statusMessage})`);
			}
		}

		//update status bar information
		statusBar.setStatus2Uploaded(returnObject.error || null);

		uploading = 0;
		//upload failed
		if (!success) {
			if (retryTime >= 3)
				return statusBar.setStatus2Nothing();
			retryTime++;
			setTimeout(_upload, 3000);
		} else {
			Q.shift();
			hadShowError = retryTime = 0;
			process.nextTick(_upload);
			log.debug('Uploaded success!');
		}

		//End callback
	})
}

//Methods
function toJSON(bd) {
	try {
		return JSON.parse(bd);
	} catch (err) {
		console.error(`Parse JSON failed! (${bd})`);
		return { JSONError: true, error: 'Unrecognized response' };
	}
}

/**
 * @param {number} id
 * @param {Error|string} error
 * @returns
 */
function showErrorMessage(id, error) {
	log.error(error);
	if (hadShowError == id)
		return;
	hadShowError = id;
	ext.showSingleErrorMsg(error);
}

module.exports = uploader;
