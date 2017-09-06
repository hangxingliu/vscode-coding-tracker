#!/usr/bin/env bash

CURL='curl --silent --location ';
HASH='sha1sum'

PATH_GIT_PATHS='gitPaths.js'
SHA1_GIT_PATHS='3db1828b72ea1d88c7efe6e80a34e09ba1d056c7'
FROM_GIT_PATHS='https://raw.githubusercontent.com/DonJayamanne/gitHistoryVSCode/master/src/helpers/gitPaths.ts'


$CURL "$FROM_GIT_PATHS" | $HASH | grep "$SHA1_GIT_PATHS"
if [[ "$?" != "0" ]]; then
	echo "** AVAILABLE UPDATE: $PATH_GIT_PATHS **";
else
	echo "All third party codes is latest!"
fi