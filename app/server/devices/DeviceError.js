'use strict';

/**
 * @module devices
 */

var util = require('util');

/**
 * Defines an error returned by a device with its id.
 *
 * @class DeviceError
 * @extends Error
 * @constructor
 * @param {String} message The error message
 * @param {String} id The device id the error belongs to
 * @param {String} code The error code
 */
function DeviceError(message, id, code) {
  Error.captureStackTrace(this, this.constructor);

  Object.defineProperties(this, {

    /**
     * The id of the device on error.
     *
     * @property deviceId
     * @type String
     * @final
     */
    deviceId: {value: id},

    /**
     * The device error code.
     *
     * @property code
     * @type String
     * @final
     */
    code: {value: code},

    /**
     * The error message.
     *
     * @property message
     * @type String
     * @final
     */
    message: {value: message, writable: true},

    /**
     * The error name.
     *
     * @property name
     * @type String
     * @final
     */
    name: {value: 'DeviceError', writable: true}

  });
}

module.exports = DeviceError;
util.inherits(DeviceError, Error);
