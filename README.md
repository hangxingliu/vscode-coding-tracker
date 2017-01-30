# Visual Studio Code Coding Tracker

Your coding activities tracker. record your coding time, 
coding file type, expenditure of file in a project   

## How To Use

### Step1. Installing extension to your VSCode

Typing `F1`(in default) in your VSCode to show commands input box and
input command `ext install vscode-coding-tracker` then enter   
Or. Search `vscode-coding-tracker` in the extensions panel (left side of VSCode in default)
and click Install button.

### Step2. Install and Launching tracker server in local computer or remote server

#### Local computer

0. Open a terminal/command line
1. Change path to `%HOME%/.vscode/extensions/hangxingliu.vscode-coding-tracker-0.2.0`
	- In Windows OS, enter command: `cd %HOME%/.vscode/extensions/hangxingliu.vscode-coding-tracker-0.2.0`
	- In Linux/Mac OS, enter command: `cd $HOME/.vscode/extensions/hangxingliu.vscode-coding-tracker-0.2.0`
2. Launch tracker server by using command: `npm start -- -t ${REPLACE_TO_YOUR_TOKEN}`
	- Such as `npm start -- -t test_token`, means your upload token is `test_token`
	- And you can get more configurations and descriptions by using command `npm start -- --help`
	- Be care! It is necessary to add `--` following to `npm start` to passing following arguments to tracker server
3. And your tracking data is under `./database` in default.

#### Remote server

0. Login into your remote server
1. Be sure to install `node` and `npm` environments
2. Typing command `npm i vscode-coding-tracker-server` (Global install: append ` -g` to the command)
3. Launch tracker server by using command: `npm start -- -t ${REPLACE_TO_YOUR_TOKEN}`
4. And your tracking data is under `./database` in default.

### Step 3. Configuring the upload token and your server address in your VSCode

configurations:

- `codingTracker.serverURL` (set up such as "http://localhost:10345")
	- If you use local tracker server and use default config, you can ignore this config.
	- Because default value of this config is `http://loclahost:10345` 
- `codingTracker.uploadToken` (set up such as "123456")
	- Setting up this value same as the token you launch your server
- `codingTracker.computerId` (set up this computer name then you can easy to know which computer you coding more time)
	- (Optional Config)

## Current Version

### 0.2.1

0. Fixed `npm start` occurs error in Windows.

### 0.2.0

0. Be sure to upgrade again, because accuracy of tracker has be improve
1. Separated the server side codes to other repository(but add this server side module to npm package dependencies.
So you can find server side codes under node_modules)
2. Ignored tracking invalid document times
3. Added listening onDidChangeTextEditorSelection event to improve accuracy
4. Tidied extension.js codes

more version information: [CHANGELOG.md](CHANGELOG.md)

## File List

redirect to [FILES.md](FILES.md)

## Author

[LiuYue](https://github.com/hangxingliu)

## Thanks

This extension icon from [emojione](http://emojione.com/), This project help me a lot of (bkz I dont need how to use PS and dont have art sense).

## License

- Extension(part except icon) and server scripts: [GPL-3.0](LICENSE)
- Extension Icon[CC-BY 4.0](http://emojione.com/licensing/)