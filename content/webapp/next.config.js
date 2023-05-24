const { createConfig } = require('@weco/common/next/next.config');

const CATALOGUE_URL = 'http://localhost:3001/catalogue';
const localConcurrentDevelopment =
  process.env.LOCAL_CONCURRENT_DEV_ENV === 'true';

const apiRewrites = [
  {
    source: '/content/management/healthcheck',
    destination: `/api/content/management/healthcheck`,
  },
  {
    source: '/newsletter-signup',
    destination: `/api/newsletter-signup`,
  },
  {
    source: '/content/management/healthcheck',
    destination: `/api/content/management/healthcheck`,
  },
];

const periodTypeRoutes = [
  {
    source:
      '/events/:slug(today|this-weekend|current-and-coming-up|past|coming-up|this-week|next-seven-days)',
    destination: `/events`,
  },
  {
    source:
      '/exhibitions/:slug(today|this-weekend|current-and-coming-up|past|coming-up|this-week|next-seven-days)',
    destination: `/exhibitions`,
  },
];

const rewriteEntries = localConcurrentDevelopment
  ? [
      ...apiRewrites,
      ...periodTypeRoutes,
      {
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: '/catalogue/:path*',
        destination: `${CATALOGUE_URL}/:path*`,
      },
      {
        source: '/concepts/:path*',
        destination: `${CATALOGUE_URL}/concepts/:path*`,
      },
      {
        source: '/download',
        destination: `${CATALOGUE_URL}/download`,
      },
      {
        source: '/image',
        destination: `${CATALOGUE_URL}/image`,
      },
      {
        source: '/item',
        destination: `${CATALOGUE_URL}/item`,
      },
      {
        source: '/work',
        destination: `${CATALOGUE_URL}/work`,
      },
      {
        source: '/works/:path*',
        destination: `${CATALOGUE_URL}/works/:path*`,
      },
      {
        source: '/item',
        destination: `${CATALOGUE_URL}/item`,
      },
      {
        source: '/search/:path*',
        destination: `${CATALOGUE_URL}/search/:path*`,
      },
      {
        source: '/api/works',
        destination: `${CATALOGUE_URL}/api/works`,
      },
      {
        source: '/api/works/:path*',
        destination: `${CATALOGUE_URL}/api/works/:path*`,
      },
    ]
  : [...apiRewrites, ...periodTypeRoutes];

module.exports = createConfig({
  applicationName: 'content',
  images: {
    deviceSizes: [600, 880, 960, 1024, 1338],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 180, 282, 320, 420],
  },
  rewriteEntries,
});
