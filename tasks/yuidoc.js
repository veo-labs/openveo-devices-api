'use strict';

// Generate yuidoc
// For more information about Grunt yuidoc, have a look at https://www.npmjs.com/package/grunt-contrib-yuidoc
module.exports = {

  // Plugin's API
  devicesApi: {
    name: 'OpenVeo Devices API',
    description: 'Node.js API exposed by OpenVeo Devices API Plugin',
    version: '<%= pkg.version %>',
    options: {
      paths: 'app/server',
      outdir: './site/version/api',
      linkNatives: true,
      themedir: 'node_modules/yuidoc-theme-blue'
    }
  }

};
