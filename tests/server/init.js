'use strict';

var path = require('path');
var openVeoApi = require('@openveo/api');

// Set module root directory
process.rootDevicesApi = path.join(__dirname, '../../');
process.requireDevicesApi = function(filePath) {
  return require(path.normalize(process.rootDevicesApi + '/' + filePath));
};

process.logger = openVeoApi.logger.add('openveo');
