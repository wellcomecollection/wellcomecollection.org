// We build and deploy from Circle
// This let's us serve from https://dash.wc.org/toggles
const isTest = process.env.NODE_ENV === 'test';
module.exports = {
  // You may only need to add assetPrefix in the production.
  assetPrefix: isTest ? '/' : ''
};
