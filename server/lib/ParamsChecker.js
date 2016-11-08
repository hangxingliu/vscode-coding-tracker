var required = ['version', 'token', 'type', 'time', 'long', 'lang', 'file', 'proj'],
	dateRange = [null, null, [1, 31, 'day'], [0, 23, 'hour'], [0, 59, 'mintues'], [0, 59, 'seconds']];
module.exports = function (params) {
	for(var i in required)
		if (typeof params[required[i]] == 'undefined')
			return {error: `missing param "${required[i]}"!`};
	if (isNaN(parseInt(params.long)))
		return { error: `param "long" is not an integer` };
	var dateArray = params.time.match(/^(\d\d)([1-9ABC])(\d\d)(\d\d)(\d\d)(\d\d)$/),
		datePart;
	if (!dateArray)
		return { error: `param "time" is invalid`};	
	for (var i = 1; i < dateArray; i++)
		if (dateRange[i])
			if ((datePart = parseInt(dateArray[i])),
				(datePart < dateRange[i][0] || datePart > dateRange[i][1]))
				return { error: `param "time" part "${dateRange[i][2]}" is invalid ` };
	// TODO : It is could also verify params length and type 
	return params;
}