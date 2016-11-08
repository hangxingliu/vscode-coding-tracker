# File List

## Extension files

- `extension.js` This VSCode extension main source file

- `lib/Log.js` Log module file be used to controlling log output
- `lib/VSCodeHelper.js` VSCode extension helper module be used to using vscode API easy
- `lib/Uploader.js` Tracking data upload module
- `lib/UploadObjectGenerator.js` Pack up the tracking data to a uploadable object

- `.vscodeignore` VSCode extension ignore list file(VSCode will doesn't copy these file 
when install this extension)

- `package.json` VSCode extension and NPM information file be used to defining 
vscode extension commands and configurations, declaring the dependent module of this extension.

- `images/icon.png` Extension icon from [emojione](http://emojione.com/)

## Server side files

- `server/app.js` A simple server program script be used to receving 
the data uploaded by extension

- `server/lib/Handler404and500.js` add page not found and server error handler to express server
- `server/lib/Launcher.js` a module to get server script launch arguments and echo help information by **commander** library
- `server/lib/Log.js` log module
- `server/lib/ParamsChecker.js` check upload data complete
- `server/lib/Storage.js` module to storage tracking data
- `server/lib/TokenMiddleware.js` a token middleware to check upload token
- `server/lib/Version.js` version description and check module
- `server/lib/Welcome.js` module to echo welcome and version information to express server

- `server/database/*.*` Data of your vscode using track

## Other files

- `types/*.*` Some files around typescript intellisense files

- `flowchart/flow.dot` A flow chart diagrammatized the main process of 
this extension dot language source
- `flowchart/flow.svg` a flow chart svg image be generated from `flow.dot`

- `.vscode/*.*` the vscode configurations of this project

- `.gitignore` git ignore files list

- `jsconfig.json` vscode javascript intellisense configuration file

- `LICENSE` the opensource license file of this project
(include extension and server script)

- `CHANGELOG.md` the changelog of this project
- `TODO.md` TODO list of features I want to add in and the bugs I need to fix
- `FILES.md` the file you are reading now.
- `README.md` README file of this project
