var showDebug = true;

var Log = function (t) { console.log(t); }

Log.e = t => console.error(t)
Log.w = t => console.warn(t)
Log.d = (t) => showDebug && console.log(t)

Log.setDebug = isDebug => showDebug = isDebug;

module.exports = global.Log = Log;