//@ts-check

module.exports = {
	getProxyConfiguration
};

function isNull(obj) { return typeof obj === 'object' && !obj; }

/**
 * return:
 *   undefined means DON'T set `proxy` for request library.
 *   false means set `proxy` as false for request library.
 *   a string means set `proxy` as this string for request library.
 *
 * @param {string|undefined} cfgHttpProxy
 * @param {string|boolean|undefined} cfgCodingTrackerProxy
 * @returns {undefined|string|false}
 */
function getProxyConfiguration(cfgHttpProxy, cfgCodingTrackerProxy) {
	// normalize `codingTracker.proxy`:
	if (typeof cfgCodingTrackerProxy === 'string') {
		if (cfgCodingTrackerProxy === '' || cfgCodingTrackerProxy === 'auto') {
			cfgCodingTrackerProxy = true;

		} else if (
			cfgCodingTrackerProxy === 'noproxy' ||
			cfgCodingTrackerProxy === 'no-proxy' ||
			cfgCodingTrackerProxy === 'no_proxy') {

			cfgCodingTrackerProxy = false;
		}

	} else if (typeof cfgCodingTrackerProxy === 'undefined' || isNull(cfgCodingTrackerProxy)) {
		cfgCodingTrackerProxy = true; // auto
	}

	// merge
	if (cfgCodingTrackerProxy === true) { // auto proxy
		if (typeof cfgHttpProxy === 'string' && cfgHttpProxy)
			return cfgHttpProxy; // use vscode config `http.proxy`
		return undefined; // use proxy from system environment variables by request
	}

	if (cfgCodingTrackerProxy === false) { // disable proxy
		return false;
	}

	return cfgCodingTrackerProxy;
}
