//@ts-check

/*
	This module is used for probe exetnsion running environment.
	It can detect if modules are existed, i18n files are existed.
	And it can also generate diagnose file in the extension directory.
*/

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const getFilePath = filePath => path.resolve(rootDir, filePath);
const getModulePath = moduleName => path.resolve(rootDir, 'node_modules', moduleName);

module.exports = { generateDiagnoseLogFile };

function generateDiagnoseLogFile() {
	try {
		let dir = rootDir;
		if (!isWritable(dir)) dir = require('os').tmpdir();
		if (!isWritable(dir)) throw new Error(`${dir} is not writable`);

		const log = generateDiagnoseContent();
		fs.writeFileSync(path.resolve(dir, 'diagnose.log'), log);
	} catch (error) {
		onError(error);
	}
}

function generateDiagnoseContent() {
	const vscode = safeRequire('vscode');
	const vscodeEnv = vscode && vscode.env || {};
	const packageJson = getPackageJson();
	const i18nJson = getPackageNLSJson();
	return JSON.stringify({
		vscodeAppName: vscodeEnv.appName,
		vscodeAppRoot: vscodeEnv.appRoot,
		vscodeLanguage: vscodeEnv.language,
		packageJsonOk: !!packageJson,
		i18nJsonOk: !!i18nJson,
		dependencies: getDependencies(packageJson),
	}, null, 2);
}


function getDependencies(packageJson) {
	try {
		const deps = Object.keys(packageJson.dependencies);
		return deps.map(name => {
			const modulePath = getModulePath(name);
			return {
				name,
				path: modulePath,
				ok: !!isModuleExisted(name),
			};
		});
	} catch (error) {
		onError(error);
		return [];
	}
}

function getPackageJson() {
	try {
		return JSON.parse(fs.readFileSync(getFilePath('package.json'), 'utf8'));
	} catch (error) {
		onError(error);
		return null;
	}
}

function getPackageNLSJson() {
	try {
		return JSON.parse(fs.readFileSync(getFilePath('package.nls.json'), 'utf8'));
	} catch (error) {
		onError(error);
		return null;
	}
}

function safeRequire(name) {
	try {
		return require(name);
	} catch (error) {
		onError(error);
	}
}

function isModuleExisted(name) {
	try {
		return fs.existsSync(getModulePath(name));
	} catch (error) {
		onError(error);
		return false;
	}
}

function isWritable(dir) {
	try {
		fs.accessSync(dir, fs.constants.W_OK);
		return true;
	} catch (error) {
		return false;
	}
}

function onError(error) {
	// eslint-disable-next-line no-console
	console.error(`EnvironmentProbe:`, error);
}

