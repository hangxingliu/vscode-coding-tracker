/**
 * Calculate amount of time spent coding
 */
let fs = require('fs');

let input = process.argv[2]; // first command line argument
let idleThreshold = (parseInt(process.argv[3]) || 5) * 60 * 1000; // in minutes. default:5

fromDuration(input);
fromTimestamps(input);


function fromDuration(input) {
  let totalTime = 0;
  let stream = fs.createReadStream(input);

  // first time duration offset
  let offset = 2;
  let dataColumns = 5;
  stream.on('data', (chunk) => {
    let parts = chunk.toString().split(' ');
    for (let x = offset; x < parts.length; x = x+dataColumns) {
      totalTime += parseInt(parts[x]);
    }
  }).on('end', () => {
    console.log(`Total time spent coding: ${totalTime / 1000 / 60} minutes`);
  });
}

function fromTimestamps(input) {
  let totalTime = 0;
  let stream = fs.createReadStream(input);

  // first time duration offset
  let offset = 2;
  let lastTimestamp = -1;
  let dataColumns = 5;
  stream.on('data', (chunk) => {
    let parts = chunk.toString().split(' ');
    for (let x = offset; x < parts.length; x = x+dataColumns) {
      let curTimestamp = parseInt(parts[x]);
      let elapsed = curTimestamp - lastTimestamp;
      if (elapsed < idleThreshold) {
        totalTime += elapsed;
      }
      lastTimestamp = curTimestamp;
    }
  }).on('end', () => {
    console.log(`Total time spent coding: ${totalTime / 60} minutes`);
  });
}
