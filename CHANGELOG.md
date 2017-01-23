## CHANGELOG

## 0.1.4

0. Add computer Id to tracking data(You can specify your Id by set up vscode config
 `codingTracker.computerId` )
1. Fixed some spelling mistake in the code and change some comment from Chinese to English
2. Change tracking data time format from datetime format string to timestamp
3. Please upgrade your server program to at least 1.3.0 to support receive tracking data 
 and storage data in version 3.0  

## 0.1.3

0. Modified the log module, removed export log object to global variable "Log" (because sometimes it lead to a vscode exception)

## 0.1.2

0. Fixed a bug around node module require in Linux must care about character case.

## 0.1.1

0. Change folder and project structure to adapt npm and vscode extension

## 0.1.0

0. Add an icon to extension
1. **Fixed the severe bug** (could not to use this extension because dependencies list is incompletion)
2. Optimized tracking data upload.
3. Support upload configurations take effect after change configurations in settings.json without restart VSCode
4. Upgrade upload object structure version and storage version to 2.0,   
remove unnecessary field and change a time(date) field format to avoid time difference between server and client.
5. Optimized the server script performance and structure.