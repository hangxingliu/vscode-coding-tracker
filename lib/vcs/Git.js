/// <reference path="../index.d.ts" />
/// <reference path="../../vscode.d.ts" />

let vscode = require('vscode'),
	log = require('../Log'),
	git = require('../thirdPartyCodes/gitPaths'),
	{ resolve } = require('path');

let isWorkspaceRoot = path => resolve(vscode.workspace.rootPath) == resolve(path);

// This cache object could improve extension to avoid querying repository path again
let cache = { fileName: void 0, repoPath: void 0 };

/** @param {VSCodeTextDocument} document */
function getRepoPath(document) {
	let { fileName } = document;
	return new Promise((resolve, reject) => {
		if (fileName && cache.fileName === fileName) return cache.repoPath;
		cache.fileName = fileName;
		git.getGitRepositoryPath(fileName).then(resolve).catch(reject);
	})
}

/**
 * @param {VSCodeTextDocument} document 
 * @returns {Promise<string>} A Promise must be resolve
 */
function getVCSInfo(document) {
	return new Promise((resolve/*, reject*/) =>
		getRepoPath(document)
			.then(repoPath => {
				cache.repoPath = repoPath;
				return repoPath ? git.getGitBranch(repoPath) : Promise.resolve(null);
			})
			.then(branch => resolve(encodeVCSInfo(document.fileName, cache.repoPath, branch)))
			.catch(err => {
				log.e('get vcs info error:', document, err ? (err.stack || err) : err)
				return resolve('::');
			}));
}
function encodeVCSInfo(fileName, repoPath, branch) {
	if (!repoPath) return log.d(`Can not find any vcs info of document: ${fileName}`), '::';
	if (!branch) return log.w(`The vcs "${repoPath}" has not branch information!`), '::';
	repoPath = isWorkspaceRoot(repoPath) ? '' : repoPath;
	let str = `git:${repoPath}:${branch}`;
	return log.d(`vcs info: ${str}\n  document: ${fileName}`), str;
}

module.exports = { getVCSInfo };