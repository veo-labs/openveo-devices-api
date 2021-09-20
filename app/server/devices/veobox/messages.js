'use strict';

/**
 * @module devices-api/messages
 */

/**
 * Defines the list of socket messages sent by Veobox's devices.
 * @namespace
 */

var VEOBOX_MESSAGES = {

  /**
   * A socket connection has been established with the device.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  CONNECTED: 'connection',

  /**
   * Notify a device connection.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  AUTHENTICATED: 'hello',

  /**
   * Notify a record status change.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  SESSION_STATUS_UPDATED: 'session.status',

  /**
   * Notify a new record index.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  NEW_SESSION_INDEX: 'session.index',

  /**
   * Notify the human-readable name of the device.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  NAME_UPDATED: 'settings.name',

  /**
   * Notify the configured presets and details.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  PRESETS_UPDATED: 'settings.presets',

  /**
   * Notify the storage information.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  STORAGE_UPDATED: 'storage',

  /**
   * Notify the inputs status.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  INPUTS_UPDATED: 'inputs',

  /**
   * Notify device's disconnection.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  DISCONNECTED: 'disconnect',

  /**
   * Notify a socket error while communicating with the device.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  ERROR: 'error'

};

Object.freeze(VEOBOX_MESSAGES);
module.exports = VEOBOX_MESSAGES;
