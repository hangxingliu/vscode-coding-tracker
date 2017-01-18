var version = require('./Version'),
	Program = require('commander');	

Program
	.version(version.server)
	.usage('[option]')
	.description('Launch Visual Studio Code Coding Tracker Data Storage And Analyze Server')
	.option('-t, --token <uploadToken>', 'upload data token', '123456')
	.option('-p, --port <serverPort>', 'server listen port', 10345)
	.option('-o, --output <dataOutputFolder>', 'upload data storage folder', './database')
	.option('-d, --debug', 'turn on the debug mode');
Program._name = 'app';
Program.parse(process.argv);

global.DEBUG = Program.debug;

module.exports = Program;