#!/usr/bin/env node

//@ts-check
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '..');
const I18N_DIR = path.join(PROJECT_DIR, 'lib', 'i18n');

main();
function main() {
	console.log('[.] loading i18n config files ...');
	const configFiles = fs.readdirSync(I18N_DIR).filter(it => /\.js$/i.test(it));
	const configItems = configFiles.map(it => loadI18NConfig(it));
	const enConfig = configItems.find(it => it.lang === 'en');

	console.log('[.] validating i18n config files ...');
	configItems.forEach(config => {
		const expected = new Set(Object.keys(enConfig.data));

		Object.keys(config.data).forEach(it => {
			if (expected.has(it))
				return expected.delete(it);
			fatal(`${it} is invalid in i18n file: ${config.source}`);
		});

		for (const missing of Array.from(expected))
			fatal(`${missing} in i18n file: ${config.source}`);
	});

	console.log('[.] generating i18n target files for VSCode extension ...')
	configItems.forEach(it =>
		fs.writeFileSync(path.join(PROJECT_DIR, it.target), JSON.stringify(it.data, null, '\t')));

	console.log('[+] setup i18n success!');
}


function loadI18NConfig(configFileName = '') {
	try {
		const rawData = require(path.join(I18N_DIR, configFileName));
		return {
			lang: getConfigLanguage(),
			source: configFileName,
			target: getTargetFileName(),
			data: flatten(rawData),
		};
	} catch (error) {
		fatal(error);
	}

	function flatten(obj, out = {}, prefix = '') {
		Object.keys(obj).forEach(key => {
			let value = obj[key];
			if (prefix) key = `${prefix}.${key}`;

			if (Array.isArray(value)) // multi-line strings
				value = value.join('\n');
			if (typeof value === 'object' && value)
				return flatten(value, out, key);
			out[key] = value;
		});
		return out;
	}
	function getTargetFileName() {
		const lang = getConfigLanguage();
		return lang === 'en' ? 'package.nls.json' : `package.nls.${lang}.json`;
	}
	function getConfigLanguage() {
		return configFileName.replace('.js', '').toLowerCase();
	}
}

function fatal(reason) {
	console.error(`[-] fatal: ${String(reason.stack || reason)}`);
	process.exit(1);
}
