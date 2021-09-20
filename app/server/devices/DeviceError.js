'use strict';

/**
 * @module devices-api/DeviceError
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

  Object.defineProperties(this,

    /** @lends module:devices-api/DeviceError~DeviceError */
    {

      /**
       * The id of the device on error.
       *
       * @type {String}
       * @readonly
       * @instance
       */
      deviceId: {value: id},

      /**
       * The device error code.
       *
       * @type {String}
       * @readonly
       * @instance
       */
      code: {value: code},

      /**
       * The error message.
       *
       * @type {String}
       * @readonly
       * @instance
       */
      message: {value: message, writable: true},

      /**
       * The error name.
       *
       * @type {String}
       * @readonly
       * @instance
       * @default "DeviceError"
       */
      name: {value: 'DeviceError', writable: true}

    }

  );
}

module.exports = DeviceError;
util.inherits(DeviceError, Error);
