//@ts-check
/// <reference path="./index.d.ts" />

"use strict";
let vscode = require('vscode');

let showingErrorMsg = 0;

/** @type {vscode.StatusBarItem} */
let statusBarItem = null;

module.exports = {
	getConfig,
	cloneTextDocument, cloneUri,
	dumpDocument, dumpEditor,
	showSingleErrorMsg, setStatusBar,
	getWhichProjectDocumentBelongsTo
};

function getConfig(name = '') {
	return vscode.workspace.getConfiguration(name);
}

/** @param {vscode.TextDocument} doc */
function cloneTextDocument(doc) { 
	if (!doc)
		return null;
	return Object.assign({}, doc, { uri: cloneUri(doc.uri) });
}
/** @param {vscode.Uri} uri */
function cloneUri(uri) { 
	if (!uri) return null;
	return vscode.Uri.parse(uri.toString());
}

/** @param {vscode.TextDocument} doc */
function dumpDocument(doc) {
	if (!doc) return 'null';
	//document.fileName == document.uri.fsPath
	let str = vscode.workspace.asRelativePath(doc.fileName) +
		` (${doc.languageId})(ver:${doc.version})` +
		`(scheme: ${doc.uri?doc.uri.scheme:""}): `;
	if (doc.isClosed) str += ' Closed';
	if (doc.isDirty) str += ' Dirty';
	if (doc.isUntitled) str += ' Untitled';
	return str;
}

/** @param {vscode.TextEditor} editor */
function dumpEditor(editor) {
	if (!editor) return 'null';
	return `Editor: (col:${editor.viewColumn}) ${dumpDocument(editor.document)}`;
}

function showSingleErrorMsg(error) {
	if (!showingErrorMsg)
		vscode.window.showErrorMessage(error).then(() =>
			process.nextTick(() => showingErrorMsg = 0));
	showingErrorMsg = 1;
}
function setStatusBar(text, tooltip) {
	if(!statusBarItem)
		statusBarItem = vscode.window.createStatusBarItem();
	
	statusBarItem.text = text || '';
	statusBarItem.tooltip = tooltip || '';
	if (text)
		return statusBarItem.show();
	statusBarItem.dispose();
	statusBarItem = null;
}

/**
 * @param {vscode.TextDocument} document 
 * @param {string} [defaultProjectPath]
 */
function getWhichProjectDocumentBelongsTo(document, defaultProjectPath) { 
	// Old version vscode has not getWorkspaceFolder api
	if (!vscode.workspace.getWorkspaceFolder)
		return defaultProjectPath;

	if (!document || !document.uri)
		return defaultProjectPath;
	let { uri } = document;

	if (uri.scheme != 'file')
		return defaultProjectPath;	

	let folder = vscode.workspace.getWorkspaceFolder(uri);

	//this document locate in workspace outside
	if (!folder)
		return defaultProjectPath;	
	return folder.uri.fsPath;
}