'use strict';

// Eslint validation
// For more information about Grunt ESLint, have a look at https://www.npmjs.com/package/grunt-eslint
module.exports = {

  // Validate the whole project
  devicesApi: {
    src: [
      'index.js',
      'conf.js',
      'Gruntfile.js',
      'flightplan.js',
      'tasks/**/*.js',
      'tests/**/*.js',
      'app/**/*.js',
      'migrations/**/*.js'
    ]
  }

};
