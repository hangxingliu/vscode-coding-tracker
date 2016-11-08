var Fs = require('fs'),
	Path = require('path');

var versionMap = {
	upload: '2.0',
	storage: '2.0',
	uploadSupport: [2, 0],
	server: JSON.parse(Fs.readFileSync(Path.join(__dirname, '..', 'package.json'), 'utf8')).version,

	check: function(v) {
		v = (v||'').split('.');
		if (v.length != 2)
			return Err.len;
		for(var i in v)
			if ( isNaN(v[i] = Number(v[i])) )
				return Err.nan;
		var sub = v[0] - versionMap.uploadSupport[0];
		if (sub > 0) return Err.low
		if (sub < 0) return true;
		sub = v[1] - versionMap.uploadSupport[1];
		if (sub > 0) return Err.low;
		return true;
	}
}
var Err = {
	len: 'invalid version string (not format like 1.0)',
	low: 'server support upload version is too low to support this upload data',
	nan: 'invalid version string (not number)',
}

module.exports = versionMap;