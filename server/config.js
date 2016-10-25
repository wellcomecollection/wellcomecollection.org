const path = require('path');

module.exports = {
  app: {
    name: 'wellcomecollection.org',
    version: '0.0.1'
  },
  views: {
    root: path.resolve(`${__dirname}/views/`)
  },
  server: {
    port: 3000
  },
  static_dir: {
    root: '../dist',
    options: {}
  },
  session: {
    secretKey: 'myKoajsSecretKey'
  }
};
