# Visual Studio Code Coding Tracker

Your coding activities tracker. record your coding time, 
coding file type, expenditure of file in a project   

## How To Use

### Installing extension to your VSCode

`ext install vscode-coding-tracker`   
or search `vscode-coding-tracker` in the extensions panel and click Install button.

### Launching your tracking server(Local or Remote)

1. Server script is under the folder `server`    
(You can find it on your local extension folder **`%USERPROFILE%/.vscode/hangxingliu.vscode-coding-tracker-0.1.4`**)   
or (**[My Github repository server folder](https://github.com/hangxingliu/vscode-coding-tracker/tree/master/server)**)
2. Install server script by `npm i` under the folder `server`
3. Launch the server script by using commander `node app.js -t ${YOUR_TOKEN}`   
(**replace the `${YOUR_TOKEN}` to a specified string**) under the foler `server`   
and you can also get the server script help by using `node app.js -h`

### Configurating the upload token and your server address in your vscode

configurations:

- `codingTracker.serverURL` (set up such as "http://localhost:10345")
- `codingTracker.uploadToken` (set up such as "123456")
- `codingTracker.computerId` (set up this computer name then you can easy to know which computer
 you coding more time)
- `codingTracker.localMode` (start a local server)

actions:
- `codingTracker.restartLocalServer` (localMode: restart local server)
- `codingTracker.stopLocalServer` (localMode: stop local server)
- `codingTracker.showReport` (localMode: show local analyze report)

## Current Version

### 0.1.5 

0. Be sure to upgrade, reason be following 
1. Fixed two severe bugs. So you will get your right coding and watching time

### 0.1.4

0. Add computer Id to tracking data(You can specify your Id by set up vscode config
 `codingTracker.computerId` )
1. Fixed some spelling mistake in the code and change some comment from Chinese to English
2. Change tracking data time format from datetime format string to timestamp
3. Please upgrade your server program to at least 1.3.0 to support receive tracking data 
 and storage data in version 3.0  

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