# Visual Studio Code Coding Tracker

Your coding activities tracker. record your coding time, 
codeing file type, expenditure of file in a project   

## How To Use

1. Installing this extension by command `ext install ...`(I have not upload 
this extension to the marketplace of vscode) or execute the command `npm i`
and copy this project folder into the extension folder of vscode
(Windows path: `%USERPROFILE%\.vscode\extensions`)
2. Launching the server script(`server/app.js`) by using `node app.js -t $TOKEN`
(replace the `$TOKEN` to a specified string) under the foler `server` 
 and you can also get the server script help by using `node app.js -h`
3. Configurating the upload token in the vscode(configuration 
item: `codingTracker.uploadToken`) to your `$TOKEN` you specified when 
you launched the server script.
## File List

### Extension files

- `extension.js` This VSCode extension main source file
- `lib/Log.js` Log module file be used to controlling log output
- `lib/VSCodeHelper.js` VSCode extension helper module be used to using vscode API easy
- `.vscodeignore` VSCode extension ignore list file(VSCode will doesn't copy these file 
when install this extension)
- `package.json` VSCode extension and NPM information file be used to defining 
vscode extension commands and configurations, declaring the dependent module of this extension.

### Server side files

- `server/app.js` A simple server program script be used to receving 
the data uploaded by extension
- `server/database/*.*` Data of your vscode using track

### Other files

- `flowchart/flow.dot` A flow chart diagrammatized the main process of 
this extension dot language source
- `flowchart/flow.svg` a flow chart svg image be generated from `flow.dot`
- `typings/*.*` Many typescript template downloaded by `typings` and 
be used to vscode intellisense
- `.vscode/*.*` the vscode configurations of this project
- `.gitignore` git ignore files list
- `jsconfig.json` vscode javascript intellisense configuration file
- `LICENSE` the opensource license file of this project
(include extension and server script)
- `CHANGELOG` the changelog of this project
- `TODO` TODO list of features I want to add in and the bugs I need to fix
- `README.md` the file you are reading now.

## Author

[LiuYue](https://github.com/hangxingliu)

## License

[GPL-3.0](LICENSE)
