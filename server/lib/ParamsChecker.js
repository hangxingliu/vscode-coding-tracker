var required = ['version', 'token', 'type', 'time', 'long', 'lang', 'file', 'proj', 'pcid'];
module.exports = function (params) {
	for(var i in required)
		if (typeof params[required[i]] == 'undefined')
			return {error: `missing param "${required[i]}"!`};
	if (isNaN(parseInt(params.long)))
		return { error: `param "long" is not an integer` };
	if (isNaN(parseInt(params.time)))
		return { error: `param "time" is not an integer` };
	// TODO : It is could also verify params length and type 
	return params;
}