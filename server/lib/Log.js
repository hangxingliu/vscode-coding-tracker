function log(t) { console.log(t); }
log.success = t => console.log((t + "").green);
log.warn = t =>  console.warn((t + "").yellow);
log.error = t =>  console.error((t + "").red);
log.info = t =>  console.log((t + "").blue);
log.obj = obj => console.log('Object info: '.blue, obj);

module.exports = global.Log = log;