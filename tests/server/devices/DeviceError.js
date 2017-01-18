'use strict';

var assert = require('chai').assert;
var DeviceError = process.requireDevicesApi('app/server/devices/DeviceError.js');

// DeviceError.js
describe('DeviceError', function() {
  var error;

  // Prepare test
  beforeEach(function() {
    error = new DeviceError('message', 'id', 'code');
  });

  // constructor
  describe('constructor', function() {

    it('should be an instance of Error', function() {
      assert.instanceOf(error, Error);
    });

    it('should be named "DeviceError"', function() {
      assert.equal(error.name, 'DeviceError');
    });

  });

  // properties
  describe('properties', function() {

    it('should not be editable', function() {
      var properties = ['deviceId', 'code'];

      properties.forEach(function(property) {
        assert.throws(function() {
          error[property] = null;
        });
      });
    });

  });

});
