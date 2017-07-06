"use strict";
//@ts-check
/// <reference path="index.d.ts" />

const PREFIX = ['coding-tracker'];

let showDebug = true;

/** 基本log函数 */
let _log = (method, fields) => method.apply(console, PREFIX.concat(fields));

/** @type {Logger} */
let Log = null;
Log = (...fields) => _log(console.log, fields);
Log.e = (...fields) => _log(console.error, fields);
Log.w = (...fields) => _log(console.warn, fields);
Log.d = (...fields) => showDebug && _log(console.log, fields);
Log.setDebug = isDebug => showDebug = isDebug;

module.exports = Log;