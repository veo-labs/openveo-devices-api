'use strict';

/**
 * @module devices
 */

/**
 * Fired when a new device is connected.
 *
 * @event MESSAGES.AUTHENTICATED
 * @param {String} The device HTTP address
 * @param {String} The id of the device
 * @param {Function} The function to respond to the device
 */

/**
 * Fired when the status of a device has been updated.
 *
 * @event MESSAGES.SESSION_STATUS_UPDATED
 * @param {String} The new session status
 * @param {String} The id of the device
 * @param {Function} The function to respond to the device
 */

/**
 * Fired when a new recording index has been created.
 *
 * @event MESSAGES.NEW_SESSION_INDEX
 * @param {String} The index type ("image" or "tag")
 * @param {Number} The index timecode (in ms)
 * @param {Mixed} The index associated data
 * @param {Function} The function to respond to the device
 */

/**
 * Fired when the name of a device has been updated.
 *
 * @event MESSAGES.NAME_UPDATED
 * @param {String} The device's name
 * @param {String} The id of the device
 * @param {Function} The function to respond to the device
 */

/**
 * Fired when configured presets of a device have changed.
 *
 * @event MESSAGES.PRESETS_UPDATED
 * @param {Object} The list of configured presets
 * @param {String} The id of the device
 * @param {Function} The function to respond to the device
 */

/**
 * Fired when storage of a device has been updated.
 *
 * @event MESSAGES.STORAGE_UPDATED
 * @param {Number} Number of free Bytes
 * @param {Number} Number of used Bytes
 * @param {String} The id of the device
 * @param {Function} The function to respond to the device
 */

/**
 * Fired when inputs of a device have changed.
 *
 * @event MESSAGES.INPUTS_UPDATED
 * @param {Object} Camera input status
 * @param {Object} Slides input status
 * @param {String} The id of the device
 * @param {Function} The function to respond to the device
 */

/**
 * Fired when a device has been disconnected.
 *
 * @event MESSAGES.DISCONNECTED
 * @param {String} The id of the device
 */

/**
 * Fired when something went wrong on the connection with a device.
 *
 * @event MESSAGES.ERROR
 * @param {Error} The socket.io error
 * @param {String} The id of the device
 */

var util = require('util');
var async = require('async');
var shortid = require('shortid');
var Pilot = require('@openveo/api').socket.Pilot;
var DevicePilot = process.requireDevicesApi('app/server/devices/DevicePilot.js');
var DeviceError = process.requireDevicesApi('app/server/devices/DeviceError.js');
var DEVICES_TYPES = process.requireDevicesApi('app/server/devices/types.js');
var VEOBOX_MESSAGES = process.requireDevicesApi('app/server/devices/veobox/messages.js');
var VEOBOX_STATUSES = process.requireDevicesApi('app/server/devices/veobox/statuses.js');

/**
 * Asks a device.
 *
 * @method askForSettings
 * @private
 * @async
 * @param {Array} ids The list of devices' ids
 * @param {String} messageId The id of the message to send to the device
 * @param {Object} data Data to send to the device
 * @param {Function} callback Function to call when it's done with :
 *  - **Null** Always null
 *  - **Array** Results for each device with :
 *    - **DeviceError** error An error if something went wrong
 *    - **String** value The device's id
 */
function ask(ids, name, data, callback) {
  var self = this;
  var actions = [];

  ids.forEach(function(id) {
    actions.push(function(callback) {
      var device = self.getClient(id);

      if (!device)
        return callback(new DeviceError('Device not connected', id));

      process.logger.debug('Say "' + name + '" to device', {id: id, data: data});
      device.socket.emit(name, data, function(response) {
        if (response && response.error)
          return callback(new DeviceError('Asking for "' + name + '" failed', id, response.error.code), id);

        callback(null, id);
      });
    });
  });

  async.parallel(async.reflectAll(actions), callback);
}

/**
 * Asks a device for its settings (status, storage, inputs and presets).
 *
 * @method askForSettings
 * @private
 * @async
 * @param {String} id The device's id
 * @param {Function} callback Function to call when it's done with :
 *  - **Error** An error if something went wrong, null otherwise
 */
function askForSettings(id, callback) {
  var settings = ['session.status', 'storage', 'inputs', 'settings.presets'];
  var actions = [];
  var device = this.getClient(id);

  settings.forEach(function(setting) {
    actions.push(function(callback) {
      if (!device)
        return callback(new DeviceError('Device not connected', id));

      var data = {
        event: setting
      };

      process.logger.debug('Say "get" to device', {id: id, data: data});
      device.socket.emit('get', data, function(response) {
        if (response && response.error)
          return callback(new DeviceError('Getting setting "' + setting + '" failed', id, response.error.code));

        callback();
      });
    });
  });

  async.parallel(actions, callback);
}

/**
 * Defines a pilot to interact with [Veobox devices](http://www.veo-labs.com/veobox).
 *
 * @class VeoboxPilot
 * @extends DevicePilot
 * @constructor
 * @param {AdvancedEmitter} devicesEmitter The devices' emitter to listen to devices' messages
 * @param {SocketNamespace} namespace The namespace associated to the devices
 */
function VeoboxPilot(devicesEmitter, namespace) {
  var self = this;
  VeoboxPilot.super_.call(this, DEVICES_TYPES.VEOBOX, devicesEmitter, namespace);

  Object.defineProperties(this, {

    /**
     * Available messages.
     *
     * @property MESSAGES
     * @type Object
     * @final
     */
    MESSAGES: {value: VEOBOX_MESSAGES},

    /**
     * Available statuses.
     *
     * @property STATUSES
     * @type Object
     * @final
     */
    STATUSES: {value: VEOBOX_STATUSES}

  });

  // Listen to device's disconnection
  this.clientEmitter.on(VEOBOX_MESSAGES.DISCONNECTED, function(eventName, socket) {
    var client = self.removeClientBySocketId(socket.id);

    if (client)
      self.emit(eventName, client.id);
  });

  // Listen to device's connection errors
  this.clientEmitter.on(VEOBOX_MESSAGES.ERROR, function(eventName, error, socket) {
    var client = self.getClientBySocketId(socket.id);

    if (client)
      self.emit(eventName, error, client.id);
  });

  // Listen to device's greeting message
  this.clientEmitter.on(VEOBOX_MESSAGES.AUTHENTICATED, function(eventName, id, socket, callback) {
    self.addClient(id, socket);
    self.emit(eventName, socket.handshake.headers['x-forwarded-for'] || socket.handshake.address, id, callback);
  });

  // Emits devices' messages
  this.clientEmitter.on(VEOBOX_MESSAGES.CONNECTED, Pilot.prototype.emitMessageWithId.bind(this));
  this.clientEmitter.on(VEOBOX_MESSAGES.SESSION_STATUS_UPDATED, Pilot.prototype.emitMessageWithId.bind(this));
  this.clientEmitter.on(VEOBOX_MESSAGES.NEW_SESSION_INDEX, Pilot.prototype.emitMessageWithId.bind(this));
  this.clientEmitter.on(VEOBOX_MESSAGES.NAME_UPDATED, Pilot.prototype.emitMessageWithId.bind(this));
  this.clientEmitter.on(VEOBOX_MESSAGES.PRESETS_UPDATED, Pilot.prototype.emitMessageWithId.bind(this));
  this.clientEmitter.on(VEOBOX_MESSAGES.STORAGE_UPDATED, Pilot.prototype.emitMessageWithId.bind(this));
  this.clientEmitter.on(VEOBOX_MESSAGES.INPUTS_UPDATED, Pilot.prototype.emitMessageWithId.bind(this));
}

module.exports = VeoboxPilot;
util.inherits(VeoboxPilot, DevicePilot);

/**
 * Asks for devices' settings.
 *
 * Asks devices for status, storage, inputs and presets.
 *
 * @method askForSettings
 * @async
 * @param {Array} ids The list of devices' ids
 * @param {Function} callback Function to call when it's done with :
 *  - **Null** Always null
 *  - **Array** Results for each device
 */
VeoboxPilot.prototype.askForSettings = function(ids, callback) {
  var self = this;
  var actions = [];

  ids.forEach(function(id) {
    actions.push(function(callback) {
      askForSettings.call(self, id, callback);
    });
  });

  async.parallel(async.reflectAll(actions), callback);
};

/**
 * Asks for devices' names.
 *
 * @method askForName
 * @async
 * @param {Array} ids The list of devices' ids
 * @param {Function} callback Function to call when it's done with :
 *  - **Null** Always null
 *  - **Array** Results for each device
 */
VeoboxPilot.prototype.askForName = function(ids, callback) {
  ask.call(this, ids, 'get', {event: 'settings.name'}, callback);
};

/**
 * Asks a device to update its name.
 *
 * @method askForUpdateName
 * @async
 * @param {String} id The device's id
 * @param {String} name The new name of the device
 * @param {Function} callback Function to call when it's done with :
 *  - **DeviceError** An error if something went wrong, null otherwise
 */
VeoboxPilot.prototype.askForUpdateName = function(id, name, callback) {
  var device = this.getClient(id);

  if (!device)
    return callback(new DeviceError('Device not connected', id));

  var data = {
    name: name
  };
  process.logger.debug('Say "settings.name" to device', {id: id, data: data});
  device.socket.emit('settings.name', data, function(response) {
    if (response && response.error)
      return callback(new DeviceError('Updating device name failed (' + name + ')', id, response.error.code));

    callback();
  });
};

/**
 * Asks devices to start a record.
 *
 * @method askForStartRecord
 * @async
 * @param {Array} ids The list of connected devices' ids to start
 * @param {Number} presetId The id of the preset to use for the recording session
 * @param {String} [name] The name of the recording session
 * @param {Function} callback Function to call when it's done with:
 *  - **Null** Always null
 *  - **Array** Results for each device
 */
VeoboxPilot.prototype.askForStartRecord = function(ids, presetId, name, callback) {
  var date = new Date();
  var data = {
    id: date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + '_' +
        ('0' + date.getHours()).slice(-2) + '-' +
        ('0' + date.getMinutes()).slice(-2) + '-' +
        ('0' + date.getSeconds()).slice(-2) + '_' +
        shortid.generate(),
    preset: presetId
  };

  if (name) {
    data.name = name;
  }
  ask.call(this, ids, 'session.start', data, callback);
};

/**
 * Asks devices to stop recording.
 *
 * @method askForStopRecord
 * @async
 * @param {Array} ids The list of connected devices' ids to stop
 * @param {Function} callback Function to call when it's done with :
 *  - **Null** Always null
 *  - **Array** Results for each device
 */
VeoboxPilot.prototype.askForStopRecord = function(ids, callback) {
  ask.call(this, ids, 'session.stop', {}, callback);
};

/**
 * Asks devices to index a record (tag).
 *
 * @method askForSessionIndex
 * @async
 * @param {Array} ids The list of connected devices' ids to index
 * @param {Function} callback Function to call when it's done with :
 *  - **Null** Always null
 *  - **Array** Results for each device
 */
VeoboxPilot.prototype.askForSessionIndex = function(ids, callback) {
  ask.call(this, ids, 'session.index', {type: 'tag'}, callback);
};

/**
 * Cuts the communication with the device.
 *
 * @method disconnect
 * @async
 * @param {Array} ids The list of connected devices' ids to disconnect
 */
VeoboxPilot.prototype.disconnect = function(ids) {
  var self = this;
  ids.forEach(function(id) {
    process.logger.debug('Disconnect device', {id: id});
    var device = self.getClient(id);

    if (device)
      device.socket.disconnect(true);
  });
};
