var Path = require('path'),
	vscode = require('vscode');

var baseUploadObject = {
    version: '2.0',
	token: 'This value will be set up in Uploader module',
	type: '',
	time: '',
	long: 0,
	lang: '',
	file: '',
	proj: ''
}, constMonths = '123456789ABC';

module.exports = function (projectPath) {
	var uploadObject = cloneSimpleMapObject(baseUploadObject);
	uploadObject.proj = projectPath;

	this.gen = function (type, activeDocument, time, long) {
		var uri = activeDocument.uri;
		uploadObject.type = type;
		uploadObject.file = uri.scheme == 'file' ?
			vscode.workspace.asRelativePath(uri.fsPath) : uri.scheme;
		uploadObject.lang = activeDocument.languageId;
		uploadObject.time = time;
		uploadObject.long = long;
		return uploadObject;
	}

	function timestamp2dateStr(time) {
		var d = new Date(time),
			ret = [d.getFullYear() % 100, constMonths[d.getMonth()], d.getDate(),
				d.getHours(), d.getMinutes(), d.getSeconds()];
		for (var i = 2; i < ret.length; i++)
			if (ret[i] < 10)
				ret[i] = '0' + ret[i];
		return ret.join('');
	}	

	function cloneSimpleMapObject(obj) {
		var ret = {};
		for (var i in obj)
			ret[i] = obj[i];
		return ret;
	}
}