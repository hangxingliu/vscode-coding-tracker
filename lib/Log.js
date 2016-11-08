var showDebug = true;

var Log = function () { _log(console.log, arguments)}
Log.e = function () { _log(console.error, arguments)}
Log.w = function () { _log(console.warn, arguments)}
Log.d = function () { showDebug && _log(console.log, arguments)}
Log.setDebug = function (isDebug) { showDebug = isDebug }

/**
 * @param {Function} method
 * @param {Array<Object>} objs
 */
function _log(method, objs) {
	var items = ['coding-tracker:'];
	for (var i = 0; i < objs.length; i++)
		items.push(objs[i])	
	method.apply(console, items);
}

module.exports = global.Log = Log;