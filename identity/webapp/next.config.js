const webpack = require('webpack');
const withTM = require('next-transpile-modules')(['@weco/common']);
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

  const apmConfig = {
    environment: process.env.APM_ENVIRONMENT,
    serverUrl: process.env.APM_SERVER_URL,
    centralConfig: true,
  };

  return withTM({
    assetPrefix:
      isProd && prodSubdomain
        ? `https://${prodSubdomain}.wellcomecollection.org`
        : '',
    publicRuntimeConfig: {
      apmConfig,
    },
    ...withBundleAnalyzerConfig,
  });
};

module.exports = config(webpack);
