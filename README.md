# Visual Studio Code Coding Tracker

Collect your coding activities. And give you a report group by date, languages, files, projects and more.

And all part of tracker are open source and hosted on Github

Available display language: English, Russian, 简体中文, 繁體中文

![screenshots1](https://raw.githubusercontent.com/hangxingliu/vscode-coding-tracker-server/master/screenshots/1.png)

## Current Version

### 0.5.0

`Working...`

0. Add Git branch information tracking

### 0.4.2

0. Add configuration `showStatus` to controlling visibility of status bar information

### 0.4.1

0. Add Russian translations. (Include report page) (Thank [Dolgishev Viktor (@vdolgishev)][vdolgishev])
1. Update server program to 0.4.1 (**Fixed fatal bug**)

### 0.4.0

0. Fixed the bug "could not upload error" caused by switching VSCode windows
1. New report page (support i18n, detailed report, share ...) (vscode-coding-tracker-server => 0.4.0)
2. Add configuration "moreThinkingTime". Adjust it to make report more accurate for your coding habits

more version information: [CHANGELOG.md](CHANGELOG.md)

## How To Use (Easy And Common Way)

**Applicable to people dont want to read below long text and only work with VSCode in one computer**

1. Install this extension and reload VSCode (You must know how to do it, click install button)
2. Coding...  Coding...  Coding... 
3. Do you want to know how many time elapsed in your coding activity ? open command panel(press `F1`) in VSCode
4. Searching and clicking command **"CodingTracker: Show your coding activities report"**. Then you will get it.

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
	- Because default value of this config is `http://localhost:10345` 
- `codingTracker.uploadToken` (set up such as "123456")
	- Setting up this value same as the token you launch your server
- `codingTracker.computerId` (set up this computer name then you can easy to know which computer you coding more time)
	- (Optional config)
- `codingTracker.localServerMode` (in default is true). Please refer above
- `codingTracker.moreThinkingTime` (in default is 0 ). More thinking time for tracking
	- This config is making for people need more thinking time in coding activity.
	- The bigger value you set the longer time you get in report time
	- **I don't recommend setting up this value bigger, Because I believe the default think time in extension is nice followed my usage**

### Step 4. See your report

Open command panel in your VSCode.Then search and click command `CodingTracker: Show your coding activities report`

Or, just open browser and enter `http://${YOUR_SERVER_HOST_NAME}:${PORT}/report/?token=${API_TOKEN}`

- Such as `http://127.0.0.1:10345/report/`
- Such as `http://mydomain.com:10345/report/?token=myUploadToken`

### More commands:

- `codingTracker.startLocalServer` 
- `codingTracker.stopLocalServer` 
- `codingTracker.showReport`

## File List

redirect to [FILES.md](FILES.md)

## Author

[LiuYue](https://github.com/hangxingliu)

## Thanks

This extension icon from [emojione](http://emojione.com/), This project help me a lot of (bkz I dont know how to use PS and dont have art sense).

### Contributors

- [Ted Piotrowski (@ted-piotrowski)][ted-piotrowski]
- [Dolgishev Viktor (@vdolgishev)][vdolgishev]

## License

- Extension(part except icon) and server scripts: [GPL-3.0](LICENSE)
- Extension Icon[CC-BY 4.0](http://emojione.com/licensing/)

[vdolgishev]: https://github.com/vdolgishev
[ted-piotrowski]: https://github.com/ted-piotrowski