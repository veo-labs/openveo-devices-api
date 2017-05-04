'use strict';

/**
 * @module devices
 */

/**
 * Defines the list of socket messages sent by Veobox's devices.
 *
 * @class VEOBOX_MESSAGES
 * @static
 */

var VEOBOX_MESSAGES = {

  /**
   * A socket connection has been established with the device.
   *
   * @property CONNECTED
   * @type String
   * @default 'connection'
   * @final
   */
  CONNECTED: 'connection',

  /**
   * Notify a device connection.
   *
   * @property AUTHENTICATED
   * @type String
   * @default 'hello'
   * @final
   * @static
   */
  AUTHENTICATED: 'hello',

  /**
   * Notify a record status change.
   *
   * @property SESSION_STATUS_UPDATED
   * @type String
   * @default 'session.status'
   * @final
   * @static
   */
  SESSION_STATUS_UPDATED: 'session.status',

  /**
   * Notify a new record index.
   *
   * @property NEW_SESSION_INDEX
   * @type String
   * @default 'session.index'
   * @final
   * @static
   */
  NEW_SESSION_INDEX: 'session.index',

  /**
   * Notify the human-readable name of the device.
   *
   * @property NAME_UPDATED
   * @type String
   * @default 'settings.name'
   * @final
   * @static
   */
  NAME_UPDATED: 'settings.name',

  /**
   * Notify the configured presets and details.
   *
   * @property PRESETS_UPDATED
   * @type String
   * @default 'settings.presets'
   * @final
   * @static
   */
  PRESETS_UPDATED: 'settings.presets',

  /**
   * Notify the storage information.
   *
   * @property STORAGE_UPDATED
   * @type String
   * @default 'storage'
   * @final
   * @static
   */
  STORAGE_UPDATED: 'storage',

  /**
   * Notify the inputs status.
   *
   * @property INPUTS_UPDATED
   * @type String
   * @default 'inputs'
   * @final
   * @static
   */
  INPUTS_UPDATED: 'inputs',

  /**
   * Notify device's disconnection.
   *
   * @property DISCONNECTED
   * @type String
   * @default 'disconnect'
   * @final
   * @static
   */
  DISCONNECTED: 'disconnect',

  /**
   * Notify a socket error while communicating with the device.
   *
   * @property ERROR
   * @type String
   * @default 'error'
   * @final
   * @static
   */
  ERROR: 'error'

};

Object.freeze(VEOBOX_MESSAGES);
module.exports = VEOBOX_MESSAGES;
