/**
 * Visual Studio Code Coding Tracker Server Script
 *
 * Author: LiuYue
 * Github: https://github.com/hangxingliu
 * Version: 0.1.2
 * License: GPL-3.0
 */

/**
 * Upload Structure Version: 2.0
 * Upload item:
 *
 * version: string      upload version
 * token: string        upload token
 *
 * type: enum<string>   open|look|code coding type(open time, looking time and coding time)
 *    if upload type is not in enum item will be choose default enum: open
 * time: string         coding record heppend date string (YYMDDhhmmss)
 * long: integer        coding record duration time(s)
 * lang: string         coding language
 * file: string         coding file path(relative project path)
 * proj: string         coding project path
 *
 */

/**
 * Storage Structure Version: 2.0
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
 * [type] [time] [long] [lang] [file] [proj]
 * ...
 * -----
 *     [type]: open=>0, look=>1(reserve), code=>2
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
	Colors = require('colors'),
	Path = require('path'),
	Fs = require('fs-extra');
	
var log = require('./lib/Log'),
	version = require('./lib/Version'),
	welcome = require('./lib/Welcome'),
	storage = require('./lib/Storage'),
	checker = require('./lib/ParamsChecker'),
	errorHandler = require('./lib/Handler404and500'),
	tokenChecker = require('./lib/TokenMiddleware'),
	Program = require('./lib/Launcher');

//Express Server Object
var app = Express();

//Init Storage
storage.init(Program.output);

//Display now is debug mode
DEBUG && Log.info('Debug mode be turned on!') + 

//Using visitor log record (if under the debug mode)	
app.use(require('morgan')('dev'));
//Using body parser to analyze upload data
app.use(require('body-parser').urlencoded({ extended: false }));
//Using homepage welcome
app.use(welcome);
//Using a upload token checker middleware
app.use(tokenChecker.get(Program.token));

//Handler upload request
app.post('/ajax/upload', (req, res) => {
	var params = req.body,
		versionCheckResult = version.check(params.version);

	//Check upload version
	if (versionCheckResult !== true)
		return Log.error(versionCheckResult) + returnError(res, versionCheckResult);
	
	//Check params
	params = checker(params);

	//Params are invalid
	return params.error ? returnError(res, params.error)
		//Storage data
		: process.nextTick( () => storage.write(params)) + 
		//Response HTTP request
		  res.json({ success: 'upload success' }).end();
});
//add 404 and 500 response to express server
errorHandler(app);
 

//--------------------------------------
//|            Launch Server           |
//--------------------------------------
start(function (next) {
	//Is output folder exist ?
	Fs.exists(Program.output, (exist) => exist ? next() : Fs.mkdirs(Program.output, next));

}).then(go(function (next) {
	//Launch express server
	app.listen(Program.port, next);

})).then(go(function (next) {
	//Log launch success
	Log.success('Server has launched and listening port ' + Program.port);
	next();

})).catch(function (e) {
	Log.error(e.stack);
	process.exit(1);
})

function returnError(res, errInfo) { res.json({ error: errInfo || 'Unknown error' }).end() }
function start(callback) { return go(callback)() }
function go(callback) {return ()=>new Promise((next) => callback(next))}