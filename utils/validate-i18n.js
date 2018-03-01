#!/usr/bin/env node

//@ts-check

const BASE_DIR = __dirname + `/..`;
const I18N_BASE = `package.nls.json`;
const I18N_OTHER = /^package\.nls\.[\w\-]+\.json$/;

let hasError = false;

let fs = require('fs'), path = require('path'),
	loadJSON = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8')),
	error = reason => { console.error(`  fatal: ${reason}`); hasError = true; };

let i18nNames = Object.keys(loadJSON(path.join(BASE_DIR, I18N_BASE)));

fs.readdirSync(BASE_DIR)
	.filter(f => f.match(I18N_OTHER))
	.forEach(f => {
		let i18n = loadJSON(path.join(BASE_DIR, f));
		
		let expected = {};
		i18nNames.forEach(name => expected[name] = true);

		for (let name in i18n) { 
			if (name in expected)
				delete expected[name];
			else
				error(`${name} is invalid in "${f}"`);
		}

		for (let name in expected)
			error(`${name} is missing in "${f}"`);
		
	});

if (hasError) { 
	process.exit(1);
} else {
	console.log('success: all i18n files are valid!');
}
