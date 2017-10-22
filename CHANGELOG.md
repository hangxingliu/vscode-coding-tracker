# CHANGELOG

### 0.5.0 (Stage: checking bug)

0. Add VCS(Git) repository and branch information tracking
1. Add document line counts tracking
2. Upgrade uploading protocol version to 4.0
3. Optimize codes 

### 0.4.2

0. Add configuration `showStatus` to controlling visibility of status bar information

### 0.4.1

0. Add Russian translations. (Include report page) (Thank [Dolgishev Viktor (@vdolgishev)][vdolgishev])
1. Update server program to 0.4.1 (**Fixed fatal bug**)

### 0.4.0

0. Fixed the bug "could not upload error" caused by switching VSCode windows
1. New report page (support i18n, detailed report, share ...) (vscode-coding-tracker-server => 0.4.0)
2. Add configuration "moreThinkingTime". Adjust it to make report more accurate for your coding habits

### 0.3.2

0. more precise in VSCode 1.9.0 (I am crashing because too many things are changed since VSCode 1.9.0)

### 0.3.1

0. **fixed the local server severe bug.**
**(because vscode install extension would not resolve dependencies and I forgot a dependency)**
1. fixed the wrong coding time record because some feature since VSCode 1.9.0 
2. fixed could not upload tracking data in non-project context since VSCode 1.9.0
3. remove some redundant git merge files 

### 0.3.0

0. **Added local server mode. So you could use this extension easily.**
1. Added i18n support(supported language: en, zh-cn, zh-tw)
2. Modified status bar module to show more information(local server sign, tooltip and changed icon)
3. Added Output channel module to output local server log

### 0.2.2

0. Fixed `npm start` occurs error in Windows.

### 0.2.0

0. Be sure to upgrade again, because accuracy of tracker has be improve
1. Separated the server side codes to other repository(but add this server side module to npm package dependencies.
So you can find server side codes under node_modules)
2. Ignored tracking invalid document times
3. Added listening onDidChangeTextEditorSelection event to improve accuracy
4. Tidied extension.js codes

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

### 0.1.3

0. Modified the log module, removed export log object to global variable "Log" (because sometimes it lead to a vscode exception)

### 0.1.2

0. Fixed a bug around node module require in Linux must care about character case.

### 0.1.1

0. Change folder and project structure to adapt npm and vscode extension

### 0.1.0

0. Add an icon to extension
1. **Fixed the severe bug** (could not to use this extension because dependencies list is incomplete)
2. Optimized tracking data upload.
3. Support upload configurations take effect after change configurations in settings.json without restart VSCode
4. Upgrade upload object structure version and storage version to 2.0,   
remove unnecessary field and change a time(date) field format to avoid time difference between server and client.
5. Optimized the server script performance and structure.
