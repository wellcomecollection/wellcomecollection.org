const { createConfig } = require('@weco/common/next/next.config');

const CATALOGUE_URL = 'http://localhost:3001/catalogue';
const localConcurrentDevelopment =
  process.env.LOCAL_CONCURRENT_DEV_ENV === 'true';

const apiRewrites = [
  {
    // Terraform (and our ALBs) expect this endpoint at the service root.
    source: '/management/healthcheck',
    destination: `/api/content/management/healthcheck`,
  },
  {
    source: '/content/management/healthcheck',
    destination: `/api/content/management/healthcheck`,
  },
  {
    source: '/newsletter-signup',
    destination: `/api/newsletter-signup`,
  },
  {
    source: '/rss',
    destination: `/api/rss`,
  },
  {
    source: '/preview',
    destination: `/api/preview`,
  },
];

const rewriteEntries = localConcurrentDevelopment
  ? [
      ...apiRewrites,
      {
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: '/download',
        destination: `${CATALOGUE_URL}/download`,
      },
      {
        source: '/image',
        destination: `${CATALOGUE_URL}/image`,
      },
    ]
  : [...apiRewrites];

module.exports = createConfig({
  applicationName: 'content',
  images: {
    deviceSizes: [600, 880, 960, 1024, 1338],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 180, 282, 320, 420],
  },
  rewriteEntries,
});
