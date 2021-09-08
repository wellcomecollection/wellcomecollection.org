const path = require('path');
const withTM = require('next-transpile-modules')(['@weco']);
const withBundleAnalyzer = require('@next/bundle-analyzer');
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
});
const buildHash = process.env.BUILD_HASH || 'test';
const isProd = process.env.NODE_ENV === 'production';

module.exports = function (webpack) {
  const prodSubdomain = process.env.PROD_SUBDOMAIN || '';
  const withBundleAnalyzerConfig = withBundleAnalyzer({
    analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: 'static',
        generateStatsFile: true,
        statsFilename: `../../.dist/server.${buildHash}.json`,
        reportFilename: `../../.dist/server.${buildHash}.html`,
        openAnalyzer: false,
      },
      browser: {
        analyzerMode: 'static',
        generateStatsFile: true,
        statsFilename: `../.dist/browser.${buildHash}.json`,
        reportFilename: `../.dist/browser.${buildHash}.html`,
        openAnalyzer: false,
      },
    },
    webpack(config, options) {
      config.plugins.push(
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.NormalModuleReplacementPlugin(
          /moment-timezone\/data\/packed\/latest\.json/,
          path.join(__dirname, 'timezones.json')
        )
      );

      config.module.rules.push({
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      });

      return config;
    },
  });

  console.info(process.env.APM_DISABLED !== 'true');
  const apmConfig = {
    environment: process.env.APM_ENVIRONMENT,
    serverUrl: process.env.APM_SERVER_URL,
    // we've used inactive so by default it is on, and we can purposefully turn it off locally
    active: process.env.APM_INACTIVE !== 'true',
    centralConfig: true,
  };

  const rewrites =
    process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/users/me',
            destination: 'http://localhost:3000/api/users/me',
          },
          {
            source: '/api/users/:user_id/item-requests',
            destination:
              'http://localhost:3000/api/users/:user_id/item-requests',
          },
        ]
      : [];

  const redirects =
    process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/account',
            destination: 'http://localhost:3000',
            permanent: true,
          },
          {
            source: '/account/logout',
            destination: 'http://localhost:3000/logout',
            permanent: true,
          },
        ]
      : [];

  return withMDX(
    withTM({
      assetPrefix:
        isProd && prodSubdomain
          ? `https://${prodSubdomain}.wellcomecollection.org`
          : '',
      publicRuntimeConfig: {
        apmConfig,
      },
      ...withBundleAnalyzerConfig,
      async rewrites() {
        return rewrites;
      },
      async redirects() {
        return redirects;
      },
    })
  );
};
