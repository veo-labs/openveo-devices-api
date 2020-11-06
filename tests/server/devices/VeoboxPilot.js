'use strict';

var chai = require('chai');
var spies = require('chai-spies');
var openVeoApi = require('@openveo/api');
var VeoboxPilot = process.requireDevicesApi('app/server/devices/veobox/VeoboxPilot.js');
var DevicePilot = process.requireDevicesApi('app/server/devices/DevicePilot.js');
var AdvancedEvent = openVeoApi.emitters.AdvancedEvent;
var assert = chai.assert;

chai.should();
chai.use(spies);

// VeoboxPilot.js
describe('VeoboxPilot', function() {
  var pilot;
  var emitter;
  var expectedCallback;
  var expectedSocket;

  // Prepare test
  beforeEach(function() {
    expectedCallback = function() {};
    expectedSocket = {
      id: 42,
      handshake: {address: '127.0.0.1', headers: {}},
      emit: function(name, data, callback) {
        callback();
      }
    };
    emitter = new openVeoApi.emitters.AdvancedEmitter();
    pilot = new VeoboxPilot(
      emitter,
      new openVeoApi.socket.SocketNamespace()
    );
  });

  // constructor
  describe('constructor', function() {

    it('should be an instance of DevicePilot', function() {
      assert.instanceOf(pilot, DevicePilot);
    });

  });

  // type property
  describe('type property', function() {

    it('should not be editable', function() {
      var properties = ['MESSAGES', 'STATUSES'];

      properties.forEach(function(property) {
        assert.throws(function() {
          pilot[property] = null;
        });
      });
    });

  });

  // AUTHENTICATED event
  describe('AUTHENTICATED', function() {

    it('should add veobox to the list of clients', function() {
      var expectedId = '42';
      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.AUTHENTICATED, expectedId, expectedSocket, expectedCallback));
      assert.equal(pilot.clients.length, 1);
    });

    it('should be emitted with IP address and id', function(done) {
      var expectedId = '42';

      pilot.on(pilot.MESSAGES.AUTHENTICATED, function(ip, id, callback) {
        assert.strictEqual(ip, expectedSocket.handshake.address, 'Unexpected IP');
        assert.strictEqual(id, expectedId, 'Unexpected id');
        assert.strictEqual(callback, expectedCallback, 'Unexpected callback');
        done();
      });

      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.AUTHENTICATED, expectedId, expectedSocket, expectedCallback));
    });

    it('should be emitted with X-Forwarded-For as IP address if defined', function(done) {
      var expectedId = '42';
      expectedSocket.handshake.headers['x-forwarded-for'] = '127.0.0.42';

      pilot.on(pilot.MESSAGES.AUTHENTICATED, function(ip, id, callback) {
        assert.strictEqual(ip, expectedSocket.handshake.headers['x-forwarded-for'], 'Wrong IP');
        done();
      });

      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.AUTHENTICATED, expectedId, expectedSocket, expectedCallback));
    });

  });

  // DISCONNECTED event
  describe('DISCONNECTED', function() {
    var expectedId = '42';

    beforeEach(function() {
      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.AUTHENTICATED, expectedId, expectedSocket, expectedCallback));
    });

    it('should remove veobox from the list of clients', function() {
      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.DISCONNECTED, expectedSocket));
      assert.equal(pilot.clients.length, 0);
    });

    it('should be emitted with client id', function(done) {
      pilot.on(pilot.MESSAGES.DISCONNECTED, function(id) {
        assert.strictEqual(id, expectedId, 'Unexpected id');
        done();
      });

      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.DISCONNECTED, expectedSocket));
    });

    it('should not be emitted if client is not connected', function() {
      var spy = chai.spy(function() {});
      pilot.on(pilot.MESSAGES.DISCONNECTED, spy);

      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.DISCONNECTED, expectedSocket));
      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.DISCONNECTED, expectedSocket));

      spy.should.have.been.called.exactly(1);
    });

  });

  // ERROR event
  describe('ERROR', function() {
    var expectedId = '42';
    var expectedError = new Error('error message');

    beforeEach(function() {
      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.AUTHENTICATED, expectedId, expectedSocket, expectedCallback));
    });

    it('should be emitted with error and id', function(done) {
      pilot.on(pilot.MESSAGES.ERROR, function(error, id) {
        assert.strictEqual(error, expectedError, 'Unexpected error');
        assert.strictEqual(id, expectedId, 'Unexpected id');
        done();
      });

      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.ERROR, expectedError, expectedSocket));
    });

    it('should not be emitted if client is not connected', function() {
      var spy = chai.spy(function() {});
      pilot.on(pilot.MESSAGES.ERROR, spy);

      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.DISCONNECTED, expectedSocket));
      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.ERROR, expectedError, expectedSocket));

      spy.should.have.been.called.exactly(0);
    });
  });

  var MESSAGES = [
    'SESSION_STATUS_UPDATED',
    'NEW_SESSION_INDEX',
    'NAME_UPDATED',
    'PRESETS_UPDATED',
    'STORAGE_UPDATED',
    'INPUTS_UPDATED'
  ];

  MESSAGES.forEach(function(MESSAGE) {

    describe(MESSAGE, function() {
      var expectedId = '42';
      var expectedParam = 'value';

      beforeEach(function() {
        emitter.emitEvent(
          new AdvancedEvent(pilot.MESSAGES.AUTHENTICATED, expectedId, expectedSocket, expectedCallback)
        );
      });

      it('should be emitted with parameters, id and callback', function(done) {
        pilot.on(pilot.MESSAGES[MESSAGE], function(param, id, callback) {
          assert.strictEqual(param, expectedParam, 'Unexpected parameter');
          assert.strictEqual(id, expectedId, 'Unexpected id');
          assert.strictEqual(callback, expectedCallback, 'Unexpected callback');
          done();
        });
        emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES[MESSAGE], expectedParam, expectedSocket, expectedCallback));
      });

    });

  });

  var askMethods = {
    askForSettings: {parameters: []},
    askForName: {parameters: []},
    askForStartRecord: {parameters: [42]},
    askForStopRecord: {parameters: []},
    askForSessionIndex: {parameters: []}
  };

  Object.keys(askMethods).forEach(function(askMethod) {

    describe(askMethod, function() {
      var expectedId1 = '42';
      var expectedId2 = '43';
      var expectedSocket2 = {
        id: 43,
        handshake: {address: '127.0.0.2', headers: {}},
        emit: function(name, data, callback) {
          callback();
        }
      };

      beforeEach(function() {
        emitter.emitEvent(
          new AdvancedEvent(pilot.MESSAGES.AUTHENTICATED, expectedId1, expectedSocket, expectedCallback)
        );
        emitter.emitEvent(
          new AdvancedEvent(pilot.MESSAGES.AUTHENTICATED, expectedId2, expectedSocket2, expectedCallback)
        );
      });

      it('should be able to ask for one or several veoboxes', function(done) {
        var parameters = [[expectedId1, expectedId2]];
        parameters = parameters.concat(askMethods[askMethod].parameters);
        parameters.push(function(error, results) {
          assert.isNull(error, 'Unexpected error');
          assert.equal(results.length, 2);
          done();
        });

        pilot[askMethod].apply(pilot, parameters);
      });

      it('should execute callback with an error if something went wrong', function(done) {
        var parameters = [[expectedId1, expectedId2]];
        parameters = parameters.concat(askMethods[askMethod].parameters);
        parameters.push(function(error, results) {
          assert.isNull(error, 'Unexpected error');
          assert.isDefined(results[0].value, 'Expected value for the first Veobox');
          assert.isDefined(results[1].error, 'Expected error for the second Veobox');
          done();
        });
        expectedSocket2.emit = function(name, data, callback) {
          callback({error: new Error('Something went wrong')});
        };

        pilot[askMethod].apply(pilot, parameters);
      });

      it('should execute callback with an error if the veobox is not connected', function(done) {
        var parameters = [[expectedId2]];
        parameters = parameters.concat(askMethods[askMethod].parameters);
        parameters.push(function(error, results) {
          assert.isNull(error, 'Unexpected error');
          assert.isDefined(results[0].error, 'Expected error for the first Veobox');
          done();
        });
        emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.DISCONNECTED, expectedSocket2, expectedCallback));

        pilot[askMethod].apply(pilot, parameters);
      });

      if (askMethod === 'askForStartRecord') {

        it('should ask devices to start a record', function(done) {
          var expectedPresetId = 42;
          var date = new Date();
          var expectedId = date.getFullYear() + '-' +
                           ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                           ('0' + date.getDate()).slice(-2) + '_' +
                           ('0' + date.getHours()).slice(-2) + '-' +
                           ('0' + date.getMinutes()).slice(-2) + '-' +
                           ('0' + date.getSeconds()).slice(-2);

          expectedSocket.emit = chai.spy(function(name, data, callback) {
            assert.equal(data.id, expectedId, 'Wrong device 1 id');
            assert.equal(data.preset, expectedPresetId, 'Wrong device 1 preset id');
            callback();
          });

          expectedSocket2.emit = chai.spy(function(name, data, callback) {
            assert.equal(data.id, expectedId, 'Wrong device 2 id');
            assert.equal(data.preset, expectedPresetId, 'Wrong device 2 preset id');
            callback();
          });

          pilot[askMethod]([expectedId1, expectedId2], expectedPresetId, function(error, results) {
            assert.isNull(error, 'Unexpected error');
            assert.equal(results.length, 2);
            expectedSocket.emit.should.have.been.called.exactly(1);
            expectedSocket2.emit.should.have.been.called.exactly(1);
            done();
          });
        });

      }

    });

  });

  // askForUpdateName method
  describe('askForUpdateName', function() {
    var expectedId = '42';
    var expectedName = 'new name';

    beforeEach(function() {
      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.AUTHENTICATED, expectedId, expectedSocket, expectedCallback));
    });

    it('should be able to ask a device to change its name', function(done) {
      pilot.askForUpdateName(expectedId, expectedName, function(error, results) {
        assert.isUndefined(error, 'Unexpected error');
        assert.isUndefined(results, 'Unexpected results');
        done();
      });
    });

    it('should execute callback with an error if something went wrong', function(done) {
      expectedSocket.emit = function(name, data, callback) {
        callback({error: new Error('Something went wrong')});
      };

      pilot.askForUpdateName(expectedId, expectedName, function(error, results) {
        assert.isDefined(error, 'Expected error');
        assert.isUndefined(results, 'Unexpected results');
        done();
      });
    });

    it('should execute callback with an error if the veobox is not connected', function(done) {
      emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.DISCONNECTED, expectedSocket, expectedCallback));

      pilot.askForUpdateName(expectedId, expectedName, function(error, results) {
        assert.isDefined(error, 'Expected error');
        assert.isUndefined(results, 'Unexpected results');
        done();
      });
    });

  });

  // disconnect method
  describe('disconnect', function(done) {

    it('should close communication with clients', function() {
      var count = 0;
      var expectedSockets = [
        {
          id: 42,
          handshake: {address: '127.0.0.42', headers: {}},
          disconnect: function() {
            count++;
          }
        },
        {
          id: 43,
          handshake: {address: '127.0.0.43', headers: {}},
          disconnect: function() {
            count++;
          }
        }
      ];
      var expectedDevicesIds = [];

      expectedSockets.forEach(function(socket) {
        expectedDevicesIds.push(socket.id);
        emitter.emitEvent(new AdvancedEvent(pilot.MESSAGES.AUTHENTICATED, socket.id, socket, expectedCallback));
      });

      pilot.disconnect(expectedDevicesIds);

      assert.equal(count, expectedSockets.length);
    });

    it('should throw an error if ids is not an array', function() {
      var wrongValues = [undefined, null, 'String', 42, {}];

      wrongValues.forEach(function(wrongValue) {
        assert.throws(function() {
          pilot.disconnect(wrongValue);
        }, null, null, 'Expected an exception for value : ' + wrongValue);
      });
    });

    it('should not throw an error if device is not connected', function() {
      assert.doesNotThrow(function() {
        pilot.disconnect(['unknown device']);
      });
    });

  });

});
