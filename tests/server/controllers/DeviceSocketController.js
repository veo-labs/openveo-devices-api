'use strict';

var assert = require('chai').assert;
var openVeoApi = require('@openveo/api');
var DeviceSocketController = process.requireDevicesApi('app/server/controllers/DeviceSocketController.js');
var devicesPilotsManager = process.requireDevicesApi('app/server/devicesPilotsManager.js');
var DEVICES_TYPES = process.requireDevicesApi('app/server/devices/types.js');
var DevicePilot = process.requireDevicesApi('app/server/devices/DevicePilot.js');

// DeviceSocketController.js
describe('DeviceSocketController', function() {
  var namespace;
  var controller;

  // Prepare tests
  beforeEach(function() {
    namespace = new openVeoApi.socket.SocketNamespace();
    controller = new DeviceSocketController(DEVICES_TYPES.VEOBOX, namespace);
  });

  // Remove all pilots from pilots manager
  afterEach(function() {
    devicesPilotsManager.remove(DEVICES_TYPES.VEOBOX);
  });

  // constructor
  describe('constructor', function() {

    it('should be an instance of SocketController', function() {
      assert.instanceOf(controller, openVeoApi.controllers.SocketController);
    });

    it('should create a pilot to control the Veoboxes', function() {
      assert.instanceOf(controller.pilot, DevicePilot);
    });

    it('should not be able to change the pilot', function() {
      assert.throws(function() {
        controller.pilot = null;
      });
    });

    it('should add the pilot to the list of pilots', function() {
      assert.isDefined(devicesPilotsManager.get(DEVICES_TYPES.VEOBOX));
    });

  });

});
