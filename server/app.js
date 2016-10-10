/**
 * Visual Studio Code Coding Tracker Server Script
 *
 * Author: LiuYue
 * Github: https://github.com/hangxingliu
 * Version: 0.0.1
 * License: GPL-3.0
 */

/**
 * Version: 1.0
 * Upload item:
 *
 * version: string      upload version
 * token: string        upload token
 *
 * type: enum<string>   open|look|code coding type(open time, looking time and coding time)
 *    if upload type is not in enum item will be choose default enum: open
 * time: integer        coding record heppend timestamp
 * long: integer        coding record duration time(s)
 * lang: string         coding language
 * file: string         coding file path(relative project path)
 * proj: string         coding project name
 * proj_path: string    coding project path
 *
 */

/**
 * Version: 1.0
 * Storage:
 *
 * Each file first line is storage version
 * And since second line, every line is a coding record and echo items in line are splited by a space character
 * Each lines are splited by a character '\n'
 * And each string item(exclude version item) should storage after encodeURIComponent operate
 *
 *
 * Example Rule:
 *
 * [version]
 * [time] [type] [long] [lang] [file] [proj] [proj_path]
 * ...
 * -----
 *     [type]: open=>0, look=>1, code=>2
 *
 *
 * Storage file name:
 *
 * YYMDD.db   a output data file included all record uploaded on day YY-MM-DD
 * YYMDD.ov   a overview analyze result data file analyzed from all record before day YYMDD
 *      could be used to display each project or each files in a project time consuming
 * ...
 * -----
 *     M: use one character to express month(1,2,3,4,5,6,7,8,9,A,B,C)
 */
var there_are_some_help_above;

//Require dependent module
var Express = require('express'),
	Program = require('commander'),
	Colors = require('colors'),
	Path = require('path'),
	Fs = require('fs-extra');
	
//Declare some variable
var app = Express(),
	requiredParams = ['version', 'type', 'time', 'long', 'lang', 'file', 'proj', 'proj_path'],
	months = '123456789ABC',
	typeMap = { 'open': 0, 'look': 1, 'code': 2 },
	storageEncodeOrder = ['lang', 'file', 'proj', 'proj_path'],
	paramsConvert2Number = ['time', 'long'],
	msgVersionNotSupport = 'server support upload version is too low to support this upload',
	Version = { upload: '1.0', storage: '1.0', uploadSupport: [1,0], server: '0.0.1' }

Program
	.version(JSON.parse(Fs.readFileSync(Path.join(__dirname, '..', 'package.json'), 'utf8')).version)
	.usage('[option]')
	.description('Launch Visual Studio Code Coding Tracker Data Storage And Analyze Server')
	.option('-t, --token <uploadToken>', 'upload data token', '')
	.option('-p, --port <serverPort>', 'server listen port', 10345)
	.option('-o, --output <dataOutputFolder>', 'upload data storage folder', './database')
	.option('-d, --debug', 'turn on the debug mode');
Program._name = 'app';
Program.parse(process.argv);

Program.debug && logInfo('Debug mode be turned on!') +
	app.use(require('morgan')('dev'));

app.use(require('body-parser').urlencoded({ extended: false }));
app.get('/', (req, res) => res.json({
	welcome: 'Visual Studio Code Coding Tracker Server',
	serverVersion: Version.server,
	storageVersion: Version.storage,
	uploadVersion: Version.upload,
	maxUploadVersionSupport: Version.uploadSupport.join('.')
	}).end());
app.use(tokenMiddleware);
app.post('/ajax/upload', (req, res) => {
	var params = req.body,
		versionError = checkVersion(params.version);

	if (versionError)
		return logError(versionError) + returnError(res, versionError);
	if (!checkRequiredParams(params))
		return returnError(res, 'missing required params');
	
	params = checkParamsValidAndConvert(params);
	
	if (!params)
		return returnError(res, 'params are invalid');	
	process.nextTick(createAStorageFunction(params) );
	res.json({success: 'upload success'}).end();
});
app.use((req, res) => returnError(res, 'Request invalid') );//404
app.use((err, req, res, next) => logError(err.stack) + returnError(res, 'Server inner Error') );//500


//--------------------------------------
//|            Launch Flow             |
//--------------------------------------
new Promise((next) => 
	//Check the output database folder is exist
	Fs.exists(Program.output, (exist) => exist ? next() : Fs.mkdirs(Program.output, next))
).then(() => new Promise((next) => {
	//Launch express server and listen the port
	app.listen(Program.port, next);})
).then(() => new Promise((next) => {
	//When Launch Success
	logSuccess('Server has launched and listening port ' + Program.port)
		+ next();
	//Happen Error
})).catch(e => logError(e.stack) + process.exit(1));


function tokenMiddleware(req, res, next) {
	console.log(req.body);
	return req.body.token !== Program.token ? returnError(res, 'token is invalid') : next();
}

function checkVersion(version) {
	if (!version)
		return 'invalid version param';	
	version = version.split('.');
	if (version.length != 2)
		return 'invalid version string (not format like 1.0)';
	for(var i in version)
		if ( isNaN(version[i] = Number(version[i])) )
			return 'invalid version string (not number)';
	var sub = version[0] - Version.uploadSupport[0];
	if (sub > 0) return msgVersionNotSupport;
	if (sub < 0) return ;
	sub = version[1] - Version.uploadSupport[1];
	if (sub > 0) return msgVersionNotSupport;
}
function checkRequiredParams(params) { 
	for(var i in requiredParams)
		if (typeof params[requiredParams[i]] == 'undefined')
			return false;
	return true;
}
function checkParamsValidAndConvert(params) {
	for (var i in paramsConvert2Number) {
		var key = paramsConvert2Number[i];
		if (isNaN(params[key] = Number(params[key])))
			return (Program.debug && logError(key + ' param is not a valid number!')), null;
	}
	return params;
}

function createAStorageFunction(data) {
	return () => {
		var fname = getStorageFilePath(data.time),
			lineData = getStorableData(data);
		if (!fname)
			return callback({stack: 'Could not get a filename from upload time field: ' + data.time});	
		Fs.existsSync(fname) ? Fs.appendFile(fname, lineData, callback)
			: Fs.writeFile(fname, Version.storage + '\n' + lineData, callback);

		function callback(err) {
			return err ? logError('Storaged data into file( ' + fname + ' ) fail!\n' + err.stack) :
				(Program.debug && logSuccess('Storaged success:  ' + fname + ' (' + data.type + ')'));
		}
	};
}
function getStorageFilePath(time) {
	var date = new Date(time), path, d;
	if (isNaN(date))
		return null;//is not a valid date object
	d = date.getDate();
	path = [date.getFullYear() % 100, months[date.getMonth()], (d >= 10 ? d : '0' + d),
		'.db'].join('');
	return Path.join(Program.output, path);
}
function getStorableData(data) { 
	var result = [
		(typeMap[data.type]||0),
		data.time,
		data.long
	]; 
	for(var i in storageEncodeOrder)
		result.push( encodeURIComponent(data[ storageEncodeOrder[i] ]) );
	return result.join(' ')+'\n';
}


function returnError(res, errInfo) { res.json({ error: errInfo || 'Unknown error' }).end() }
function log(t) { console.log(t); }
function logSuccess(t) { console.log((t + "").green) }
function logWarn(t) { console.warn((t + "").yellow) }
function logError(t) { console.error((t + "").red) }
function logInfo(t) { console.log((t + "").blue) }