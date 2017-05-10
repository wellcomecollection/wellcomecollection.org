require('babel-polyfill');
require('babel-register');

const fractal = require('./fractal-app').default;
const builder = fractal.web.builder();

console.info('Buttoning up Cardigan...');
builder.build().then(function(){
  console.log('Cardigan buttoned up!');
  process.exit(0);
});
