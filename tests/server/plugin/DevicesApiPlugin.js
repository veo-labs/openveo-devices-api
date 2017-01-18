'use strict';

var assert = require('chai').assert;
var openVeoApi = require('@openveo/api');
var DevicesApiPlugin = process.requireDevicesApi('app/server/DevicesApiPlugin.js');
var DevicesApiPluginApi = process.requireDevicesApi('app/server/DevicesApiPluginApi.js');

// DevicesApiPlugin.js
describe('DevicesApiPlugin', function() {
  var plugin;

  // Prepare test
  beforeEach(function() {
    plugin = new DevicesApiPlugin();
  });

  // constructor
  describe('constructor', function() {

    it('should be an instance of Plugin', function() {
      assert.instanceOf(plugin, openVeoApi.plugin.Plugin);
    });

  });

  // api property
  describe('api property', function() {

    it('should not be editable', function() {
      assert.throws(function() {
        plugin.api = null;
      });
    });

    it('should be an instance of DevicesApiPluginApi', function() {
      assert.instanceOf(plugin.api, DevicesApiPluginApi);
    });

  });

});
