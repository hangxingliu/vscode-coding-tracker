/// <reference path="index.d.ts" />
/// <reference path="../vscode.d.ts" />

let vscode = require('vscode'),	
	vcsGit = require('./vcs/Git'),
	log = require('./Log');

/** @type {UploadObject} */
let baseUploadObject = {
	version: '3.0',
	token: 'This value will be set up in Uploader module',
	type: '',
	time: '',
	long: 0,
	lang: '',
	file: '',
	proj: '',
	pcid: '',
	vcs: '',
	line: 0,
	char: 0,
	r1: '1',
	r2: ''
};

module.exports = function (projectPath) {
	/** @type {UploadObject} */
	let obj = cloneSimpleMapObject(baseUploadObject);
	obj.proj = projectPath || 'unknown';

	this.setComputerId = computerId => obj.pcid = computerId;

	this.gen = (type, activeDocument, time, long) => {
		let uri = activeDocument.uri;
		obj.type = type;
		obj.file = uri.scheme == 'file' ?
			vscode.workspace.asRelativePath(uri.fsPath) : uri.scheme;
		obj.lang = activeDocument.languageId;
		obj.time = time;
		obj.long = long;
		// obj.vcs = vcsGit.getVCSInfo(activeDocument);
		obj.line = activeDocument.lineCount;
		obj.char = 0; //TODO: getText().length: But it affect extension efficiency
		
		let result = vcsGit.getVCSInfo(activeDocument)
		.then(vcs => {
				obj.vcs = vcs;
				log.d('upload object:', obj);
				// TODO This clone seems could be removed
				return Promise.resolve(cloneSimpleMapObject(obj));
			});
		return result;
	}

	function cloneSimpleMapObject(obj) { return Object.assign({}, obj); }
}