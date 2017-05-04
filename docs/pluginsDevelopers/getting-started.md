# Installation

From OpenVeo root :

    npm install @openveo/devices-api

# Setup your devices

Configure your devices to establish a socket connection on your OpenVeo socket server with namespace **/devices-api/DEVICE_TYPE**, replacing DEVICE_TYPE by the type of devices you want to communicate with (only **veobox** is supported right now).

# Use API

You can now use the OpenVeo Devices API to get information from your devices :

```js
var devicesApi = process.api.getApi('devices-api');
var DEVICES_TYPES = devicesApi.getDevicesTypes();
var pilot = devicesApi.getPilot(DEVICES_TYPES.VEOBOX);

pilot.on(pilot.EVENTS.AUTHENTICATED, function(id, deviceIp, socketId) {
  console.log('New device connected with id ' + id + ' and ip ' + deviceIp);
});
```

Or control your devices :

```js
var devicesApi = process.api.getApi('devices-api');
var DEVICES_TYPES = devicesApi.getDevicesTypes();
var pilot = devicesApi.getPilot(DEVICES_TYPES.VEOBOX);

pilot.askForStartRecord([deviceId], null, function(results) {
  console.log('Device ' + deviceId + ' is starting');
});
```

See the [API](api.md) for more information.
