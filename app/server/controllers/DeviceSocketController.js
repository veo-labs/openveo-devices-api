'use strict';

/**
 * @module devices-api/controllers/DeviceSocketController
 */

var util = require('util');
var openVeoApi = require('@openveo/api');
var devicesPilotFactory = process.requireDevicesApi('app/server/devices/factory.js');
var devicesPilotsManager = process.requireDevicesApi('app/server/devicesPilotsManager.js');
var SocketController = openVeoApi.controllers.SocketController;

/**
 * Defines a base controller to handle socket messages from devices.
 *
 * @class DeviceSocketController
 * @extends SocketController
 * @constructor
 * @param {Number} devicesType The type of devices associated to the controller
 * @param {SocketNamespace} namespace The socket namespace managed by this controller.
 * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about SocketNamespace
 */
function DeviceSocketController(devicesType, namespace) {
  DeviceSocketController.super_.call(this, namespace);

  Object.defineProperties(this,

    /** @lends module:devices-api/cntrollers/DeviceSocketController~DeviceSocketController */
    {

      /**
       * The devices' pilot associated to the controller.
       *
       * @type {module:devices-api/DevicePilot~DevicePilot}
       * @instance
       * @readonly
       */
      pilot: {
        value: devicesPilotFactory.get(devicesType, this.emitter, this.namespace)
      }

    }

  );

  // Add pilot to the manager
  devicesPilotsManager.add(this.pilot);

}

module.exports = DeviceSocketController;
util.inherits(DeviceSocketController, SocketController);
