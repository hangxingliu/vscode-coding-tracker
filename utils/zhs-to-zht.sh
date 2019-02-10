#!/usr/bin/env bash

throw() { echo "[-] fatal: $1"; exit 1; }

# goto project directory
pushd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )";

# pre-check
[[ -n `which opencc` ]] || throw "opencc is not installed! (sudo apt install opencc)";
[[ -f ./lib/i18n/zh-cn.js ]] || throw "./lib/i18n/zh-cn.js is not a file!";

opencc -i ./lib/i18n/zh-cn.js -c s2twp.json -o ./lib/i18n/zh-tw.js || throw "opencc convert failed!";

echo "[+] translated to ./lib/i18n/zh-tw.js";
