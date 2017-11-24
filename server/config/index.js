import path from 'path';
import overrides from './overrides.json';  // This allows you to inject JSON config into the app
const defaultConfig = {
  app: {
    name: 'wellcomecollection.org',
    version: '0.0.1'
  },
  globals: {
    development: {
      rootDomain: '',
      beaconErrors: false
    },
    production: {
      rootDomain: 'https://wellcomecollection.org',
      beaconErrors: true
    }
  },
  fileRoot: '',
  hashedFiles: {},
  server: {
    port: 3000
  },
  views: {
    paths: [
      path.join(__dirname, '../views'),
      path.join(__dirname, './views')
    ]
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

export default Object.assign({}, defaultConfig, overrides);
