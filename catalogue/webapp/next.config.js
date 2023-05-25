const { createConfig } = require('@weco/common/next/next.config');

const localConcurrentDevelopment =
  process.env.LOCAL_CONCURRENT_DEV_ENV === 'true';

console.info(
  'local concurrent development environment is set to:',
  localConcurrentDevelopment
);

const rewriteEntries = [
  {
    source: '/works/management/healthcheck',
    destination: `/api/works/management/healthcheck`,
  },
  {
    source: '/works/management/healthcheck',
    destination: `/api/works/management/healthcheck`,
  },
];

module.exports = createConfig({
  applicationName: 'catalogue',
  basePath: localConcurrentDevelopment ? '/catalogue' : '',
  rewriteEntries,
});
