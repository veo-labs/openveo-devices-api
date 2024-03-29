'use strict';

/**
 * @module devices-api/VeoboxPilot
 */

/**
 * Fired when a new device is connected.
 *
 * @event module:devices-api/VeoboxPilot~VeoboxPilot#AUTHENTICATED
 * @property {String} address The device HTTP address
 * @property {String} id The id of the device
 * @property {Function} The function to respond to the device
 */

/**
 * Fired when the status of a device has been updated.
 *
 * @event module:devices-api/VeoboxPilot~VeoboxPilot#SESSION_STATUS_UPDATED
 * @property {String} status The new session status
 * @property {String} id The id of the device
 * @property {Function} The function to respond to the device
 */

/**
 * Fired when a new recording index has been created.
 *
 * @event module:devices-api/VeoboxPilot~VeoboxPilot#NEW_SESSION_INDEX
 * @property {String} type The index type ("image" or "tag")
 * @property {Number} timecode The index timecode (in ms)
 * @property {*} data The index associated data
 * @property {Function} The function to respond to the device
 */

/**
 * Fired when the name of a device has been updated.
 *
 * @event module:devices-api/VeoboxPilot~VeoboxPilot#NAME_UPDATED
 * @property {String} name The device's name
 * @property {String} id The id of the device
 * @property {Function} The function to respond to the device
 */

/**
 * Fired when configured presets of a device have changed.
 *
 * @event module:devices-api/VeoboxPilot~VeoboxPilot#PRESETS_UPDATED
 * @property {Object} presets The list of configured presets
 * @property {String} id The id of the device
 * @property {Function} The function to respond to the device
 */

/**
 * Fired when storage of a device has been updated.
 *
 * @event module:devices-api/VeoboxPilot~VeoboxPilot#STORAGE_UPDATED
 * @property {Number} free Number of free Bytes
 * @property {Number} used Number of used Bytes
 * @property {String} id The id of the device
 * @property {Function} The function to respond to the device
 */

/**
 * Fired when inputs of a device have changed.
 *
 * @event module:devices-api/VeoboxPilot~VeoboxPilot#INPUTS_UPDATED
 * @property {Object} cameraStatus Camera input status
 * @property {Object} inputStatus Slides input status
 * @property {String} id The id of the device
 * @property {Function} The function to respond to the device
 */

/**
 * Fired when a device has been disconnected.
 *
 * @event module:devices-api/VeoboxPilot~VeoboxPilot#DISCONNECTED
 * @property {String} id The id of the device
 */

/**
 * Fired when something went wrong on the connection with a device.
 *
 * @event module:devices-api/VeoboxPilot~VeoboxPilot#ERROR
 * @property {Error} error The socket.io error
 * @property {String} id The id of the device
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
 * @method ask
 * @private
 * @memberof module:devices-api/VeoboxPilot~VeoboxPilot
 * @this module:devices-api/VeoboxPilot~VeoboxPilot
 * @param {Array} ids The list of devices' ids
 * @param {String} messageId The id of the message to send to the device
 * @param {Object} data Data to send to the device
 * @param {module:devices-api/VeoboxPilot~VeoboxPilot~askCallback} callback Function to call when it's done
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
 * @memberof module:devices-api/VeoboxPilot~VeoboxPilot
 * @this module:devices-api/VeoboxPilot~VeoboxPilot
 * @param {String} id The device's id
 * @param {callback} callback Function to call when it's done
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
 * @extends module:devices-api/DevicePilot~DevicePilot
 * @constructor
 * @fires module:devices-api/VeoboxPilot~VeoboxPilot#AUTHENTICATED
 * @fires module:devices-api/VeoboxPilot~VeoboxPilot#SESSION_STATUS_UPDATED
 * @fires module:devices-api/VeoboxPilot~VeoboxPilot#NEW_SESSION_INDEX
 * @fires module:devices-api/VeoboxPilot~VeoboxPilot#NAME_UPDATED
 * @fires module:devices-api/VeoboxPilot~VeoboxPilot#PRESETS_UPDATED
 * @fires module:devices-api/VeoboxPilot~VeoboxPilot#STORAGE_UPDATED
 * @fires module:devices-api/VeoboxPilot~VeoboxPilot#INPUTS_UPDATED
 * @fires module:devices-api/VeoboxPilot~VeoboxPilot#DISCONNECTED
 * @fires module:devices-api/VeoboxPilot~VeoboxPilot#ERROR
 * @param {AdvancedEmitter} devicesEmitter The devices' emitter to listen to devices' messages
 * @param {SocketNamespace} namespace The namespace associated to the devices
 * @see {@link https://github.com/veo-labs/openveo-api|OpenVeo API documentation} for more information about AdvancedEmitter and
 * SocketNamespace,
 */
function VeoboxPilot(devicesEmitter, namespace) {
  var self = this;
  VeoboxPilot.super_.call(this, DEVICES_TYPES.VEOBOX, devicesEmitter, namespace);

  Object.defineProperties(this,

    /** @lends module:devices-api/VeoboxPilot~VeoboxPilot */
    {

      /**
       * Available messages.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      MESSAGES: {value: VEOBOX_MESSAGES},

      /**
       * Available statuses.
       *
       * @type {Object}
       * @instance
       * @readonly
       */
      STATUSES: {value: VEOBOX_STATUSES}

    }

  );

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
 * @param {Array} ids The list of devices' ids
 * @param {module:devices-api/VeoboxPilot~VeoboxPilot~askForSettingsCallback} callback Function to call when it's done
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
 * @param {Array} ids The list of devices' ids
 * @param {module:devices-api/VeoboxPilot~VeoboxPilot~askForNameCallback} callback Function to call when it's done
 */
VeoboxPilot.prototype.askForName = function(ids, callback) {
  ask.call(this, ids, 'get', {event: 'settings.name'}, callback);
};

/**
 * Asks a device to update its name.
 *
 * @param {String} id The device's id
 * @param {String} name The new name of the device
 * @param {module:devices-api/VeoboxPilot~VeoboxPilot~askForUpdateNameCallback} callback Function to call when it's done
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
 * @param {Array} ids The list of connected devices' ids to start
 * @param {Number} presetId The id of the preset to use for the recording session
 * @param {String} [name] The name of the recording session
 * @param {module:devices-api/VeoboxPilot~VeoboxPilot~askForStartRecordCallback} callback Function to call when it's
 * done
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
 * @param {Array} ids The list of connected devices' ids to stop
 * @param {module:devices-api/VeoboxPilot~VeoboxPilot~askForStopRecordCallback} callback Function to call when it's done
 */
VeoboxPilot.prototype.askForStopRecord = function(ids, callback) {
  ask.call(this, ids, 'session.stop', {}, callback);
};

/**
 * Asks devices to index a record (tag).
 *
 * @param {Array} ids The list of connected devices' ids to index
 * @param {module:devices-api/VeoboxPilot~VeoboxPilot~askForSessionIndexCallback} callback Function to call when it's
 * done
 */
VeoboxPilot.prototype.askForSessionIndex = function(ids, callback) {
  ask.call(this, ids, 'session.index', {type: 'tag'}, callback);
};

/**
 * Cuts the communication with the device.
 *
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

/**
 * @callback module:devices-api/VeoboxPilot~VeoboxPilot~askCallback
 * @param {null} null Always null
 * @param {Array} results Results for each device
 * @param {module:devices-api/DeviceError~DeviceError} results[].error An error if something went wrong
 * @param {String} results[].value The device's id
 */

/**
 * @callback module:devices-api/VeoboxPilot~VeoboxPilot~askForSettingsCallback
 * @param {null} null Always null
 * @param {Array} results Results for each device
 */

/**
 * @callback module:devices-api/VeoboxPilot~VeoboxPilot~askForNameCallback
 * @param {null} null Always null
 * @param {Array} results Results for each device
 */

/**
 * @callback module:devices-api/VeoboxPilot~VeoboxPilot~askForUpdateNameCallback
 * @param {(module:devices-api/DeviceError~DeviceError|null)} error An error if something went wrong, null otherwise
 */

/**
 * @callback module:devices-api/VeoboxPilot~VeoboxPilot~askForStartRecordCallback
 * @param {null} null Always null
 * @param {Array} results Results for each device
 */

/**
 * @callback module:devices-api/VeoboxPilot~VeoboxPilot~askForStopRecordCallback
 * @param {null} null Always null
 * @param {Array} results Results for each device
 */

/**
 * @callback module:devices-api/VeoboxPilot~VeoboxPilot~askForSessionIndexCallback
 * @param {null} null Always null
 * @param {Array} results Results for each device
 */

