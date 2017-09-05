# File List

## Extension files

- `extension.js` This VSCode extension main source file

- `lib/Log.js` Log module file be used to controlling log output
- `lib/VSCodeHelper.js` VSCode extension helper module be used to using vscode API easy
- `lib/Uploader.js` Tracking data upload module
- `lib/UploadObjectGenerator.js` Pack up the tracking data to a uploadable object
- `lib/LocalServer.js` launch, kill and manage local server
- `lib/OutputChannelLog.js` a log module for local server and show in the OutputChannel of VSCode
- `lib/StatusBarManage.js` a status bar information and tooltip manager module

- `.vscodeignore` VSCode extension ignore list file(VSCode will doesn't copy these file 
when install this extension)

- `package.json` VSCode extension and NPM information file be used to defining 
vscode extension commands and configurations, declaring the dependent module of this extension.
- `package.nls.json` i18n file for package.json

- `images/icon.png` Extension icon from [emojione](http://emojione.com/)

## Other files

- `flowchart/flow.dot` A flow chart diagrammatized the main process of 
this extension dot language source
- `flowchart/flow.svg` a flow chart svg image be generated from `flow.dot`

- `.vscode/*.*` the vscode configurations of this project

- `.gitignore` git ignore files list

- `jsconfig.json` vscode javascript intellisense configuration file

- `LICENSE` the open-source license file of this project
(include extension and server script)

- `CHANGELOG.md` the changelog of this project
- `TODO.md` TODO list of features I want to add in and the bugs I need to fix
- `FILES.md` the file you are reading now.
- `README.md` README file of this project
