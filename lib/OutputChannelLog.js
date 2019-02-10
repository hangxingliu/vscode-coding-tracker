/**
 * OutputChannel module
 * 1. create a new output channel for coding tracker
 * 2. output content / exception
 * 3. show output channel
 * 4. dispose output channel
 */

//@ts-check
/// <reference path="./index.d.ts" />

"use strict";

let log = require('./Log'),
	vscode = require('vscode');

const OUTPUT_CHANNEL_NAME = 'coding-tracker';

/** @type {vscode.OutputChannel} */
let channel = null;

let getChannel = () => channel = channel || vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME)

module.exports = {
	start: getChannel,
	stop: () => channel = void (channel && (channel.hide(), channel.dispose())),
	debug: data => (log.debug(data), getChannel().appendLine(data)),
	error: error => (log.error(error), getChannel().appendLine(error)),
	show: () => getChannel().show()
};
