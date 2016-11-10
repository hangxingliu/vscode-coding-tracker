var Program = require('commander'),
	fs = require('fs'),
	Path = require('path');

Program
	.usage('[files_path]')
	.description('Convert coding track data from version 1.0 to 2.0')
Program.parse(process.argv);

var filesPath = Program.args[0];
if (!filesPath)
	console.error('  Plz launch this script by setting up a folder location where data files in'),
		process.exit(1);

var files = fs.readdirSync(filesPath);

for (var i = 0; i < files.length; i++) {
	var absPath = Path.join(filesPath, files[i]);
	if (fs.statSync(absPath).isFile()) {
		handler(absPath);
	}
} 

function handler(filePath) {
	var ct = fs.readFileSync(filePath, 'utf8');
	if (!ct.startsWith('1.0')) return;
	var lines = ct.split('\n');
	lines[0] = '2.0';
	for (var i = 1; i < lines.length; i++)
		lines[i] = handlerLine(lines[i]);
	fs.writeFileSync(filePath, lines.join('\n'));
	console.log(`convert file "${Path.basename(filePath)}" success!`);
}

function handlerLine(line) {
	if (!line.trim()) return;
	var parts = line.split(/\s+/);
	parts[1] = timestamp2dateStr(Number(parts[1]));
	parts[5] = parts[6];
	parts.pop();
	return parts.join(' ');
}

function timestamp2dateStr(time) {
	var constMonths = '123456789ABC';
	var d = new Date(time),
		ret = [d.getFullYear() % 100, constMonths[d.getMonth()], d.getDate(),
			d.getHours(), d.getMinutes(), d.getSeconds()];
	for (var i = 2; i < ret.length; i++)
		if (ret[i] < 10)
			ret[i] = '0' + ret[i];
	return ret.join('');
}	