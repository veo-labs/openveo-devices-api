# Server side API (Node.js)

The [OpenVeo Devices API](/api) helps you communicate with socket based devices inside your OpenVeo plugins.

You can use [openveo-api](https://github.com/veo-labs/openveo-api) to get the OpenVeo Devices API :

```js
var openVeoApi = require('@openveo/api');
var devicesApi = openVeoApi.api.getApi('devices-api');
```
