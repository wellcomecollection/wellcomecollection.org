const webpack = require('webpack');
const withTM = require('next-transpile-modules')(['@weco/common']);
const apmConfig = require('@weco/common/services/apm/apmConfig');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const buildHash = process.env.BUILD_HASH || 'test';
const isProd = process.env.NODE_ENV === 'production';

const config = function (webpack) {
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
  });

  return withTM({
    basePath: '/account',
    assetPrefix:
      isProd && prodSubdomain
        ? `https://${prodSubdomain}.wellcomecollection.org`
        : '',
    publicRuntimeConfig: { apmConfig: apmConfig.client('identity-webapp') },
    ...withBundleAnalyzerConfig,
  });
};

module.exports = config(webpack);
