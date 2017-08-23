const config = {
  app: {
    name: 'wellcomecollection.org',
    version: '0.0.1'
  },
  globals: {
    development: {
      rootDomain: '',
      nextDomain: ''
    },
    production: {
      rootDomain: 'https://wellcomecollection.org',
      nextDomain: 'https://next.wellcomecollection.org'
    }
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
  cacheControl: [{
    contentType: 'text/css'
  },
  {
    contentType: 'application/javascript'
  },
  {
    contentType: 'application/font-woff'
  },
  {
    contentType: 'application/font-woff2'
  },
  {
    contentType: 'text/html',
    maxAge: 1800
  }]
};

export default config;
