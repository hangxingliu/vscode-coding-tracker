/**
 * Visual Studio Code Coding Tracker Server Script
 *
 * Author: LiuYue
 * Github: https://github.com/hangxingliu
 * Version: 0.1.3
 * License: GPL-3.0
 */

/**
 * Upload Structure Version: 3.0
 * Upload item:
 *
 * version: string      upload version
 * token: string        upload token
 *
 * type: enum<string>   open|look|code coding type(open time, looking time and coding time)
 *    if upload type is not in enum item will be choose default enum: open
 * time: integer        coding record happened timestamp
 * long: integer        coding record duration time(s)
 * lang: string         coding language
 * file: string         coding file path(relative project path)
 * proj: string         coding project path
 * pcid: string			coding computer id
 */

/**
 * Storage Structure Version: 3.0
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
 * [type] [time] [long] [lang] [file] [proj] [pcid]
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
	upgrader = require('./lib/UpgradeDatabaseFiles'),
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

//If ouput folder is not exists then mkdirs
Fs.existsSync(Program.output) || Fs.mkdirsSync(Program.output);
//upgrade exists old database files
upgradeOldDatabaseFiles(Program.output);
//Launch express web server
app.listen(Program.port, () => 
	Log.success('Server has launched and listening port ' + Program.port) );


function returnError(res, errInfo) { res.json({ error: errInfo || 'Unknown error' }).end() }
function upgradeOldDatabaseFiles(databaseFolder) {
	var upgradeResult = upgrader.upgrade(Program.output);
	upgradeResult.count == 0 || Log.info(`**********\nupgrade old version database file version to ${version.storage}\n` +
		`  there are ${upgradeResult.count} old version database files be upgrade\n**********`);
}