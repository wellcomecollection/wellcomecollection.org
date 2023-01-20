const path = require('path');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const withTM = require('next-transpile-modules')(['@weco/common']);
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
});
const apmConfig = require('../services/apm/apmConfig');

const defaultConfigOptions = {
  applicationName: 'test',
  lintBuilds: false, // TODO: fix linting errors
};

const createConfig =
  (options = defaultConfigOptions) =>
  (phase, { defaultConfig }) => {
    const prodSubdomain = process.env.PROD_SUBDOMAIN || '';
    const buildHash = process.env.BUILD_HASH || 'test';
    const isProd = process.env.NODE_ENV === 'production';
    const identityHost = process.env.IDENTITY_HOST || 'http://localhost:3000';
    const shouldAnalyzeBundle = !!process.env.BUNDLE_ANALYZE;

    const rewriteEntries = options.rewriteEntries || [];

    return withMDX(
      withTM({
        ...defaultConfig,
        // We handle compression in the nginx sidecar
        // Are you having problems with this? Make sure CloudFront is forwarding Accept-Encoding headers to our apps!
        compress: false,
        images: options.images || {},
        basePath: options.basePath || '',
        assetPrefix:
          isProd && prodSubdomain
            ? `https://${prodSubdomain}.wellcomecollection.org`
            : '',
        publicRuntimeConfig: {
          apmConfig: apmConfig.client(`${options.applicationName}-webapp`),
        },
        async rewrites() {
          if (phase === PHASE_DEVELOPMENT_SERVER) {
            return [
              {
                source: '/account/:path*',
                destination: `${identityHost}/account/:path*`,
              },
              ...rewriteEntries,
            ];
          }
          return [...rewriteEntries];
        },
        webpack: (config, { isServer, webpack }) => {
          config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(
              /moment-timezone\/data\/packed\/latest\.json/,
              path.join(__dirname, 'timezones.json')
            )
          );

          if (shouldAnalyzeBundle) {
            // This path is relative to the .next directory
            const bundleEnvironment = isServer ? 'server' : 'client';
            const bundleAnalysisFile = `../.dist/${options.applicationName}.${bundleEnvironment}.${buildHash}`;

            config.plugins.push(
              new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                generateStatsFile: true,
                openAnalyzer: false,
                statsFilename: `${bundleAnalysisFile}.json`,
                reportFilename: `${bundleAnalysisFile}.html`,
              })
            );
          }

          return config;
        },
        eslint: {
          ignoreDuringBuilds: !options.lintBuilds,
        },
      })
    );
  };

module.exports = { createConfig };
