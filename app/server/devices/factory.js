'use strict';

/**
 * @module devices
 */

/**
 * Devices' pilot factory.
 *
 * @class factory
 * @static
 */

var DEVICES_TYPES = process.requireDevicesApi('app/server/devices/types.js');

/**
 * Gets an instance of a {{#crossLink "DevicePilot"}}{{/crossLink}} depending on the type.
 *
 * @method get
 * @static
 * @param {Number} type The device type
 * @param {EventEmitter} deviceEmitter The device emitter
 * @param {Namespace} namespace The socket namespace associated to the devices to pilot
 * @return {DevicePilot} The devices' pilot corresponding to the given type
 */
module.exports.get = function(type, deviceEmitter, namespace) {
  switch (type) {

    case DEVICES_TYPES.VEOBOX:
      var VeoboxPilot = process.requireDevicesApi('app/server/devices/veobox/VeoboxPilot.js');
      return new VeoboxPilot(deviceEmitter, namespace);

    default:
      throw new Error('Unknown device type');
  }
};
