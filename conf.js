'use strict';

var VEOBOX_MESSAGES = process.requireDevicesApi('app/server/devices/veobox/messages.js');
var VeoboxSocketController = 'app/server/controllers/VeoboxSocketController';

module.exports = {
  socket: {
    namespaces: {
      public: {
        veobox: {
          [VEOBOX_MESSAGES.AUTHENTICATED]: VeoboxSocketController + '.authenticateAction',
          [VEOBOX_MESSAGES.SESSION_STATUS_UPDATED]: VeoboxSocketController + '.updateSessionStatusAction',
          [VEOBOX_MESSAGES.NEW_SESSION_INDEX]: VeoboxSocketController + '.indexSessionAction',
          [VEOBOX_MESSAGES.NAME_UPDATED]: VeoboxSocketController + '.updateNameAction',
          [VEOBOX_MESSAGES.PRESETS_UPDATED]: VeoboxSocketController + '.updatePresetsAction',
          [VEOBOX_MESSAGES.STORAGE_UPDATED]: VeoboxSocketController + '.updateStorageAction',
          [VEOBOX_MESSAGES.INPUTS_UPDATED]: VeoboxSocketController + '.updateInputsAction',
          [VEOBOX_MESSAGES.DISCONNECTED]: VeoboxSocketController + '.disconnectAction',
          [VEOBOX_MESSAGES.ERROR]: VeoboxSocketController + '.errorAction'
        }
      }
    }
  }
};
