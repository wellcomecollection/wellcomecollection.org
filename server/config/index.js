import prodConfig from './prod.json';
const defaultConfig = {
  app: {
    name: 'wellcomecollection.org',
    version: '0.0.1'
  },
  globals: {
    // TODO: ove these bits into prod.json
    development: {
      rootDomain: '',
      beaconErrors: false
    },
    production: {
      rootDomain: 'https://wellcomecollection.org',
      beaconErrors: true
    }
  },
  hashedAssets: {},
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

export default Object.assign({}, defaultConfig, prodConfig);
