const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const withTM = require('next-transpile-modules')(['@weco/common']);
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
});

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

    return withMDX(
      withTM({
        ...defaultConfig,
        assetPrefix:
          isProd && prodSubdomain
            ? `https://${prodSubdomain}.wellcomecollection.org`
            : '',
        publicRuntimeConfig: {
          apmConfig: {
            environment: process.env.APM_ENVIRONMENT,
            serverUrl: process.env.APM_SERVER_URL,
            // we've used inactive so by default it is on, and we can purposefully turn it off locally
            active: process.env.APM_INACTIVE !== 'true',
            centralConfig: true,
          },
        },
        async rewrites() {
          if (phase === PHASE_DEVELOPMENT_SERVER) {
            return [
              {
                source: '/api/users/me',
                destination: `${identityHost}/api/users/me`,
              },
              {
                source: '/api/users/:user_id/item-requests',
                destination: `${identityHost}/api/users/:user_id/item-requests`,
              },
            ];
          }
          return [];
        },
        async redirects() {
          if (phase === PHASE_DEVELOPMENT_SERVER) {
            return [
              {
                source: '/account',
                destination: `${identityHost}`,
                permanent: true,
              },
              {
                source: '/account/logout',
                destination: `${identityHost}/logout`,
                permanent: true,
              },
            ];
          }
          return [];
        },
        webpack: (config, { isServer }) => {
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

          config.module.rules.push({
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          });

          return config;
        },
        eslint: {
          ignoreDuringBuilds: !options.lintBuilds,
        },
      })
    );
  };

module.exports = { createConfig };
