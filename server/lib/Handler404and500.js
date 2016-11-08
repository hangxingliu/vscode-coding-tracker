returnError = (res, errInfo) => res.json({ error: errInfo}).end();

module.exports = function (expressApp) {
	//404
	expressApp.use((req, res) => returnError(res, 'Request invalid') );
	//500
	expressApp.use((err, req, res, next) => Log.error(err.stack) + returnError(res, 'Server inner Error') );
};