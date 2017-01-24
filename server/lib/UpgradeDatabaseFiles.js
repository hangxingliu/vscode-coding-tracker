var fs = require('fs-extra'),
	path = require('path');

var pcid = 'unknown';

function upgrade(folder, defaultPCId) {
	var files = fs.readdirSync(folder).filter(name =>
		fs.statSync(path.join(folder, name)).isFile() && name.endsWith('.db'));
	
	if (defaultPCId)
		pcid = defaultPCId;	

	var count = 0;
	files.forEach(file => {
		var absPath = path.join(folder, file);
		var content = fs.readFileSync(absPath, 'utf8');
		if (content.startsWith('1.0')) content = upgrade1to3(content);
		else if (content.startsWith('2.0')) content = upgrade2to3(content);
		else return;
		count++;
		fs.writeFileSync(absPath, content, 'utf8');
	})

	return { count: count, all: files.length };
}
function upgrade1to3(content) {
	var lines = content.split(/[\r\n]+/), line, result = ['3.0'];
	lines.shift();
	while (line = lines.shift()) {
		let parts = line.split(/\s+/);
		// Remove proj_name param
		parts[5] = parts[6]; 
		// Set default computer Id
		parts[6] = pcid;
		result.push(parts.join(' '));
	}
	return result.join('\n');
}
function upgrade2to3(content) {
	var lines = content.split(/[\r\n]+/), line, result = ['3.0'];
	var monthChar2Num = { A: 10, B: 11, C: 12 };
	lines.shift();
	while (line = lines.shift()) {
		let parts = line.split(/\s+/);
		//change date time format to timestamp
		var times = parts[1].match(/(\d{2})(\w)(\d{2})(\d{2})(\d{2})(\d{2})/);
		times[2] = monthChar2Num[times[2]] || times[2];
		for (var i = 1; i <= 6; i++)times[i] = Number(times[i]);
		parts[1] = new Date(2000 + times[1], times[2] - 1, times[3], times[4], times[5], times[6]).getTime();
		// Set default computer Id
		parts[6] = pcid;
		result.push(parts.join(' '));
	}
	return result.join('\n');
}


module.exports = { upgrade: upgrade }