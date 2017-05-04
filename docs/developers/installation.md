# Installation

To install OpenVeo Devices API you first need to install OpenVeo Core if not already done.


# OpenVeo Core

## Install @openveo/core package

    # Move to your workspace directory
    cd /WORKSPACE_PATH

    # Create directory for OpenVeo core
    mkdir openveo-core

    # Install OpenVeo core in this directory
    cd /WORKSPACE_PATH/openveo-core
    npm install @openveo/core

Your workspace should look like this:

```
.
├── openveo-core
```

## Create NPM links for openveo-api and openveo-test

In a classical NPM project @openveo/devices-api package should be installed in /WORKSPACE_PATH/openveo-core/node_modules/@openveo/core/node_modules/@openveo/devices-api. For development, the first thing which comes to mind is to create a clone of the OpenVeo Devices API project inside this repository. But doing this will prevent npm install from working and will create a complicated development architecture with the risk to erase the repository at any time.

We use [NPM links](https://docs.npmjs.com/cli/link) to deal with this problem and store OpenVeo Devices API inside /WORKSPACE_PATH/openveo-devices-api. But there is a catch. OpenVeo Devices API need both @openveo/api and @openveo/test of the core. As packages @openveo/devices-api and @openveo/core are installed in two different locations, package @openveo/devices-api won't find @openveo/api nor @openveo/test in its Node.JS path. That's why we have to create NPM links for both @openveo/api and @openveo/test and refer to it inside @openveo/devices-api.

    # Create a link for @openveo/api
    cd /WORKSPACE_PATH/openveo-core/node_modules/@openveo/core/node_modules/@openveo/api
    npm link

    # Create a link for @openveo/test
    cd /WORKSPACE_PATH/openveo-core/node_modules/@openveo/core/node_modules/@openveo/test
    npm link

# OpenVeo Devices API

## Clone project from git

    # Clone project into workspace
    cd /WORKSPACE_PATH/
    git clone git@github.com:veo-labs/openveo-devices-api.git

Your workspace should look like this:

```
.
├── openveo-core
├── openveo-devices-api
```

## Link openveo-api and openveo-test

When installing OpenVeo Core we created NPM links for @openveo/api and @openveo/test. We can now refer to this links.

    # Install dependencies @openveo/api and @openveo/test using NPM links
    cd /WORKSPACE_PATH/openveo-devices-api
    npm link @openveo/api
    npm link @openveo/test

## Install project's dependencies

    cd /WORKSPACE_PATH/openveo-devices-api
    npm install

# Install plugin

To be able to install @openveo/devices-api in @openveo/core we create an NPM link of @openveo/devices-api and refer to it in the core.

## Create an NPM link

    # Create a link for @openveo/devices-api
    cd /WORKSPACE_PATH/openveo-devices-api
    npm link

## Link project to the core

    # Install dependency @openveo/devices-api using NPM links
    cd /WORKSPACE_PATH/openveo-core
    npm link @openveo/devices-api
