# Visual Studio Code Coding Tracker

Collect your coding activities. And give you a report group by date, languages, files, projects and more.

And all part of tracker are open source and hosted on Github

![screenshots1](https://raw.githubusercontent.com/hangxingliu/vscode-coding-tracker-server/master/screenshots/1.png)

## How To Use (Easy And Common Way)

**Applicable to people dont want to read below long text and only work with VSCode in one computer**

1. Install this extension(You must know how to do it, click install button)
2. Reload VSCode and continue coding in VSCode
3. When you want to know how many times you coding/watching in VSCode, just open command panel in VSCode
(in default press: `F1`), And search and click command **"CodingTracker: Show your coding activities report"**
4. And then you could see the report web page like above screenshots

## How To Use (Fully guide)

> VSCode Coding Tracker actually has two part: extension and server (C/S)
>
> And there a server program in the extension and it is the default server.
> 
> But also install server program to your remote server to tracking more coding actions in VSCode between different computers
>
> Server program repository: [vscode-coding-tracker-server](https://github.com/hangxingliu/vscode-coding-tracker-server)

### Step1. Installing extension to your VSCode

Search `vscode-coding-tracker` in VSCode extension panel and install it.

### Step2. Install and Launching tracker server in remote server or local

#### Local computer (controlled by VSCode)

you need to do anything(And **don't** change the configuration `codingTracker.localServerMode` to `false`)

In this situation, the database file are located in `$HOME/.coding-tracker/`

#### Local computer (controlled by yourself)

0. Set your vscode configuration `codingTracker.localServerMode` to `false`
1. Open a terminal/command line
2. Change path to `%HOME%/.vscode/extensions/hangxingliu.vscode-coding-tracker-0.4.0`
	- In Windows OS, enter command: `cd %HOME%/.vscode/extensions/hangxingliu.vscode-coding-tracker-0.4.0`
	- In Linux/Mac OS, enter command: `cd $HOME/.vscode/extensions/hangxingliu.vscode-coding-tracker-0.4.0`
3. Execute `npm i`
4. Launch tracker server by using command: `npm start -- -t ${REPLACE_TO_YOUR_TOKEN}`
	- Such as `npm start -- -t test_token`, means your upload token is `test_token`
	- And you can get more configurations and descriptions by using command `npm start -- --help`
	- Be care! It is necessary to add `--` following to `npm start` to passing following arguments to tracker server
5. And your tracking data is under `./database` in default.

#### Remote server

0. Set your vscode configuration `codingTracker.localServerMode` to `false`
1. Login into your remote server
2. Be sure to install `node` and `npm` environments
3. Typing command `npm i vscode-coding-tracker-server` (Global install: append ` -g` to the command)
4. Launch tracker server by using command: `npm start -- -t ${REPLACE_TO_YOUR_TOKEN}`
5. And your tracking data is under `./database` in default.

### Step 3. Configuring the upload token and your server address in your VSCode

configurations:

- `codingTracker.serverURL` (set up such as "http://localhost:10345")
	- If you use local tracker server and use default config, you can ignore this config.
	- Because default value of this config is `http://loclahost:10345` 
- `codingTracker.uploadToken` (set up such as "123456")
	- Setting up this value same as the token you launch your server
- `codingTracker.computerId` (set up this computer name then you can easy to know which computer you coding more time)
	- (Optional Config)
- `codingTracker.localServerMode` (in default is true). Please refer above

### Step 4. See your report

Open command panel in your VSCode.Then search and click command `CodingTracker: Show your coding activities report`

Or, just open browser and enter `http://${YOUR_SERVER_HOST_NAME}:${PORT}/report/?token=${API_TOKEN}`

- Such as `http://127.0.0.1:10345/report/`
- Such as `http://mydomain.com:10345/report/?token=myUploadToken`

### More commands:

- `codingTracker.startLocalServer` 
- `codingTracker.stopLocalServer` 
- `codingTracker.showReport`


## Current Version

### 0.4.0

0. fixed the bug "could not upload error" caused by switching VSCode windows

more version information: [CHANGELOG.md](CHANGELOG.md)

## File List

redirect to [FILES.md](FILES.md)

## Author

[LiuYue](https://github.com/hangxingliu)

## Thanks

This extension icon from [emojione](http://emojione.com/), This project help me a lot of (bkz I dont know how to use PS and dont have art sense).

## License

- Extension(part except icon) and server scripts: [GPL-3.0](LICENSE)
- Extension Icon[CC-BY 4.0](http://emojione.com/licensing/)
