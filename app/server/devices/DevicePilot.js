'use strict';

/**
 * @module devices-api/DevicePilot
 */

var util = require('util');
var openVeoApi = require('@openveo/api');

/**
 * Defines a base pilot for all devices' pilots.
 *
 * A DevicePilot interacts with a particular type of devices.
 * It emits events received by the devices and offers methods to control them.
 *
 * @class DevicePilot
 * @extends Pilot
 * @constructor
 * @param {Number} type The devices' type
 * @param {AdvancedEmitter} devicesEmitter The devices' emitter
 * @param {SocketNamespace} namespace The socket namespace associated to the devices
 * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about AdvancedEmitter,
 * SocketNamespace and Pilot
 */
function DevicePilot(type, devicesEmitter, namespace) {
  DevicePilot.super_.call(this, devicesEmitter, namespace);

  Object.defineProperties(this,

    /** @lends module:devices-api/DevicePilot~DevicePilot */
    {

      /**
       * The type of devices controlled by the pilot.
       *
       * @type {Number}
       * @instance
       * @readonly
       */
      type: {value: type}

    }

  );

}

module.exports = DevicePilot;
util.inherits(DevicePilot, openVeoApi.socket.Pilot);
