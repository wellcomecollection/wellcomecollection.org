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
    files: ['text/css','application/javascript', 'application/font-woff', 'application/font-woff2']
  },
  compress: {
    filter: (content_type) => {
      const typesToCompress = ['text/html','text/css','application/javascript'];
      if (typesToCompress.indexOf(content_type) > -1) {
        return true;
      }
    }
  }
};

export default config;
