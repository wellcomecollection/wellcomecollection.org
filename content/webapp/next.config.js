const { createConfig } = require('@weco/common/next/next.config');

const rewriteEntries = [
  {
    source: '/content/management/healthcheck',
    destination: `/api/content/management/healthcheck`,
  },
  {
    source: '/newsletter-signup',
    destination: `/api/newsletter-signup`,
  },
];

module.exports = createConfig({
  applicationName: 'content',
  images: {
    deviceSizes: [600, 880, 960, 1024, 1338],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 180, 282, 320, 420],
  },
  rewriteEntries,
});
