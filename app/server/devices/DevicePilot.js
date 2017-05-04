'use strict';

/**
 * @module devices
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
 */
function DevicePilot(type, devicesEmitter, namespace) {
  DevicePilot.super_.call(this, devicesEmitter, namespace);

  Object.defineProperties(this, {

    /**
     * The type of devices controlled by the pilot.
     *
     * @property type
     * @type Number
     * @final
     */
    type: {value: type}

  });

}

module.exports = DevicePilot;
util.inherits(DevicePilot, openVeoApi.socket.Pilot);
