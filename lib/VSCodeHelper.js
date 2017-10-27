"use strict";

let vscode = require('vscode');

let showingErrorMsg = 0,
	statusBarItem;//= vscode.window.createStatusBarItem();
let Helper = {
	getConfig: (name) => vscode.workspace.getConfiguration(name),
	cloneTextDocumentObject: (doc) => {
		if (!doc)
			return null;
		let { fileName, isUntitled, languageId, lineCount, uri } = doc;
		let { scheme, path, fsPath, external } = uri;
		return {
			fileName, isUntitled, languageId, lineCount,
			uri: { scheme, path, fsPath, external }
		};
	},
	dumpDocument: (doc) => {
		if (!doc) return 'null';
		//document.fileName == document.uri.fsPath
		let str = vscode.workspace.asRelativePath(doc.fileName) +
			` (${doc.languageId})(ver:${doc.version})` +
			`(scheme: ${doc.uri?doc.uri.scheme:""}): `;
		if (doc.isClosed) str += ' Closed';
		if (doc.isDirty) str += ' Dirty';
		if (doc.isUntitled) str += ' Untitled';
		return str;
	},
	dumpEditor: (editor) => {
		if (!editor) return 'null';
		return `Editor: (col:${editor.viewColumn}) ${Helper.dumpDocument(editor.document)}`;
	},
	showSingleErrorMsg: (error) => {
		if (!showingErrorMsg)
			vscode.window.showErrorMessage(error).then(() =>
				process.nextTick(() => showingErrorMsg = 0));
		showingErrorMsg = 1;
	},
	setStatusBar: (text, tooltip) => {
		statusBarItem = statusBarItem || vscode.window.createStatusBarItem();
		statusBarItem.text = text || '';
		statusBarItem.tooltip = tooltip || '';
		statusBarItem = text ? (statusBarItem.show(), statusBarItem) : statusBarItem.dispose();
	}
};


module.exports = Helper;