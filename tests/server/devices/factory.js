'use strict';

var assert = require('chai').assert;
var openVeoApi = require('@openveo/api');
var factory = process.requireDevicesApi('app/server/devices/factory.js');
var DEVICES_TYPES = process.requireDevicesApi('app/server/devices/types.js');
var VeoboxPilot = process.requireDevicesApi('app/server/devices/veobox/VeoboxPilot.js');

// factory.js
describe('factory', function() {

  // get
  describe('get', function() {

    it('should be able to create a VeoboxPilot', function() {
      assert.instanceOf(factory.get(
        DEVICES_TYPES.VEOBOX,
        new openVeoApi.emitters.AdvancedEmitter(),
        new openVeoApi.socket.SocketNamespace()
      ), VeoboxPilot);
    });

    it('should throw an error if type is not supported', function() {
      assert.throws(function() {
        factory.get('unknown type');
      });
    });

  });

});
