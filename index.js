'use strict';

var path = require('path');

// Set module root directory
process.rootDevicesApi = __dirname;

// Define a new method on process object to be able to require
// a module with a path relative to plugin's root directory
process.requireDevicesApi = function(filePath) {
  return require(path.join(process.rootDevicesApi, filePath));
};

// Expose the plugin
module.exports = process.requireDevicesApi('app/server/DevicesApiPlugin.js');
