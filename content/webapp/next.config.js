const { createConfig } = require('@weco/common/next/next.config');

module.exports = createConfig({
  applicationName: 'content',
  images: {
    loader: 'imgix',
    path: 'https://images.prismic.io',
    deviceSizes: [600, 880, 960, 1024, 1338],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 180, 282, 320, 420],
  },
});
