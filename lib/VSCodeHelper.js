"use strict";

var vscode = require('vscode');

var showingErrorMsg = 0,
	statusBarItem;//= vscode.window.createStatusBarItem();
var Helper = {
	getConfig: (name) => vscode.workspace.getConfiguration(name),
	cloneTextDocumentObject: (doc) => {
		return doc ? {
			fileName: doc.fileName,
			isUntitled: doc.isUntitled,
			languageId: doc.languageId,
			lineCount: doc.lineCount,
			uri: {
				scheme: doc.uri.scheme,
				path: doc.uri.path,
				fsPath: doc.uri.fsPath,
				external: doc.uri.external
			}
		} : doc
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