const apmConfig = require('@weco/common/services/apm/apmConfig');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const { getConfig } = require('./config');
const buildHash = process.env.BUILD_HASH || 'test';
const isProd = process.env.NODE_ENV === 'production';

const config = function () {
  const prodSubdomain = process.env.PROD_SUBDOMAIN || '';
  const basePath = '/account';

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

  return {
    // We handle compression in the nginx sidecar
    // Are you having problems with this? Make sure CloudFront is forwarding Accept-Encoding headers to our apps!
    compress: false,
    assetPrefix:
      isProd && prodSubdomain
        ? `https://${prodSubdomain}.wellcomecollection.org${basePath}`
        : '',
    basePath,
    publicRuntimeConfig: { apmConfig: apmConfig.client('identity-webapp') },
    serverRuntimeConfig: getConfig(),
    transpilePackages: ['@weco/common'],
    ...withBundleAnalyzerConfig,
  };
};

module.exports = config();
