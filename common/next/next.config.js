const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const path = require('path');
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
    const identityHost = process.env.IDENTITY_HOST || 'http://localhost:3003';
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

      // I was seeing an error in the content app:
      //
      //      Prop `className` did not match.
      //      Server: "sc-eFyCCs fKZyxD spacing-component"
      //      Client: "sc-gHjUZk gufBcP spacing-component"
      //
      // This is coming from somewhere inside styled-components; I found
      // this suggested compiler option on Stack Overflow.  It cleans up
      // the error *and* uses SWC to compile styled-components, which
      // makes the build noticeably faster on my machine.
      compiler: {
        styledComponents: true,
      },

      experimental: {
        ...validDefaultConfig.experimental,
        mdxRs: true,

        // This forces Next to use the SWC compiler, which is significantly faster
        // than Babel.  By default it disables SWC with the error message:
        //
        //      Disabled SWC as replacement for Babel because of custom Babel
        //      configuration "babel.config.js"
        //      https://nextjs.org/docs/messages/swc-disabled
        //
        // but we only have this config file to get our jest tests working; we don't
        // need it to build the apps themselves.
        forceSwcTransforms: true,
      },
      outputFileTracingRoot: path.join(__dirname, '../../'),
      reactStrictMode: true,
      // TODO: Consider enabling standalone output for easier deployment
      // output: 'standalone',
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

  return config;
};

module.exports = { createConfig };
