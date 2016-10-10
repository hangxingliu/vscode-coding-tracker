var vscode = require('vscode'),
    Path = require('path'),
    Request = require('request'),
    ext = require('./lib/VSCodeHelper'),
    log = require('./lib/Log');
//  log.setDebug(false);

var baseUploadObject = {
    version: '1.0',
    token: '', type: '', time: 0, long: 0, lang: '', file: '', proj: '', proj_path: ''
};
var uploadURL = '',
    activeDocument,
    trackData = {
        openTime: 0,
        firstCodeingTime: 0,
        codingLong: 0,
        lastCodingTime: 0
    };

//Upload tracking data
function upload(data) {
    Request(uploadURL, {
        method: 'POST', form: data, headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
    }, (err, res, bd) => {
        if (err) return ext.showSingleErrorMsg('Could not upload coding record, Because: ' + err.stack);
        var retObj;
        try { 
            retObj = JSON.parse(bd);
        } catch (err) {
            return ext.showSingleErrorMsg('Upload response is bad!(Could not convert to JSON)');
        }
        if (retObj.error)
            return ext.showSingleErrorMsg('Upload error: ' + retObj.error);
        log.d('Upload success!');
    })
}
//create a upload tracking data object from specified type, happend time and long
function getUploadObject(type, time, long) {
    var data = cloneBaseUploadObject(),
        uri = activeDocument.uri;
    data.type = type;
    data.time = time;
    data.long = long;
    data.lang = activeDocument.languageId;
    data.file = uri.scheme == 'file' ? vscode.workspace.asRelativePath(uri.fsPath) : uri.scheme; 
    return data;

    function cloneBaseUploadObject() {
        var ret = {};
        for (var i in baseUploadObject) ret[i] = baseUploadObject[i];
        return ret;
    }
}
//Uploading open track data
function uploadOpenTrackData(now) {
    var long = now - trackData.openTime,
        data = getUploadObject('open', trackData.openTime, long);
    process.nextTick(() => upload(data));
    //Retracking file open time
    trackData.openTime = now;
}
//Uploading coding track data and retracking coding track data
function uploadCodingTrackData() {
    var data = getUploadObject('code', trackData.firstCodeingTime, trackData.codingLong);
    process.nextTick(() => upload(data));
    //Retracking coding track data
    trackData.codingLong = trackData.lastCodingTime = trackData.firstCodeingTime = 0;    
}

//Handler VSCode Event
var EventHandler = {
    onActiveFileChange: (doc) => {
        var now = Date.now();
        // If there is a TextEditor opened before changed, should upload the track data
        if (activeDocument) {
            //At least open 5 seconds
            if (trackData.openTime < now - 5000) {
                uploadOpenTrackData(now);
            }
            //At least coding 1 second
            if (trackData.codingLong) {
                uploadCodingTrackData();
            }
        }
        activeDocument = ext.cloneTextDocumentObject(doc);
        //Retracking file open time again (Prevent has not retracked open time when upload open tracking data has been called)
        trackData.openTime = now;
        trackData.codingLong = trackData.lastCodingTime = trackData.firstCodeingTime = 0;  
    },
    onFileCoding: () => {
        var now = Date.now();
        //If time is too short to calling this function then just ignore it 
        if (now - 1000 < trackData.lastCodingTime)
            return;
        //If is first time coding in this file, record time
        if (!trackData.firstCodeingTime)
            trackData.firstCodeingTime = now;
        //If too long time to recoding, so upload old coding track and retracking
        else if (trackData.lastCodingTime < now - 30000) {//30s
            uploadCodingTrackData()
            //Reset first coding time
            trackData.firstCodeingTime = now;
        }
        trackData.codingLong += 1000;
        trackData.lastCodingTime = now;
    }
}


function activate(context) {

    //Declare for add disposable inside easy
    var subscriptions = context.subscriptions,
        //CodingTracker Configuration
        configurations =  ext.getConfig('codingTracker');
    
    //Binding project information into baseUploadObject
    var proj_path = vscode.workspace.rootPath;
    baseUploadObject.proj_path = proj_path;
    baseUploadObject.proj = Path.basename(proj_path);

    //Binding upload token into baseUploadObject
    baseUploadObject.token = String(configurations.get('uploadToken') );

    //Setting uploadURL from Configuration
    uploadURL = String(configurations.get('serverURL'));
    uploadURL = (uploadURL.endsWith('/') ? uploadURL : (uploadURL + '/')) + 'ajax/upload';

    //Tracking the file display when vscode open
    EventHandler.onActiveFileChange( (vscode.window.activeTextEditor || {}).document);

    //Listening vscode event to record coding activity    
    subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => EventHandler.onFileCoding( (e || {}).document)  ));
    subscriptions.push(vscode.window.onDidChangeActiveTextEditor((e) => EventHandler.onActiveFileChange((e || {}).document )  ));
}
function deactivate() { 
    EventHandler.onActiveFileChange(null);
}


exports.activate = activate;
exports.deactivate = deactivate;