module.exports = {
  app: {
    name: 'wellcomecollection.org',
    version: '0.0.1'
  },
  server: {
    port: 3000
  },
  template: {
    path: 'views',
    options: {
      extension: 'njk',
      map: {njk: 'nunjucks'}
    }
  },
  static_dir: {
    root: '../dist',
    options: {}
  },
  session: {
    secretKey: 'myKoajsSecretKey'
  }
};
