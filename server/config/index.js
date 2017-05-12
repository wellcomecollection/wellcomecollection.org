const config = {
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
  static: {
    path: '../dist'
  },
  favicon: {
    path: '../dist/assets/icons'
  },
  session: {
    secretKey: 'myKoajsSecretKey'
  },
  cacheControl: {
    files: ['text/css', 'application/javascript', 'application/font-woff', 'application/font-woff2']
  }
};

export default config;
