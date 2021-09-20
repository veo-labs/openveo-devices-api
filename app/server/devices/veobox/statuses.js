'use strict';

/**
 * @module devices-api/statuses
 */

/**
 * Defines the list of Veobox statuses.
 * @namespace
 */

var VEOBOX_STATUSES = {

  /**
   * Device is stopped.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  STOPPED: 'stopped',

  /**
   * Device is on error.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  ERROR: 'error',

  /**
   * Device is recording.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  STARTED: 'started',

  /**
   * Device is about to start a record.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  STARTING: 'starting',

  /**
   * Device is about to stop a record.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  STOPPING: 'stopping',

  /**
   * Device is not connected.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  DISCONNECTED: 'disconnected',

  /**
   * Device status is unknown.
   *
   * @const
   * @type {String}
   * @default
   * @inner
   */
  UNKNOWN: 'unknown'
};

Object.freeze(VEOBOX_STATUSES);
module.exports = VEOBOX_STATUSES;
