module.exports = {
  app: {
    name: 'wellcomecollection.org',
    version: '0.0.1'
  },
  server: {
    port: 3000
  },
  views: {
    path: 'views'
  },
  static_dir: {
    root: '../dist',
    options: {}
  },
  session: {
    secretKey: 'myKoajsSecretKey'
  }
};
