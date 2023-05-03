const path = require('path');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const apmConfig = require('../services/apm/apmConfig');

const defaultConfigOptions = {
  applicationName: 'test',
  lintBuilds: false, // TODO: fix linting errors
};

const createConfig =
  (options = defaultConfigOptions) =>
  (phase, { defaultConfig }) => {
    /** it would appear that defaultConfig includes some invalid property types, so this will remove them */
    const validDefaultConfig = cleanInvalidValues(defaultConfig);

    const prodSubdomain = process.env.PROD_SUBDOMAIN || '';
    const buildHash = process.env.BUILD_HASH || 'test';
    const isProd = process.env.NODE_ENV === 'production';
    const identityHost = process.env.IDENTITY_HOST || 'http://localhost:3000';
    const shouldAnalyzeBundle = !!process.env.BUNDLE_ANALYZE;

    const rewriteEntries = options.rewriteEntries || [];

    const nextConfig = {
      ...validDefaultConfig,
      // We handle compression in the nginx sidecar
      // Are you having problems with this? Make sure CloudFront is forwarding Accept-Encoding headers to our apps!
      compress: false,
      images: options.images || {},
      basePath: options.basePath || '',
      assetPrefix:
        isProd && prodSubdomain
          ? `https://${prodSubdomain}.wellcomecollection.org`
          : undefined,
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
        ...validDefaultConfig.eslint,
        ignoreDuringBuilds: !options.lintBuilds,
      },
      transpilePackages: ['@weco/common'],
      experimental: {
        ...validDefaultConfig.experimental,
        mdxRs: true,
        outputFileTracingRoot: path.join(__dirname, '../../'),
        forceSwcTransforms: true,
      },
      reactStrictMode: true,
    };
    return nextConfig;
  };

// TODO: check the build output without this function whenever next has an update
/**
 * this will only be necessary until the default config is updated OR the config validator is updated.
 * how I check this? I don't know besides doing it manually
 * https://github.com/cyrilwanner/next-compose-plugins/issues/59
 */
const cleanInvalidValues = defaultConfig => {
  const config = { ...defaultConfig };

  const invalidProperties = [
    'webpackDevMiddleware',
    'configOrigin',
    'target',
    'assetPrefix',
    'i18n',
  ];
  for (let index = 0; index < invalidProperties.length; index++) {
    const property = invalidProperties[index];
    delete config[property];
  }
  delete config.amp.canonicalBase;
  delete config.experimental.outputFileTracingRoot;

  return config;
};

module.exports = { createConfig };
