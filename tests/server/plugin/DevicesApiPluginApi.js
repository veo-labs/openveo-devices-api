'use strict';

var assert = require('chai').assert;
var openVeoApi = require('@openveo/api');
var devicesPilotsManager = process.requireDevicesApi('app/server/devicesPilotsManager.js');
var VeoboxPilot = process.requireDevicesApi('app/server/devices/veobox/VeoboxPilot.js');
var DevicesApiPluginApi = process.requireDevicesApi('app/server/DevicesApiPluginApi.js');
var DEVICES_TYPES = process.requireDevicesApi('app/server/devices/types.js');

// DevicesApiPluginApi.js
describe('DevicesApiPluginApi', function() {
  var pluginApi;

  // Prepare test
  beforeEach(function() {
    pluginApi = new DevicesApiPluginApi();
    devicesPilotsManager.add(new VeoboxPilot(
      new openVeoApi.emitters.AdvancedEmitter(),
      new openVeoApi.socket.SocketNamespace()
    ));
  });

  // Remove all pilots from pilots manager
  afterEach(function() {
    devicesPilotsManager.remove(DEVICES_TYPES.VEOBOX);
  });

  // constructor
  describe('constructor', function() {

    it('should be an instance of PluginApi', function() {
      assert.instanceOf(pluginApi, openVeoApi.plugin.PluginApi);
    });

  });

  describe('getDevicesTypes', function() {

    it('should return the list of available devices\' types', function() {
      assert.strictEqual(pluginApi.getDevicesTypes(), DEVICES_TYPES);
    });

  });

  describe('getPilot', function() {

    it('should return the pilot corresponding to the given devices\' type', function() {
      assert.instanceOf(pluginApi.getPilot(DEVICES_TYPES.VEOBOX), VeoboxPilot);
    });

  });

});
