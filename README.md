# Visual Studio Code Coding Tracker

**A VSCode extension that track your coding activities and generate report about your coding.**   
You can know how much time you spent on each projects/files/computers/languages/branchs and total
 by this extension.

Supported languages:
English, Russian(русский), Spanish(Español),
 Simplified Chinese(简体中文) and Traditional Chinese(繁體中文).

All part of this extension(included server program, documents) are open-source and hosted on Github.

> Links:  
> [Server program Github repo](https://github.com/hangxingliu/vscode-coding-tracker-server)   
> [VSCode extensions marketplace](https://marketplace.visualstudio.com/items?itemName=hangxingliu.vscode-coding-tracker)   

## Screenshot

![screenshots2](https://raw.githubusercontent.com/hangxingliu/vscode-coding-tracker-server/master/screenshots/2.jpg)

## Current Version

### 0.7.0 (Next version)

1. Fix local server launch faild on users who have not install `Node.js` or installed `nvm`.

If you want use this version now,
**you can uninstall old version in VSCode, And clone this repository into `$HOME/.vscode/extensions`**

### 0.6.0 (2018/03/25)

1. Upgrade server program (report page) to 0.6.0
	- export/download report as CSV
	- merge report from different projects
	- fix some bug on report page
	- more compatible with old browsers and mobile browsers
2. Optimize for some vscode internal documents. (*Default settings, markdown preview, interactive playground*)
3. Add Español translations into extension.

more version information: [CHANGELOG.md](CHANGELOG.md)

## **How To Use (Easy And Common Way)**

**Applicable to people dont want to read below long text and only use VSCode in one computer**

1. Install this extension.
2. Coding as you did before.
3. Get your coding report by command **CodingTracker: Show your coding activities report**
	- *press `F1` to open VSCode command panel, then search command above and click it*

## How To Use (Fully guide) **TLDR**

> VSCode Coding Tracker actually has two part: extension and server (C/S)
>
> And extension use internal server installed in *node_modules* by default.
>
> But you could install a server program on you server and use it on VSCode on different computers. 
>
> Server program repository: [vscode-coding-tracker-server](https://github.com/hangxingliu/vscode-coding-tracker-server)

### Step1. Installing extension to your VSCode

Search `vscode-coding-tracker` in VSCode extension panel and install it.

### Step2. Install and Launching tracker server in remote server or local

#### Local computer (controlled by VSCode)

You don't need to do anything.(And **don't** change the configuration `codingTracker.localServerMode` to `false`)

In this situation, the database files are located in `$HOME/.coding-tracker/`

#### Local computer (controlled by yourself)

0. Set your vscode configuration `codingTracker.localServerMode` to `false`
1. Open a terminal/command line
2. Change path to `%HOME%/.vscode/extensions/hangxingliu.vscode-coding-tracker-0.6.0`
	- In Windows OS, enter command: `cd %HOME%/.vscode/extensions/hangxingliu.vscode-coding-tracker-0.6.0`
	- In Linux/Mac OS, enter command: `cd $HOME/.vscode/extensions/hangxingliu.vscode-coding-tracker-0.6.0`
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

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md)

## Author

[LiuYue (hangxingliu)](https://github.com/hangxingliu)

## Contributors

- [Ted Piotrowski (@ted-piotrowski)][ted-piotrowski]
- [Dolgishev Viktor (@vdolgishev)][vdolgishev]

## Third party codes and resource

- The icon of this extension is from [emojione](http://emojione.com/). This project help me a lot of (bkz I dont know how to use PS and dont have art sense).
- `lib/thirdPartyCodes/gitPaths.js` is modified from <https://github.com/DonJayamanne/gitHistoryVSCode/blob/master/src/helpers/gitPaths.ts>

## License

- Extension(excluded icon and third party codes) and server scripts are licensed under [GPL-3.0](LICENSE)
- Icon of extension is licensed under [CC-BY 4.0](http://emojione.com/licensing/)
- Third party codes license information in the front of third party code files

[vdolgishev]: https://github.com/vdolgishev
[ted-piotrowski]: https://github.com/ted-piotrowski
