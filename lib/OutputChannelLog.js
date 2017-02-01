/**
 * OutputChannel module
 * 1. create a new output channel for coding tracker
 * 2. output content / exception
 * 3. show output channel
 * 4. dispose output channel
 */

var log = require('./Log'),
	vscode = require('vscode');

const OUTPUT_CHANNEL_NAME = 'coding-tracker';
var channel = null;

var getChannel = () => channel = channel || vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME)

module.exports = {
	start: getChannel,
	stop: () => channel = void (channel && (channel.hide(), channel.dispose())),
	d: data => (log.d(data), getChannel().appendLine(data)),
	e: error => (log.e(error), getChannel().appendLine(error)),
	show: () => getChannel().show()
};
