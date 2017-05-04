'use strict';

var assert = require('chai').assert;
var openVeoApi = require('@openveo/api');
var DevicePilot = process.requireDevicesApi('app/server/devices/DevicePilot.js');

// DevicePilot.js
describe('DevicePilot', function() {
  var pilot;

  // Prepare test
  beforeEach(function() {
    pilot = new DevicePilot(
      new openVeoApi.emitters.AdvancedEmitter(),
      new openVeoApi.socket.SocketNamespace()
    );
  });

  // constructor
  describe('constructor', function() {

    it('should be an instance of Pilot', function() {
      assert.instanceOf(pilot, openVeoApi.socket.Pilot);
    });

  });

  // type property
  describe('type property', function() {

    it('should not be editable', function() {
      assert.throws(function() {
        pilot.type = null;
      });
    });

  });

});
