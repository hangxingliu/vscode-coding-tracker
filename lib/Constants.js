//@ts-check

const fs = require('fs');
const path = require('path');

const isDebugMode = isAnyFileExisted(
	path.resolve(__dirname, '..', 'DEBUG_SIGN_FILE'),
	path.resolve(__dirname, 'DEBUG_SIGN_FILE'),
);

module.exports = {
	isDebugMode,

	prefix: 'coding-tracker',
	outputChannelName: 'Coding Tracker',
};

//#====================================
//#region module private functions

function isAnyFileExisted(...files) {
	for (const file of files) {
		try {
			if (fs.existsSync(file))
				return true;
		} catch (error) {
			continue;
		}
	}
	return false;
}

//#endregion
