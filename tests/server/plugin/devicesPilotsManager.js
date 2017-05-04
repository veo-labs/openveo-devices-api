'use strict';

var util = require('util');
var assert = require('chai').assert;
var openVeoApi = require('@openveo/api');
var devicesPilotsManager = process.requireDevicesApi('app/server/devicesPilotsManager.js');
var DevicePilot = process.requireDevicesApi('app/server/devices/DevicePilot.js');
var VeoboxPilot = process.requireDevicesApi('app/server/devices/veobox/VeoboxPilot.js');
var DEVICES_TYPES = process.requireDevicesApi('app/server/devices/types.js');

// devicesPilotsManager.js
describe('devicesPilotsManager', function() {
  var TestPilot;

  // Mocks
  beforeEach(function() {
    TestPilot = function(devicesEmitter, namespace) {
      VeoboxPilot.super_.call(this, 42, devicesEmitter, namespace);
    };

    util.inherits(TestPilot, DevicePilot);
  });

  // Remove all pilots from pilots manager
  afterEach(function() {
    devicesPilotsManager.remove(DEVICES_TYPES.VEOBOX);
  });

  // add method
  describe('add', function() {

    it('should be able to add a DevicePilot', function() {
      var pilot = new VeoboxPilot(
        new openVeoApi.emitters.AdvancedEmitter(),
        new openVeoApi.socket.SocketNamespace()
      );
      devicesPilotsManager.add(pilot);
      assert.instanceOf(devicesPilotsManager.get(pilot.type), VeoboxPilot);
    });

    it('should not be able to add something which is not a DevicePilot', function() {
      var values = [null, undefined, {}, [], true, 42];

      values.forEach(function(value) {
        devicesPilotsManager.add(value);
        assert.equal(devicesPilotsManager.getAll().length, 0, 'Unexpected pilot for "' + value + '"');
      });
    });

    it('should not add a pilot if a pilot is already added for the devices\' type', function() {
      var emitter = new openVeoApi.emitters.AdvancedEmitter();
      var namespace = new openVeoApi.socket.SocketNamespace();
      devicesPilotsManager.add(new VeoboxPilot(emitter, namespace));
      devicesPilotsManager.add(new VeoboxPilot(emitter, namespace));
      assert.equal(devicesPilotsManager.getAll().length, 1);
    });

  });

  // remove method
  describe('remove', function() {
    var pilot;

    beforeEach(function() {
      pilot = new VeoboxPilot(
        new openVeoApi.emitters.AdvancedEmitter(),
        new openVeoApi.socket.SocketNamespace()
      );
      devicesPilotsManager.add(pilot);
    });

    it('should be able to remove a DevicePilot', function() {
      assert.equal(devicesPilotsManager.getAll().length, 1, 'Expected pilot to be added');
      devicesPilotsManager.remove(pilot.type);
      assert.equal(devicesPilotsManager.getAll().length, 0, 'Expected pilot to be removed');
    });

    it('should not remove without a type', function() {
      devicesPilotsManager.remove();
      assert.equal(devicesPilotsManager.getAll().length, 1);
    });

  });

  // get method
  describe('get', function() {

    it('should be able to retrieve a pilot by its type', function() {
      var expectedPilot = new VeoboxPilot(
        new openVeoApi.emitters.AdvancedEmitter(),
        new openVeoApi.socket.SocketNamespace()
      );
      devicesPilotsManager.add(expectedPilot);
      assert.strictEqual(devicesPilotsManager.get(expectedPilot.type), expectedPilot);
    });

    it('should return null if no pilot correspond to the given type', function() {
      assert.isNull(devicesPilotsManager.get('wrong type'));
    });

  });

  // getAll method
  describe('getAll', function() {

    it('should return the list of pilots', function() {
      var emitter = new openVeoApi.emitters.AdvancedEmitter();
      var namespace = new openVeoApi.socket.SocketNamespace();
      var veoboxPilot = new VeoboxPilot(emitter, namespace);
      var testPilot = new TestPilot(emitter, namespace);
      devicesPilotsManager.add(veoboxPilot);
      devicesPilotsManager.add(testPilot);
      assert.equal(devicesPilotsManager.getAll().length, 2);
    });

  });

});
