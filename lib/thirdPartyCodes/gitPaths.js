/**
 * This codes is modified from "gitPaths.ts" in repository "DonJayamanne/gitHistoryVSCode"
 * @license MIT
 * @author DonJayamanne<don.jayamanne@yahoo.com>
 * @see https://github.com/DonJayamanne/gitHistoryVSCode/blob/master/src/helpers/gitPaths.ts
 */

//@ts-check
/// <reference path="../../vscode.d.ts" />

"use strict";

let vscode = require('vscode');
let log = require('../Log');
let { spawn, exec } = require('child_process'),
	fs = require('fs'),
	path = require('path');

// logger wrapper for original codes
let logger = { logInfo: log.d, logError: log.e };
let gitPath = void 0;

module.exports = {
	getGitBranch,
	getGitPath,
	getGitRepositoryPath
};

/** @returns {Promise<string>} */
function getGitPath() {
    if (gitPath !== undefined) {
        return Promise.resolve(gitPath);
    }
    return new Promise((resolve, reject) => {
        const gitPathConfig = vscode.workspace.getConfiguration('git').get('path');
        if (typeof gitPathConfig === 'string' && gitPathConfig.length > 0) {
            if (fs.existsSync(gitPathConfig)) {
                logger.logInfo(`git path: ${gitPathConfig} - from vscode settings`);
                gitPath = gitPathConfig;
                resolve(gitPathConfig);
                return;
            }
            else {
                logger.logError(`git path: ${gitPathConfig} - from vscode settings in invalid`);
            }
        }

        if (process.platform !== 'win32') {
            logger.logInfo(`git path: using PATH environment variable`);
            gitPath = 'git';
            resolve('git');
            return;
        }
        else {
            // in Git for Windows, the recommendation is not to put git into the PATH.
            // Instead, there is an entry in the Registry.
            let regQueryInstallPath = (location, view) => {
                return new Promise((resolve, reject) => {
                    let callback = function (error, stdout, stderr) {
                        if (error && error.code !== 0) {
                            error.stdout = stdout.toString();
                            error.stderr = stderr.toString();
                            reject(error);
                            return;
                        }

                        let installPath = stdout.toString().match(/InstallPath\s+REG_SZ\s+([^\r\n]+)\s*\r?\n/i)[1];
                        if (installPath) {
                            resolve(installPath + '\\bin\\git');
                        } else {
                            reject();
                        }
                    };

                    let viewArg = '';
                    switch (view) {
                        case '64': viewArg = '/reg:64'; break;
                        case '32': viewArg = '/reg:64'; break;
                        default: break;
                    }

                    exec('reg query ' + location + ' ' + viewArg, callback);
                });
            };

            let queryChained = (locations) => {
                return new Promise((resolve, reject) => {
                    if (locations.length === 0) {
                        reject('None of the known git Registry keys were found');
                        return;
                    }

                    let location = locations[0];
                    regQueryInstallPath(location.key, location.view).then(
                        (location) => resolve(location),
                        (error) => queryChained(locations.slice(1)).then(
                            (location) => resolve(location),
                            (error) => reject(error)
                        )
                    );
                });
            };

            queryChained([
                { key: 'HKCU\\SOFTWARE\\GitForWindows', view: null },     // user keys have precendence over
                { key: 'HKLM\\SOFTWARE\\GitForWindows', view: null },     // machine keys
                { key: 'HKCU\\SOFTWARE\\GitForWindows', view: '64' },   // default view (null) before 64bit view
                { key: 'HKLM\\SOFTWARE\\GitForWindows', view: '64' },
                { key: 'HKCU\\SOFTWARE\\GitForWindows', view: '32' },   // last is 32bit view, which will only be checked
                { key: 'HKLM\\SOFTWARE\\GitForWindows', view: '32' }]). // for a 32bit git installation on 64bit Windows
                then(
                (path) => {
                    logger.logInfo(`git path: ${path} - from registry`);
                    gitPath = path;
                    resolve(path);
                },
                (error) => {
                    logger.logInfo(`git path: falling back to PATH environment variable`);
                    gitPath = 'git';
                    resolve('git');
                });
        }
    });
}

/** @returns {Promise<string>} */
function getGitRepositoryPath(fileName = '') {
	return new Promise((resolve, reject) => {
		getGitPath().then(gitPath => {
			const directory = fs.existsSync(fileName) && fs.statSync(fileName).isDirectory() ? fileName : path.dirname(fileName);
			const options = { cwd: directory };
			const args = ['rev-parse', '--show-toplevel'];

			// logger.logInfo('git ' + args.join(' '));
			let ls = spawn(gitPath, args, options);

			let repoPath = '';
			let error = '';
			ls.stdout.on('data', function (data) {
				repoPath += data + '\n';
			});

			ls.stderr.on('data', function (data) {
				error += data;
			});

			ls.on('error', function (error) {
				logger.logError(error);
				reject(error);
				return;
			});

			ls.on('close', function () {
				if (error.length > 0) {
					logger.logInfo(error); //logError => logInfo such as "repository is not exist"
					// reject(error);
					return resolve(null);
				}
				let repositoryPath = repoPath.trim();
				if (!path.isAbsolute(repositoryPath)) {
					repositoryPath = path.join(path.dirname(fileName), repositoryPath);
				}
				logger.logInfo('git repo path: ' + repositoryPath);
				resolve(repositoryPath);
			});
		}).catch(reject);
    });
}

/** @returns {Promise<string>} */
function getGitBranch(repoPath = '') {
	return new Promise((resolve, reject) => {
		getGitPath().then(gitPath => {
			const options = { cwd: repoPath };
			const args = ['rev-parse', '--abbrev-ref', 'HEAD'];
			let branch = '';
			let error = '';
			let ls = spawn(gitPath, args, options);
			ls.stdout.on('data', function (data) {
				branch += data.slice(0, -1);
			});

			ls.stderr.on('data', function (data) {
				error += data;
			});

			ls.on('error', function (error) {
				logger.logError(error);
				reject(error);
				return;
			});

			ls.on('close', function () {
				resolve(branch);
			});
		}).catch(reject);
    });
}