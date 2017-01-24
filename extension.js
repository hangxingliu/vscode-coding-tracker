var vscode      = require('vscode'),
    Path        = require('path'),
    Request     = require('request'),
    ext                     = require('./lib/VSCodeHelper'),
    uploader                = require('./lib/Uploader'),
    log                     = require('./lib/Log'),
    UploadObjectGenerator   = require('./lib/UploadObjectGenerator');
//  log.setDebug(false);


var activeDocument,
    uploadObjectGenerator,
    //Tracking data, record document open time, first coding time and last coding time and coding time long
    trackData = {
        openTime: 0,
        firstCodingTime: 0,
        codingLong: 0,
        lastCodingTime: 0
    };

//Uploading open track data
function uploadOpenTrackData(now) {
    var long = now - trackData.openTime,
        data = uploadObjectGenerator.gen('open', activeDocument, trackData.openTime, long);
    process.nextTick(() => uploader.upload(data));
    //Re-tracking file open time
    trackData.openTime = now;
}
//Uploading coding track data and retracking coding track data
function uploadCodingTrackData() {
    var data = uploadObjectGenerator.gen('code', activeDocument, trackData.firstCodingTime,
        trackData.codingLong);
    process.nextTick(() => uploader.upload(data));
    //Re-tracking coding track data
    trackData.codingLong =
        trackData.lastCodingTime =
        trackData.firstCodingTime = 0;    
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
        trackData.codingLong = trackData.lastCodingTime = trackData.firstCodingTime = 0;  
    },
    onFileCoding: (doc) => {
        //ignore event emit from vscode `git-index`
        //  `vscode.workspace.onDidChangeTextDocument`
        //because it is not a coding action
        if (!doc || doc.uri.scheme == 'git-index') 
            return;
        var now = Date.now();
        //If time is too short to calling this function then just ignore it 
        if (now - 1000 < trackData.lastCodingTime)
            return;
        //If is first time coding in this file, record time
        if (!trackData.firstCodingTime)
            trackData.firstCodingTime = now;
        //If too long time to recoding, so upload old coding track and retracking
        else if (trackData.lastCodingTime < now - 30000) {//30s
            uploadCodingTrackData()
            //Reset first coding time
            trackData.firstCodingTime = now;
        }
        trackData.codingLong += 1000;
        trackData.lastCodingTime = now;
    }
}

//when extension launch or vscode config change
function updateConfigurations() {
     //CodingTracker Configuration
    var configurations = ext.getConfig('codingTracker'),
        uploadToken = String(configurations.get('uploadToken')),
        uploadURL = String(configurations.get('serverURL')),
        computerId = String(configurations.get('computerId'));
    uploadURL = (uploadURL.endsWith('/') ? uploadURL : (uploadURL + '/')) + 'ajax/upload';
    uploader.set(uploadURL, uploadToken);
    uploadObjectGenerator.setComputerId(computerId || `unknown-${require('os').platform()}`);
}


function activate(context) {

    //Declare for add disposable inside easy
    var subscriptions = context.subscriptions;
    
    uploadObjectGenerator = new UploadObjectGenerator(vscode.workspace.rootPath);

    //Initialize Uploader Module
    uploader.init(context);
    //Update configurations first time
    updateConfigurations();

    //Listening workspace configurations change    
    vscode.workspace.onDidChangeConfiguration(updateConfigurations);

    //Tracking the file display when vscode open
    EventHandler.onActiveFileChange( (vscode.window.activeTextEditor || {}).document);

    //Listening vscode event to record coding activity    
    subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => EventHandler.onFileCoding( (e || {}).document)  ));
    subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => EventHandler.onActiveFileChange((e || {}).document )  ));
}
function deactivate() { 
    EventHandler.onActiveFileChange(null);
}


exports.activate = activate;
exports.deactivate = deactivate;