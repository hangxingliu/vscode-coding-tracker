# Visual Studio Code Coding Tracker

Your coding activities tracker. record your coding time, 
codeing file type, expenditure of file in a project   

## How To Use

### Installing extension to your VSCode

`ext install vscode-coding-tracker`   
or search `vscode-coding-tracker` in the extensions panel and click Install button.

### Launching your tracking server(Local or Remote)

1. Server script is under the folder `server`    
(You can find it on your local extension folder **`%USERPROFILE%/.vscode/hangxingliu.vscode-coding-tracker-0.1.0`**)   
or (**[My Github repository server folder](https://github.com/hangxingliu/vscode-coding-tracker/tree/master/server)**)
2. Install server script by `npm i` under the folder `server`
3. Launch the server script by using commander `node app.js -t ${YOUR_TOKEN}`   
(**replace the `${YOUR_TOKEN}` to a specified string**) under the foler `server`   
and you can also get the server script help by using `node app.js -h`

### Configurating the upload token and your server address in your vscode

configurations:

- `codingTracker.serverURL` (set up such as "http://localhost:10345")
- `codingTracker.uploadToken` (set up such as "123456")

## 0.2.0 (Expectation)

0. Add visisble tracking data analyze tools.
1. Add more tracking data to server.

## 0.1.2

0. Fixed a bug around node module require in Linux must care about character case.

## 0.1.0

0. Add an icon to extension
1. **Fixed the severe bug** (could not to use this extension because dependencies list is incompletion)
2. Optimized tracking data upload.
3. Support upload configurations take effect after change configurations in settings.json without restart VSCode
4. Upgrade upload object structure version and storage version to 2.0,   
remove unnecessary field and change a time(date) field format to avoid time difference between server and client.
5. Optimized the server script performance and structure.

## File List

redirect to [FILES.md](FILES.md)

## Author

[LiuYue](https://github.com/hangxingliu)

## Thanks

This extension icon from [emojione](http://emojione.com/), This project help me a lot of (bkz I dont need how to use PS and dont have art sense).

## License

- Extension(part except icon) and server scripts: [GPL-3.0](LICENSE)
- Extension Icon[CC-BY 4.0](http://emojione.com/licensing/)