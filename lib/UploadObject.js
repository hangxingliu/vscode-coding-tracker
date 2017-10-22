/// <reference path="index.d.ts" />
/// <reference path="../vscode.d.ts" />

"use strict";

/* Debugging codes: checking getVCSInfo callback correctly each times */
let debugSign = 0;
const WARNING_DEBUG_SIGN = 4;

let vscode = require('vscode'),	
	vcsGit = require('./vcs/Git'),
	log = require('./Log');

/** @type {UploadObject} */
let baseUploadObject = {
	version: '4.0',
	token: 'This value will be set up in Uploader module',
	type: '',
	time: '',
	long: 0,
	lang: '',
	file: '',
	proj: '',
	pcid: '',

	vcs_type: '',
	vcs_repo: '',
	vcs_branch: '',
	
	line: 0,
	char: 0,
	r1: '1',
	r2: ''
};

module.exports = { init, generateOpen, generateCode };

/**
 * Initialize upload object basic information
 * @param {string} [computerId] 
 */
function init(computerId) { 
	baseUploadObject.proj = vscode.workspace.rootPath || 'unknown';
	baseUploadObject.pcid = computerId;
}
function generateOpen(activeDocument, time, long) { return generate('open', activeDocument, time, long); }
function generateCode(activeDocument, time, long) { return generate('code', activeDocument, time, long); }

function generate(type, activeDocument, time, long) { 
	let obj = Object.assign({}, baseUploadObject);
	let uri = activeDocument.uri;
	let fileName = activeDocument.fileName;

	obj.type = type;
	obj.file = uri.scheme == 'file' ?
		vscode.workspace.asRelativePath(uri.fsPath) : uri.scheme;
	obj.lang = activeDocument.languageId;
	obj.time = time;
	obj.long = long;
	obj.line = activeDocument.lineCount;
	obj.char = 0; //TODO: getText().length: But it affect extension efficiency

	debugSign++;
	if (debugSign > WARNING_DEBUG_SIGN && log.debugMode)
		vscode.window.showErrorMessage("Coding Tracker: Inner Error (getVCSInfo callback failed!)");
	
	return new Promise((resolve) => { 
		vcsGit.getVCSInfo(fileName, (vcs) => {
			debugSign--;
			if (vcs != null) {
				obj.vcs_type = vcs[0];
				obj.vcs_repo = vcs[1];
				obj.vcs_branch = vcs[2];
			}
			log.d(`generated upload object (${getUploadObjectDump(obj)}): `);
			return resolve(obj);
		});
	});
}

/** @param {UploadObject} obj */
function getUploadObjectDump(obj) { 
	return `${obj.type} from ${obj.time} long ${obj.long}; ${obj.file}(${obj.lang}; line: ${obj.line}}); `+
		`vcs: ${obj.vcs_type}:${obj.vcs_repo}:${obj.vcs_branch}`;
}