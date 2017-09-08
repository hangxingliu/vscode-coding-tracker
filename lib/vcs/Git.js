/// <reference path="../index.d.ts" />
/// <reference path="../../vscode.d.ts" />

let vscode = require('vscode'),
	log = require('../Log')	,
	git = require('../thirdPartyCodes/gitPaths');

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
 * @returns {string} 
 */
function getVCSInfo(document) {
	getRepoPath(document)
		.then(repoPath => repoPath
			? git.getGitBranch(cache.repoPath = repoPath)
			: Promise.resolve(cache.repoPath = null))
		.then(branch => {
			if (!cache.repoPath) return log.d('vcs info: no vcs!');
			if (!branch) return log.w(`vcs warn: no branch in ${cache.repoPath}`);
			log.d(`vcs info: git:${cache.repoPath}:${branch}`)
		})
		.catch(err => log.e('vcs error:', document, err ? (err.stack || err) : err ));
	return ''; // TODO
}

module.exports = { getVCSInfo };