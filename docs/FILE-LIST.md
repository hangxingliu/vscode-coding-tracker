# File List

## Extension source files

- `extension.js`: The **entry** file of this extension.
- `lib/LocalServer.js`: Local server manager (launch, upload, switch and kill)
- `lib/Log.js`: Console log and VSCode popup message module
- `lib/OutputChannelLog.js`: Output into VSCode OutputChannel module 
	- `OutputChannel` is a pannel named `OUTPUT` in the bottom of VSCode
- `lib/StatusBarManage.js`: VSCode status bar manager module
- `lib/Uploader.js`: Uploader module 
- `lib/UploadObject.js`: A packer module that generate tracking data from orginal data
- `lib/VSCodeHelper.js`: A helper module for simplify VSCode extension API 
- `lib/vcs/Git.js`: A Git information getter module
- `lib/thirdPartyCodes/*.js`: Third party sources
- `lib/vscode.d.ts/FETCH.hs`: A script to fetch latest vscode.d.ts
- `lib/vscode.d.ts/*.d.ts`: VSCode extension API definition files
- `lib/index.d.ts`: Typs in the extension definition file 
- `utils/setup-i18n.js`: A script for setup VSCode extension i18n files 
- `package.json` Extension/NPM description file (defined meta info, extension commands and more ...)
- `package.nls.json` i18n file for package.json
- `package.nls.*.json` i18n files for package.json

## Development environment files

- `.vscodeignore`: Files ignore list for VSCode extension (prevent some files from being packed into distributed extension)
- `.gitignore`: Files ignore list for Git
- `.npmignore`: Files ignore list for NPM
- `.editoconfig`:
- `.eslintrc.json`: ESLint configurations
- `.vscode/*.*` the vscode configurations for this project
- `DEBUG_SIGN_FILE` file to enable debug mode for extension

## Resource files

- `images/icon.png` Extension icon from [emojione](http://emojione.com/)

## Documents

- `docs/*.md`
- `README.md`
- `CONTRIBUTING.md`
- `TODO.md`
- `CHANGELOG.md`
- `LICENSE`
