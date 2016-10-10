var vscode = require('vscode');

var showingErrorMsg = 0;
var Helper = {
	getConfig: (name) => vscode.workspace.getConfiguration(name),
	cloneTextDocumentObject: (doc) => {
		return doc ? {
			fileName: doc.fileName,
			isUntitled: doc.isUntitled,
			languageId: doc.languageId,
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
	}
};


module.exports = Helper;