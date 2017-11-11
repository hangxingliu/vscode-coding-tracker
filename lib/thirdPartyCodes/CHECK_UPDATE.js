#!/usr/bin/env node

//@ts-check
const FILE_NAME = 'gitPaths.js';
const FROM = 'https://raw.githubusercontent.com/DonJayamanne/gitHistoryVSCode/master/src/helpers/gitPaths.ts';

const LAST_SHA1 = '3db1828b72ea1d88c7efe6e80a34e09ba1d056c7';

let http = require('https'),
	crypto = require('crypto');	

http.get(FROM, response => {
	if (response.statusCode != 200)
		throw new Error(`Response code is ${response.statusCode} !`);
	console.log('start receiving body ...');

	let content = '';
	response.setEncoding('utf8');
	response.on('data', chunk => {
		content += chunk;
	});
	response.on('end', () => {
		console.log('start checking update ...');
		let hash = crypto.createHash('sha1');
		hash.update(content);

		let sha1 = hash.digest('hex');
		if (sha1 == LAST_SHA1) 
			return console.log(`\n  OK: local file is based on latest remote file\n`);
		return console.log(`\n  warning: remote file has been updated, please update local file!\n`);
	});
}).on('error', err => {
	throw err
});
console.log(`start requesting ${FILE_NAME} ...`);