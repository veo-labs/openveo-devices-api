'use strict';

/**
 * @module devices-api
 */

/**
 * Stores the list of devices' pilots.
 *
 * One pilot per type of devices.
 *
 * @class devicesPilotsManager
 * @static
 */

var DevicePilot = process.requireDevicesApi('app/server/devices/DevicePilot.js');

// The list of devices' pilots
var pilots = [];

/**
 * Adds a new devices' pilot to the list of pilots.
 *
 * @method add
 * @static
 * @param {DevicePilot} pilot The devices' pilot to add
 */
module.exports.add = function(pilot) {
  if (pilot && pilot instanceof DevicePilot && !this.get(pilot.type))
    pilots.push(pilot);
};

/**
 * Removes a devices' pilot from the list of pilots.
 *
 * @method remove
 * @static
 * @param {Number} type The pilot type to remove
 */
module.exports.remove = function(type) {
  var index = -1;
  for (var i = 0; i < pilots.length; i++) {
    if (pilots[i].type === type) {
      index = i;
      break;
    }
  }

  if (index > -1)
    pilots.splice(index, 1);
};

/**
 * Gets a pilot by its type.
 *
 * @method get
 * @static
 * @param {Number} type The type of pilot to retrieve
 * @return {DevicePilot|Null} The pilot if found, null otherwise
 */
module.exports.get = function(type) {
  for (var i = 0; i < pilots.length; i++)
    if (pilots[i].type === type)
      return pilots[i];

  return null;
};

/**
 * Gets the list of pilots.
 *
 * @method getAll
 * @static
 * @return {Array} The list of pilots
 */
module.exports.getAll = function() {
  return pilots;
};
