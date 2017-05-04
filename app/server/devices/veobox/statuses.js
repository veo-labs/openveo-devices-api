'use strict';

/**
 * @module devices
 */

/**
 * Defines the list of Veobox statuses.
 *
 * @module devices
 * @class VEOBOX_STATUSES
 * @static
 */

var VEOBOX_STATUSES = {

  /**
   * Device is stopped.
   *
   * @property STOPPED
   * @type String
   * @default 'stopped'
   * @final
   * @static
   */
  STOPPED: 'stopped',

  /**
   * Device is on error.
   *
   * @property ERROR
   * @type String
   * @default 'error'
   * @final
   * @static
   */
  ERROR: 'error',

  /**
   * Device is recording.
   *
   * @property STARTED
   * @type String
   * @default 'started'
   * @final
   * @static
   */
  STARTED: 'started',

  /**
   * Device is about to start a record.
   *
   * @property STARTING
   * @type String
   * @default 'starting'
   * @final
   * @static
   */
  STARTING: 'starting',

  /**
   * Device is about to stop a record.
   *
   * @property STOPPING
   * @type String
   * @default 'stopping'
   * @final
   * @static
   */
  STOPPING: 'stopping',

  /**
   * Device is not connected.
   *
   * @property DISCONNECTED
   * @type String
   * @default 'disconnected'
   * @final
   * @static
   */
  DISCONNECTED: 'disconnected',

  /**
   * Device status is unknown.
   *
   * @property UNKNOWN
   * @type String
   * @default 'unknown'
   * @final
   * @static
   */
  UNKNOWN: 'unknown'
};

Object.freeze(VEOBOX_STATUSES);
module.exports = VEOBOX_STATUSES;
