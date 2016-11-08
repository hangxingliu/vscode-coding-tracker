var Path = require('path'),
	Fs = require('fs'),
	version = require('./Version');	

var constTypeMap = { 'open': 0, 'look': 1, 'code': 2 };

var storagePath = '';

module.exports = {
	init: function (_storagePath) {
		storagePath = _storagePath;
	},
	write: function (data) {
		var fname = getStorageFilePath(data.time),
			storableData = getStorableData(data);
		if (!fname)
			return callback({stack: 'Could not get a filename from upload time field: ' + data.time});	
		Fs.existsSync(fname) ? Fs.appendFile(fname, storableData, callback)
			: Fs.writeFile(fname, version.storage + '\n' + storableData, callback);

		function callback(err) {
			return err ? Log.error('Storaged data into file( ' + fname + ' ) fail!\n' + err.stack) :
				(DEBUG && Log.success('Storaged success:  ' + fname + ' (' + data.type + ')'));
		}
	}
};


function getStorableData(data) {
	var ret = [
		(constTypeMap[data.type] || 0),
		data.time,
		data.long,
		data.lang,
		data.file,
		data.proj
	];
	for (var i = 3; i < ret.length; i++) ret[i] = encodeURIComponent(ret[i]);
	return ret.join(' ') + '\n';
}
function getStorageFilePath(paramTime) {
	return Path.join(storagePath, paramTime.slice(0, 5).concat('.db'));
}