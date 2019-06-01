#!/usr/bin/env node

//@ts-check
/* eslint-disable no-console */

const FROM = 'https://raw.githubusercontent.com/Microsoft/vscode/master/src/vs/vscode.d.ts';

const TARGET = `${__dirname}/vscode.d.ts`;
const TARGET_NAMESPACE = `${__dirname}/vscode_namespace.d.ts`;

const MODULE_REGEXP = /declare\s+module\s+['"]vscode['"]\s+\{/;

let http = require('https'),
	fs = require('fs');

http.get(FROM, response => {
	if (response.statusCode != 200)
		throw new Error(`Response code is ${response.statusCode} !`);
	console.log('start receiving body ...');

	let tsData = '',
		tsNamespaceData = '';
	response.setEncoding('utf8');
	response.on('data', chunk => { tsData += chunk; });
	response.on('end', () => {
		tsNamespaceData = tsData.replace(MODULE_REGEXP, 'namespace vscode {');
		if (tsData == tsNamespaceData)
			throw new Error(`Could not match ${MODULE_REGEXP.toString()} in ts data!`);

		fs.writeFileSync(TARGET, tsData);
		fs.writeFileSync(TARGET_NAMESPACE, tsNamespaceData);

		return console.log('\n  success: fetch done!\n');
	});
}).on('error', err => {
	throw err
	});
console.log('start requesting vscode.d.ts ...');
