const { createConfig } = require('@weco/common/next/next.config');

const localConcurrentDevelopment =
  process.env.LOCAL_CONCURRENT_DEV_ENV === 'true';

console.info(
  '(catalogue) local concurrent development environment is set to:',
  localConcurrentDevelopment
);

module.exports = createConfig({
  applicationName: 'catalogue',
  basePath: localConcurrentDevelopment ? '/catalogue' : '',
});
