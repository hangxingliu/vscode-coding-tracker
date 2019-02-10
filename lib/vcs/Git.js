//@ts-check
/// <reference path="../index.d.ts" />

const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const log = require('../Log');
const git = require('../thirdPartyCodes/gitPaths');

const CACHE_REPO = 5 * 60 * 1000;  //repo cache valid time: 5 minutes
const CACHE_BRANCH = 30 * 1000;    //branch cache valid time 30 seconds

/**
 * This cache object could improve extension to avoid querying repository path again
 * @type {VCSCacheMap}
 */
let cacheRepo = {};
/**
 * This cache object could improve extension to avoid querying branch again
 * @type {VCSCacheMap}
 */
let cacheBranch = {};

//  _____                       _
// | ____|_  ___ __   ___  _ __| |_
// |  _| \ \/ / '_ \ / _ \| '__| __|
// | |___ >  <| |_) | (_) | |  | |_
// |_____/_/\_\ .__/ \___/|_|   \__|
//            |_|
module.exports = { getVCSInfo };

function isWorkspaceRoot(dirPath) {
	return path.resolve(vscode.workspace.rootPath) == path.resolve(dirPath);
}

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
			.then(repoPath => { addRepoCache(documentFileName, repoPath); resolve(repoPath); })
			.catch(reject);
	})
}
/** @param {string} repoPath */
function getBranch(repoPath) {
	return new Promise((resolve, reject) => {
		let it = queryCache(cacheBranch, repoPath);
		if (it) return it.cache;
		git.getGitBranch(repoPath)
			.then(branch => { addBranchCache(repoPath, branch); resolve(branch); })
			.catch(reject);
	})
}

/**
 * This function will be always resolved with a vcs string or undefined
 * @param {string} documentFileName
 * @returns {Promise<string>}
 */
function getVCSInfo(documentFileName) {
	const NO_VCS_INFO = Promise.resolve(undefined);

	if (!fs.existsSync(documentFileName))
		return NO_VCS_INFO;

	return getRepoPath(documentFileName).then(repoPath => {
		if (!repoPath)
			return NO_VCS_INFO;

		return getBranch(repoPath)
			.then(branch => encodeVCSInfo(documentFileName, repoPath, branch));
	}).catch(error => {
		log.e('get vcs info error:', documentFileName, error);
		return NO_VCS_INFO;
	});
}

function encodeVCSInfo(fileName, repoPath, branch) {
	if (!repoPath) return log.d(`Can not find any vcs info of document: ${fileName}`), null;
	if (!branch) return log.w(`The vcs "${repoPath}" has not branch information!`), null;
	repoPath = isWorkspaceRoot(repoPath) ? '' : repoPath;
	log.d(`got vcs info: git(repo: ${repoPath})(branch: ${branch})\n    document: ${fileName}`)
	return ['git', repoPath, branch];
}


