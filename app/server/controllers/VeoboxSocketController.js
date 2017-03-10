'use strict';

/**
 * @module controllers
 */

var util = require('util');
var openVeoApi = require('@openveo/api');
var DeviceSocketController = process.requireDevicesApi('app/server/controllers/DeviceSocketController.js');
var DEVICES_TYPES = process.requireDevicesApi('app/server/devices/types.js');
var VEOBOX_MESSAGES = process.requireDevicesApi('app/server/devices/veobox/messages.js');
var VEOBOX_STATUSES = process.requireDevicesApi('app/server/devices/veobox/statuses.js');
var AdvancedEvent = openVeoApi.emitters.AdvancedEvent;

/**
 * Defines a socket controller to handle messages from [Veoboxes](http://www.veo-labs.com/veobox).
 *
 * @class VeoboxController
 * @extends DeviceSocketController
 * @constructor
 * @param {SocketNamespace} namespace The socket namespace managed by this controller.
 * See [OpenVeo API documentation](https://github.com/veo-labs/openveo-api) for more information about SocketNamespace
 */
function VeoboxController(namespace) {
  VeoboxController.super_.call(this, DEVICES_TYPES.VEOBOX, namespace);
}

module.exports = VeoboxController;
util.inherits(VeoboxController, DeviceSocketController);

/**
 * Handles greeting message from a device.
 *
 * @method authenticateAction
 * @param {Object} data Message's datas
 * @param {String} data.id The device unique id
 * @param {Socket} socket The opened socket
 * @param {Function} callback The callback to respond to the device
 */
VeoboxController.prototype.authenticateAction = function(data, socket, callback) {
  process.logger.debug('Device says : ' + VEOBOX_MESSAGES.AUTHENTICATED, {data: data, ip: socket.handshake.address});

  // Validate data
  try {
    data = openVeoApi.util.shallowValidateObject(data, {
      id: {type: 'string', required: true}
    });
  } catch (error) {
    process.logger.warn(error.message, {error: error, event: VEOBOX_MESSAGES.AUTHENTICATED});
    return callback(error);
  }

  this.emitter.emitEvent(new AdvancedEvent(VEOBOX_MESSAGES.AUTHENTICATED, data.id, socket, callback));
};

/**
 * Handles message informing about a device's status modification.
 *
 * @method updateSessionStatusAction
 * @param {Object} data Message's datas
 * @param {String} data.status The new session status
 * @param {Socket} socket The opened socket
 * @param {Function} callback The callback to respond to the device
 */
VeoboxController.prototype.updateSessionStatusAction = function(data, socket, callback) {
  process.logger.debug('Device says : ' + VEOBOX_MESSAGES.SESSION_STATUS_UPDATED, {data: data});

  // Validate data
  try {
    data = openVeoApi.util.shallowValidateObject(data, {
      status: {
        type: 'string',
        required: true,
        in: [
          VEOBOX_STATUSES.STOPPED,
          VEOBOX_STATUSES.ERROR,
          VEOBOX_STATUSES.STARTED,
          VEOBOX_STATUSES.STARTING,
          VEOBOX_STATUSES.STOPPING,
          VEOBOX_STATUSES.DISCONNECTED,
          VEOBOX_STATUSES.UNKNOWN
        ]
      }
    });
  } catch (error) {
    process.logger.warn(error.message, {error: error, event: VEOBOX_MESSAGES.SESSION_STATUS_UPDATED});
    return callback(error);
  }

  this.emitter.emitEvent(
    new AdvancedEvent(VEOBOX_MESSAGES.SESSION_STATUS_UPDATED, data.status, socket, callback)
  );
};

/**
 * Handles message informing about a device's session index.
 *
 * @method indexSessionAction
 * @param {Object} data Message's datas
 * @param {String} data.type The index type ("image" or "tag")
 * @param {String} data.timecode The index timecode (in ms)
 * @param {Mixed} [data.data] The index associated data (e.g. binary JPEG image for type "image")
 * @param {Socket} socket The opened socket
 * @param {Function} callback The callback to respond to the device
 */
VeoboxController.prototype.indexSessionAction = function(data, socket, callback) {
  process.logger.debug('Device says : ' + VEOBOX_MESSAGES.NEW_SESSION_INDEX);

  // Validate data
  try {
    data = openVeoApi.util.shallowValidateObject(data, {
      type: {type: 'string', required: true, in: ['image', 'tag']},
      timecode: {type: 'number', required: true},
      data: {type: 'file', required: data.type === 'image', in: ['JPG', 'PNG', 'GIF']}
    });
  } catch (error) {
    process.logger.warn(error.message, {error: error, event: VEOBOX_MESSAGES.NEW_SESSION_INDEX});
    return callback(error);
  }

  this.emitter.emitEvent(
    new AdvancedEvent(VEOBOX_MESSAGES.NEW_SESSION_INDEX, data.type, data.timecode, data.data, socket, callback)
  );
};

/**
 * Handles message informing about a device's name modification.
 *
 * Device's name has changed.
 *
 * @method updateNameAction
 * @param {Object} data Message's datas
 * @param {String} data.name The new device's name
 * @param {Socket} socket The opened socket
 * @param {Function} callback The callback to respond to the device
 */
VeoboxController.prototype.updateNameAction = function(data, socket, callback) {
  process.logger.debug('Device says : ' + VEOBOX_MESSAGES.NAME_UPDATED, {data: data});

  // Validate data
  try {
    data = openVeoApi.util.shallowValidateObject(data, {
      name: {type: 'string', required: true}
    });
  } catch (error) {
    process.logger.warn(error.message, {error: error, event: VEOBOX_MESSAGES.NAME_UPDATED});
    return callback(error);
  }

  this.emitter.emitEvent(new AdvancedEvent(VEOBOX_MESSAGES.NAME_UPDATED, data.name, socket, callback));
};

/**
 * Handles message informing about a device's presets modification.
 *
 * Device's presets have changed.
 *
 * @method updatePresetsAction
 * @param {Object} presets The new list of configured presets
 * @param {Socket} socket The opened socket
 * @param {Function} callback The callback to respond to the device
 */
VeoboxController.prototype.updatePresetsAction = function(presets, socket, callback) {
  var data = null;
  process.logger.debug('Device says : ' + VEOBOX_MESSAGES.PRESETS_UPDATED, {presets: presets});

  // Validate data
  try {
    data = openVeoApi.util.shallowValidateObject({
      presets: presets
    }, {
      presets: {type: 'object', required: true}
    });
  } catch (error) {
    process.logger.warn(error.message, {error: error, event: VEOBOX_MESSAGES.PRESETS_UPDATED});
    return callback(error);
  }

  this.emitter.emitEvent(new AdvancedEvent(VEOBOX_MESSAGES.PRESETS_UPDATED, data.presets, socket, callback));
};

/**
 * Handles message informing about a device's storage modification.
 *
 * @method updateStorageAction
 * @param {Object} data Message's datas
 * @param {Number} data.free Number of free Bytes in device's hard drive
 * @param {Number} data.used Number of used Bytes in device's hard drive
 * @param {Socket} socket The opened socket
 * @param {Function} callback The callback to respond to the device
 */
VeoboxController.prototype.updateStorageAction = function(data, socket, callback) {
  process.logger.debug('Device says : ' + VEOBOX_MESSAGES.STORAGE_UPDATED, {data: data});

  // Validate data
  try {
    data = openVeoApi.util.shallowValidateObject(data, {
      free: {type: 'number', gte: 0, required: true},
      used: {type: 'number', gte: 0, required: true}
    });
  } catch (error) {
    process.logger.warn(error.message, {error: error, event: VEOBOX_MESSAGES.STORAGE_UPDATED});
    return callback(error);
  }

  this.emitter.emitEvent(
    new AdvancedEvent(VEOBOX_MESSAGES.STORAGE_UPDATED, data.free, data.used, socket, callback)
  );
};

/**
 * Handles message informing about a device's inputs modification.
 *
 * Device's inputs have changed.
 *
 * @method updateInputsAction
 * @param {Object} data Message's datas
 * @param {Object} data.camera Camera input status
 * @param {Object} data.slides Slides input status
 * @param {Socket} socket The opened socket
 * @param {Function} callback The callback to respond to the device
 */
VeoboxController.prototype.updateInputsAction = function(data, socket, callback) {
  process.logger.debug('Device says : ' + VEOBOX_MESSAGES.INPUTS_UPDATED, {data: data});

  // Validate data
  try {
    data = openVeoApi.util.shallowValidateObject(data, {
      camera: {type: 'object', required: true},
      slides: {type: 'object', required: true}
    });
  } catch (error) {
    process.logger.warn(error.message, {error: error, event: VEOBOX_MESSAGES.INPUTS_UPDATED});
    return callback(error);
  }

  this.emitter.emitEvent(
    new AdvancedEvent(VEOBOX_MESSAGES.INPUTS_UPDATED, data.camera, data.slides, socket, callback)
  );
};

/**
 * Handles socket's disconnection.
 *
 * Connection with a device has been lost.
 *
 * @method disconnectAction
 * @param {Socket} socket The socket
 */
VeoboxController.prototype.disconnectAction = function(socket) {
  process.logger.info('Device disconnected', {socketId: socket.id});
  this.emitter.emitEvent(new AdvancedEvent(VEOBOX_MESSAGES.DISCONNECTED, socket));
};

/**
 * Handles socket's connection errors.
 *
 * An error occurred on socket's communication.
 *
 * @method errorAction
 * @param {Error} error The error
 * @param {Socket} socket The socket
 */
VeoboxController.prototype.errorAction = function(error, socket) {
  process.logger.error('Error in device communication', {socketId: socket.id, error: error});
  this.emitter.emitEvent(new AdvancedEvent(VEOBOX_MESSAGES.ERROR, error, socket));
};
