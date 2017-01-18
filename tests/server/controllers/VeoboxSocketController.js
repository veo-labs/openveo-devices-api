'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('chai').assert;
var openVeoApi = require('@openveo/api');
var VeoboxSocketController = process.requireDevicesApi('app/server/controllers/VeoboxSocketController.js');
var DeviceSocketController = process.requireDevicesApi('app/server/controllers/DeviceSocketController.js');
var devicesPilotsManager = process.requireDevicesApi('app/server/devicesPilotsManager.js');
var DEVICES_TYPES = process.requireDevicesApi('app/server/devices/types.js');
var VEOBOX_MESSAGES = process.requireDevicesApi('app/server/devices/veobox/messages.js');
var VEOBOX_STATUSES = process.requireDevicesApi('app/server/devices/veobox/statuses.js');

// VeoboxSocketController.js
describe('VeoboxSocketController', function() {
  var namespace;
  var controller;
  var expectedSocket;
  var expectedCallback;

  // Prepare tests
  beforeEach(function() {
    namespace = new openVeoApi.socket.SocketNamespace();
    controller = new VeoboxSocketController(namespace);
    expectedSocket = {id: 43, handshake: {address: '127.0.0.1'}};
    expectedCallback = function() {};
  });

  // Remove all pilots from pilots manager
  afterEach(function() {
    devicesPilotsManager.remove(DEVICES_TYPES.VEOBOX);
  });

  // constructor
  describe('constructor', function() {

    it('should be an instance of DeviceSocketController', function() {
      assert.instanceOf(controller, DeviceSocketController);
    });

  });

  // authenticateAction method
  describe('authenticateAction', function() {

    it('should emit a AUTHENTICATED event', function() {
      var expectedData = {id: '42'};
      controller.emitter.on(VEOBOX_MESSAGES.AUTHENTICATED, function(eventName, id, socket, callback) {
        assert.equal(eventName, VEOBOX_MESSAGES.AUTHENTICATED, 'Unexpected event name');
        assert.equal(id, expectedData.id, 'Unexpected id');
        assert.strictEqual(socket, expectedSocket, 'Unexpected socket');
        assert.strictEqual(callback, expectedCallback, 'Unexpected callback');
      });

      controller.authenticateAction(expectedData, expectedSocket, expectedCallback);
    });

    it('should execute callback with an error if the id is not valid', function() {
      controller.authenticateAction({}, expectedSocket, function(error) {
        assert.isDefined(error);
      });
    });

  });

  // updateSessionStatusAction method
  describe('updateSessionStatusAction', function() {

    it('should emit a SESSION_STATUS_UPDATED event', function() {
      var expectedData = {status: VEOBOX_STATUSES.STOPPED};
      controller.emitter.on(VEOBOX_MESSAGES.SESSION_STATUS_UPDATED, function(eventName, status, socket, callback) {
        assert.equal(eventName, VEOBOX_MESSAGES.SESSION_STATUS_UPDATED, 'Unexpected event name');
        assert.equal(status, expectedData.status, 'Unexpected status');
        assert.strictEqual(socket, expectedSocket, 'Unexpected socket');
        assert.strictEqual(callback, expectedCallback, 'Unexpected callback');
      });

      controller.updateSessionStatusAction(expectedData, expectedSocket, expectedCallback);
    });

    it('should execute callback with an error if the status is not valid', function() {
      controller.updateSessionStatusAction({status: 'wrongStatus'}, expectedSocket, function(error) {
        assert.isDefined(error);
      });
    });

  });

  // indexSessionAction method
  describe('indexSessionAction', function() {

    it('should emit a NEW_SESSION_INDEX event with a tag', function() {
      var expectedData = {type: 'tag', timecode: 1000};
      controller.emitter.on(
        VEOBOX_MESSAGES.NEW_SESSION_INDEX,
        function(eventName, type, timecode, data, socket, callback) {
          assert.equal(eventName, VEOBOX_MESSAGES.NEW_SESSION_INDEX, 'Unexpected event name');
          assert.equal(type, expectedData.type, 'Unexpected type');
          assert.equal(timecode, expectedData.timecode, 'Unexpected timecode');
          assert.isUndefined(data, expectedData.data, 'Unexpected data');
          assert.strictEqual(socket, expectedSocket, 'Unexpected socket');
          assert.strictEqual(callback, expectedCallback, 'Unexpected callback');
        }
      );

      controller.indexSessionAction(expectedData, expectedSocket, expectedCallback);
    });

    it('should emit a NEW_SESSION_INDEX event with an image', function() {
      fs.readFile(path.join(__dirname, 'resources/JPG.jpg'), function(error, data) {
        var expectedData = {type: 'image', timecode: 1000, data: data.toString('binary')};
        controller.emitter.on(
          VEOBOX_MESSAGES.NEW_SESSION_INDEX,
          function(eventName, type, timecode, data, socket, callback) {
            assert.equal(eventName, VEOBOX_MESSAGES.NEW_SESSION_INDEX, 'Unexpected event name');
            assert.equal(type, expectedData.type, 'Unexpected type');
            assert.equal(timecode, expectedData.timecode, 'Unexpected timecode');
            assert.strictEqual(data.type, 'JPG', 'Unexpected image type');
            assert.instanceOf(data.file, Buffer, 'Expected image buffer');
            assert.strictEqual(socket, expectedSocket, 'Unexpected socket');
            assert.strictEqual(callback, expectedCallback, 'Unexpected callback');
          }
        );

        controller.indexSessionAction(expectedData, expectedSocket, expectedCallback);
      });
    });

    it('should execute callback with an error if the type is not valid', function() {
      controller.indexSessionAction({type: 'wrongType', timecode: 1000}, expectedSocket, function(error) {
        assert.isDefined(error);
      });
    });

    it('should execute callback with an error if the timecode is not valid', function() {
      controller.indexSessionAction({type: 'tag', timecode: 'Wrong timecode'}, expectedSocket, function(error) {
        assert.isDefined(error);
      });
    });

    it('should execute callback with an error if the image is not supported', function() {
      controller.indexSessionAction(
        {
          type: 'image',
          timecode: 42,
          data: Buffer.from('not an image').toString('binary')
        },
        expectedSocket,
        function(error) {
          assert.isDefined(error);
        }
      );
    });

  });

  // updateNameAction method
  describe('updateNameAction', function() {

    it('should emit a NAME_UPDATED event', function() {
      var expectedData = {name: 'new name'};
      controller.emitter.on(VEOBOX_MESSAGES.NAME_UPDATED, function(eventName, name, socket, callback) {
        assert.equal(eventName, VEOBOX_MESSAGES.NAME_UPDATED, 'Unexpected event name');
        assert.equal(name, expectedData.name, 'Unexpected name');
        assert.strictEqual(socket, expectedSocket, 'Unexpected socket');
        assert.strictEqual(callback, expectedCallback, 'Unexpected callback');
      });

      controller.updateNameAction(expectedData, expectedSocket, expectedCallback);
    });

    it('should execute callback with an error if the name is not valid', function() {
      controller.updateNameAction({}, expectedSocket, function(error) {
        assert.isDefined(error);
      });
    });

  });

  // updatePresetsAction method
  describe('updatePresetsAction', function() {

    it('should emit a PRESETS_UPDATED event', function() {
      var expectedData = {};
      controller.emitter.on(VEOBOX_MESSAGES.PRESETS_UPDATED, function(eventName, presets, socket, callback) {
        assert.equal(eventName, VEOBOX_MESSAGES.PRESETS_UPDATED, 'Unexpected event name');
        assert.strictEqual(presets, expectedData, 'Unexpected name');
        assert.strictEqual(socket, expectedSocket, 'Unexpected socket');
        assert.strictEqual(callback, expectedCallback, 'Unexpected callback');
      });

      controller.updatePresetsAction(expectedData, expectedSocket, expectedCallback);
    });

    it('should execute callback with an error if the presets are not valid', function() {
      controller.updatePresetsAction(null, expectedSocket, function(error) {
        assert.isDefined(error);
      });
    });

  });

  // updateStorageAction method
  describe('updateStorageAction', function() {

    it('should emit a STORAGE_UPDATED event', function() {
      var expectedData = {free: 41, used: 42};
      controller.emitter.on(VEOBOX_MESSAGES.STORAGE_UPDATED, function(eventName, free, used, socket, callback) {
        assert.equal(eventName, VEOBOX_MESSAGES.STORAGE_UPDATED, 'Unexpected event name');
        assert.equal(free, expectedData.free, 'Unexpected free Bytes');
        assert.equal(used, expectedData.used, 'Unexpected used Bytes');
        assert.strictEqual(socket, expectedSocket, 'Unexpected socket');
        assert.strictEqual(callback, expectedCallback, 'Unexpected callback');
      });

      controller.updateStorageAction(expectedData, expectedSocket, expectedCallback);
    });

    it('should execute callback with an error if the free Bytes are not valid', function() {
      controller.updateStorageAction({used: 42}, expectedSocket, function(error) {
        assert.isDefined(error);
      });
    });

    it('should execute callback with an error if the used Bytes are not valid', function() {
      controller.updateStorageAction({free: 42}, expectedSocket, function(error) {
        assert.isDefined(error);
      });
    });

  });

  // updateInputsAction method
  describe('updateInputsAction', function() {

    it('should emit a INPUTS_UPDATED event', function() {
      var expectedData = {camera: {}, slides: {}};
      controller.emitter.on(VEOBOX_MESSAGES.INPUTS_UPDATED, function(eventName, camera, slides, socket, callback) {
        assert.equal(eventName, VEOBOX_MESSAGES.INPUTS_UPDATED, 'Unexpected event name');
        assert.equal(camera, expectedData.camera, 'Unexpected camera info');
        assert.equal(slides, expectedData.slides, 'Unexpected slides info');
        assert.strictEqual(socket, expectedSocket, 'Unexpected socket');
        assert.strictEqual(callback, expectedCallback, 'Unexpected callback');
      });

      controller.updateInputsAction(expectedData, expectedSocket, expectedCallback);
    });

    it('should execute callback with an error if the camera info are not valid', function() {
      controller.updateInputsAction({slides: {}}, expectedSocket, function(error) {
        assert.isDefined(error);
      });
    });

    it('should execute callback with an error if the slides info not valid', function() {
      controller.updateInputsAction({camera: {}}, expectedSocket, function(error) {
        assert.isDefined(error);
      });
    });

  });

  // disconnectAction method
  describe('disconnectAction', function() {

    it('should emit a DISCONNECTED event', function() {
      controller.emitter.on(VEOBOX_MESSAGES.DISCONNECTED, function(eventName, socket) {
        assert.equal(eventName, VEOBOX_MESSAGES.DISCONNECTED, 'Unexpected event name');
        assert.strictEqual(socket, expectedSocket);
      });

      controller.disconnectAction(expectedSocket);
    });

  });

  // errorAction method
  describe('errorAction', function() {

    it('should emit a ERROR event', function() {
      var expectedError = new Error('Error message');
      controller.emitter.on(VEOBOX_MESSAGES.ERROR, function(eventName, error, socket) {
        assert.equal(eventName, VEOBOX_MESSAGES.ERROR, 'Unexpected event name');
        assert.strictEqual(error, expectedError, 'Unexpected error');
        assert.strictEqual(socket, expectedSocket, 'Unexpected socket');
      });

      controller.errorAction(expectedError, expectedSocket, expectedCallback);
    });

  });
});
