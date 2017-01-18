'use strict';

/**
 * @module devices-api
 */

var util = require('util');
var openVeoApi = require('@openveo/api');
var devicesPilotsManager = process.requireDevicesApi('app/server/devicesPilotsManager.js');
var DEVICES_TYPES = process.requireDevicesApi('app/server/devices/types.js');

/**
 * Devices API.
 *
 *     // Get API
 *     var openVeoApi = require('@openveo/api');
 *     var devicesApi = openVeoApi.api.getApi('devices-api');
 *
 * @class DevicesApiPluginApi
 * @extends PluginApi
 * @constructor
 */
function DevicesApiPluginApi() {
  DevicesApiPluginApi.super_.call(this);
}

module.exports = DevicesApiPluginApi;
util.inherits(DevicesApiPluginApi, openVeoApi.plugin.PluginApi);

/**
 * Gets devices' types.
 *
 * @example
 *
 *     var devicesApi = openVeoApi.api.getApi('devices-api');
 *     console.log(devicesApi.getDevicesTypes());
 *
 * @method getDevicesTypes
 * @return {Object} The devices' types
 */
DevicesApiPluginApi.prototype.getDevicesTypes = function() {
  return DEVICES_TYPES;
};

/**
 * Gets the pilot of a particular type of devices.
 *
 * @example
 *
 *     var devicesApi = openVeoApi.api.getApi('devices-api');
 *     var DEVICES_TYPES = devicesApi.getDevicesTypes();
 *     var pilot = devicesApi.getPilot(DEVICES_TYPES.VEOBOX);
 *
 *     // Listen to messages sent by the device
 *     pilot.on(pilot.MESSAGES.AUTHENTICATED, function(id, deviceIp, socketId) {
 *       console.log('New device connected with id ' + id + ' and ip ' + deviceIp);
 *     });
 *
 * @method getPilot
 * @param {Number} type The type of devices associated to the pilot
 * @return {DevicePilot|Null} The pilot or null if not found
 */
DevicesApiPluginApi.prototype.getPilot = function(type) {
  return devicesPilotsManager.get(type);
};
