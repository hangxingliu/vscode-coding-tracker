//@ts-check
/// <reference path="index.d.ts" />

const vscode = require('vscode');
const helper = require('./VSCodeHelper');
const vcsGit = require('./vcs/Git');
const log = require('./Log');

const VSCODE_SETTINGS = 'vscode-settings';
const VSCODE_INTERACTIVE_PLAYGROUND = 'vscode-interactive-playground';
const UNKNOWN = 'unknown';

let lastActiveProject = UNKNOWN;
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
	lastActiveProject = vscode.workspace.rootPath || UNKNOWN;
	baseUploadObject.pcid = computerId;
}
function generateOpen(activeDocument, time, long) { return generate('open', activeDocument, time, long); }
function generateCode(activeDocument, time, long) { return generate('code', activeDocument, time, long); }

/** @param {vscode.TextDocument} activeDocument  */
function generate(type, activeDocument, time, long) {
	let obj = Object.assign({}, baseUploadObject);
	let uri = activeDocument.uri;
	let fileName = activeDocument.fileName;

	obj.type = type;
	obj.proj = helper.getWhichProjectDocumentBelongsTo(activeDocument, lastActiveProject);

	// Reference 1:
	//   why set false to second parameter of function `asRelativePath`
	//   for example: ./src/hello.js under folder named "project1" in workspace
	//   result of parameter is true (default value):  project1/src/hello.js
	//   result of parameter is false: src/hello.js
	//   new parameter since VSCode 1.18.0:
	//   https://code.visualstudio.com/docs/extensionAPI/vscode-api#workspace.asRelativePath
	obj.file = uri.scheme;
	obj.lang = activeDocument.languageId;
	switch (uri.scheme) {
		case 'file':
			obj.file = vscode.workspace.asRelativePath(uri.fsPath, false); // ^[1]
			obj.lang = activeDocument.languageId;
			break;
		case 'vscode':
			if (uri.authority == 'defaultsettings') {
				obj.file = VSCODE_SETTINGS;
				obj.lang = VSCODE_SETTINGS;
			} else if (log.debugMode) {
				vscode.window.showInformationMessage(`Unknown authority in vscode scheme: ${uri.toString()}`);
			}
			break;
		case 'walkThroughSnippet':
			if (log.debugMode && !uri.path.endsWith('vs_code_editor_walkthrough.md'))
				vscode.window.showWarningMessage(`Invalid vscode interactive playground uri: ${uri.toString()}`);
			obj.file = VSCODE_INTERACTIVE_PLAYGROUND;
			obj.lang = VSCODE_INTERACTIVE_PLAYGROUND;
			break;
	}

	obj.time = time;
	obj.long = long;
	obj.line = activeDocument.lineCount;
	obj.char = 0; //TODO: getText().length: But it affect extension efficiency

	if (activeDocument.isUntitled) {
		//Ignore vcs information
		log.d(`generated upload object(no vcs) (${dumpUploadObject(obj)}): `);
		return Promise.resolve(obj);
	}

	return vcsGit.getVCSInfo(fileName).then(vcs => {
		if (vcs) {
			obj.vcs_type = vcs[0];
			obj.vcs_repo = vcs[1];
			obj.vcs_branch = vcs[2];
		}
		log.d(`generated upload object (${dumpUploadObject(obj)}): `);
		return obj;
	});
}

/** @param {UploadObject} obj */
function dumpUploadObject(obj) {
	return `${obj.type} from ${obj.time} long ${obj.long}; ${obj.file}(${obj.lang}; line: ${obj.line}}); ` +
		`vcs: ${obj.vcs_type}:${obj.vcs_repo}:${obj.vcs_branch}`;
}
