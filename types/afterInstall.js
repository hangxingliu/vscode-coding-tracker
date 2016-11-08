fs = require('fs-extra')
fs.copy('node_modules', '../node_modules', (err) => log('install typescript intellisense files', err));

function log(base, err) { console.log(`${base} ${err ? ('error\n' + err.stack) : 'success!'}\n`) }