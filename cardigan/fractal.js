require('babel-polyfill');
require('babel-register');

// We have to have default here as we aren't in ES6
module.exports = require('./fractal-app').default;
