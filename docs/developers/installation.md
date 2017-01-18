# Clone project from git

From OpenVeo parent directory :

    git clone git@github.com:veo-labs/openveo-devices-api.git

You should have someting like this :

```
.
├── openveo-core
├── openveo-devices-api
```

# Install project's dependencies

    cd openveo-devices-api
    npm install

# Link plugin to the core

    cd openveo-devices-api
    npm link

    cd openveo-core
    npm link @openveo/devices-api

