/// <reference path="../index.d.ts" />
/// <reference path="../../vscode.d.ts" />

let vscode = require('vscode'),
	fs = require('fs'),	
	log = require('../Log'),
	git = require('../thirdPartyCodes/gitPaths'),
	{ resolve } = require('path');

const CACHE_REPO = 2 * 60 * 1000; //repo cache valid time: 2 minutes
const CACHE_BRANCH = 30 * 1000;//branch cache valid time 30 seconds

let isWorkspaceRoot = path => resolve(vscode.workspace.rootPath) == resolve(path);

/**
 * This cache object could improve extension to avoid querying repository path again
 * @type {VCSCacheMap}
 */
let cacheRepo = {}, cacheBranch = {};

/**
 * @param {VCSCacheMap} cacheMap 
 * @param {string} key 
 */
function queryCache(cacheMap, key) { 
	if (!key || !cacheMap[key]) return;
	let now = Date.now(), it = cacheMap[key];
	if (it.expiredTime < now) {
		delete cacheMap[key];
		return;
	}
	return it;
}
function addCache(cacheMap, key, cache, time) {
	// cacheMap[key] = { cache, expiredTime: Date.now() + time };
}
function addRepoCache(fileName, repoCache) { addCache(cacheRepo, fileName, repoCache, CACHE_REPO); }
function addBranchCache(repoPath, branchCache) { addCache(cacheBranch, repoPath, branchCache, CACHE_BRANCH); }


/** @param {string} documentFileName */
function getRepoPath(documentFileName) {
	return new Promise((resolve, reject) => {
		let it = queryCache(cacheRepo, documentFileName);
		if (it) return it.cache;
		git.getGitRepositoryPath(documentFileName)
			.then(repoPath => { addRepoCache(documentFileName, repoPath); resolve(repoPath);})
			.catch(reject);
	})
}
/** @param {string} repoPath */
function getBranch(repoPath) {
	return new Promise((resolve, reject) => {
		let it = queryCache(cacheBranch, repoPath);
		if (it) return it.cache;
		git.getGitBranch(repoPath)
			.then(branch => { addBranchCache(repoPath, branch); resolve(branch);})
			.catch(reject);
	})
}

/**
 * querying vcs info one by one
 * @type {Array<{file: string;callback: Function;}>}
 */
let getVCSInfoQueue = [];
let gettingVCSInfoLocker = false;

/**
 * @param {string} documentFileName
 * @param {Function} callback
 */
function getVCSInfo(documentFileName, callback) {
	getVCSInfoQueue.push({ file: documentFileName, callback });
	_getVCSInfo();
}
function _getVCSInfo() { 
	if (gettingVCSInfoLocker || getVCSInfoQueue.length == 0)
		return;
	gettingVCSInfoLocker = true;

	let item = getVCSInfoQueue[getVCSInfoQueue.length - 1];
	let _repoPath = null;
	
	//Avoiding error in getting vcs information for a file was deleted
	if (!fs.existsSync(item.file))
		return finish(), resolve(null);
	
	getRepoPath(item.file)
		.then(repoPath =>
			(_repoPath = repoPath) ? getBranch(repoPath) : Promise.resolve(null))
		.then(branch => {
			finish();
			item.callback(encodeVCSInfo(item.file, _repoPath, branch))
		}).catch(err => {
			finish();
			log.e('get vcs info error:', item.file, err ? (err.stack || err) : err)
			return resolve(null);
		});
	
	function finish() { 
		getVCSInfoQueue.pop();
		gettingVCSInfoLocker = false;
		process.nextTick(_getVCSInfo);
	}
}

function encodeVCSInfo(fileName, repoPath, branch) {
	if (!repoPath) return log.d(`Can not find any vcs info of document: ${fileName}`), null;
	if (!branch) return log.w(`The vcs "${repoPath}" has not branch information!`), null;
	repoPath = isWorkspaceRoot(repoPath) ? '' : repoPath;
	log.d(`got vcs info: git(repo: ${repoPath})(branch: ${branch})\n    document: ${fileName}`)
	return ['git', repoPath, branch];
}

module.exports = {
	getVCSInfo,
	get _getVCSInfoQueue() { return getVCSInfoQueue; }
};