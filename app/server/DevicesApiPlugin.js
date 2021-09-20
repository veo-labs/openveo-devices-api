'use strict';

/**
 * @module devices-api/DevicesApiPlugin
 */

var util = require('util');
var openVeoApi = require('@openveo/api');
var DevicesApiPluginApi = process.requireDevicesApi('app/server/DevicesApiPluginApi.js');

/**
 * Defines the Devices API Plugin.
 *
 * @class DevicesApiPlugin
 * @extends Plugin
 * @constructor
 */
function DevicesApiPlugin() {
  DevicesApiPlugin.super_.call(this);

  Object.defineProperties(this,

    /** @lends module:devices-api/DevicesApiPlugin~DevicesApiPlugin */
    {

      /**
       * Plugin's APIs.
       *
       * @type {module:devices-api/DevicesApiPluginApi~DevicesApiPluginApi}
       * @instance
       * @readonly
       */
      api: {value: new DevicesApiPluginApi()}

    }

  );
}

// Expose DevicesApiPlugin
module.exports = DevicesApiPlugin;

// Extend Plugin
util.inherits(DevicesApiPlugin, openVeoApi.plugin.Plugin);
