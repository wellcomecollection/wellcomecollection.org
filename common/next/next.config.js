const path = require('path');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const withTM = require('next-transpile-modules')([
  '@weco/common',
  '@weco/identity',
  '@weco/content',
  '@weco/catalogue',
]);
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
});

const createConfig =
  () =>
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
        webpack: (config, { isServer, webpack }) => {
          const bundleAnalysisFile = `../../.dist/${
            isServer ? 'server' : 'client'
          }.${buildHash}`;

          config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(
              /moment-timezone\/data\/packed\/latest\.json/,
              path.join(__dirname, 'timezones.json')
            )
          );

          if (shouldAnalyzeBundle) {
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
      })
    );
  };

module.exports = { createConfig };
