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
    const prodSubdomain = process.env.PROD_SUBDOMAIN || '';
    const buildHash = process.env.BUILD_HASH || 'test';
    const isProd = process.env.NODE_ENV === 'production';
    const identityHost = process.env.IDENTITY_HOST || 'http://localhost:3003';
    const shouldAnalyzeBundle = !!process.env.BUNDLE_ANALYZE;

    const rewriteEntries = options.rewriteEntries || [];
    const redirectEntries = options.redirectEntries || [];

    const nextConfig = {
      ...defaultConfig,

      // We handle compression in the nginx sidecar
      // Are you having problems with this? Make sure CloudFront is forwarding Accept-Encoding headers to our apps!
      compress: false,

      images: options.images || {},

      // Only identity sets this, to mount itself at wellcomecollection.org/account
      // instead of its own subdomain.
      basePath: options.basePath || '',

      assetPrefix:
        isProd && prodSubdomain
          ? `https://${prodSubdomain}.wellcomecollection.org${options.basePath || ''}`
          : undefined,

      // This file lives in common/next, so point tracing at the monorepo root -
      // otherwise Next only traces dependencies from inside common/next itself.
      outputFileTracingRoot: path.join(__dirname, '../../'),

      publicRuntimeConfig: {
        apmConfig: apmConfig.client(`${options.applicationName}-webapp`),
      },

      // Only set when an app actually needs one (currently just identity, for
      // session/auth0 config - see identity/webapp/config.js) so apps that don't
      // need one aren't left with an empty serverRuntimeConfig key.
      ...(options.serverRuntimeConfig && {
        serverRuntimeConfig: options.serverRuntimeConfig,
      }),

      async rewrites() {
        // An app that owns its own basePath (eg identity, mounted at /account)
        // doesn't need this dev convenience proxy to itself.
        if (phase === PHASE_DEVELOPMENT_SERVER && !options.basePath) {
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

      // Per-app redirect rules, e.g. identity's /account/search -> /search.
      async redirects() {
        return [...redirectEntries];
      },

      webpack: (config, { isServer, webpack }) => {
        // moment-timezone ships its full historical timezone dataset by default,
        // which is large and mostly unused. Swap in our own trimmed version.
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            /moment-timezone\/data\/packed\/latest\.json/,
            path.join(__dirname, 'timezones.json')
          )
        );

        // Exclude undici from client-side bundles
        // undici is a Node.js-only package and should only be used server-side
        if (!isServer) {
          config.plugins.push(
            new webpack.IgnorePlugin({
              resourceRegExp: /^undici$/,
            })
          );
        }

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
        ...defaultConfig.eslint,
        // Skip eslint during `next build` unless an app opts in via lintBuilds.
        // Repo-wide linting still runs separately via the root `yarn lint`, so
        // this just avoids a slow, redundant second lint pass inside the build.
        ignoreDuringBuilds: !options.lintBuilds,
      },

      // common's source is untranspiled TS/JSX; each app needs Next to compile
      // it as part of its own build rather than treating it as pre-built.
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
      //
      // Still required as of Next 15 / styled-components 6: without it,
      // styled-components' class-name hashing can differ between the server
      // and client bundles, causing hydration mismatches. Only takes effect
      // because SWC is forced on below (forceSwcTransforms) - if that ever
      // gets removed, this option is silently ignored and Babel takes over.
      compiler: {
        styledComponents: true,
      },

      // Pages Router only: makes sure server-only dependencies used inside API
      // routes/getServerSideProps get traced into the production output, not
      // just the ones imported by pages themselves.
      bundlePagesRouterDependencies: true,

      experimental: {
        ...defaultConfig.experimental,

        // This forces Next to use the SWC compiler, which is significantly faster
        // than Babel.  By default it disables SWC with the error message:
        //
        //      Disabled SWC as replacement for Babel because of custom Babel
        //      configuration "babel.config.js"
        //      https://nextjs.org/docs/messages/swc-disabled
        //
        // but we only have this config file to get our jest tests working; we don't
        // need it to build the apps themselves.
        //
        // Confirmed still true as of Next 15.5: removing this brings back the
        // exact "Disabled SWC..." warning above, and silently disables the
        // compiler.styledComponents option too, since that also requires SWC.
        forceSwcTransforms: true,
      },

      // Surfaces unsafe side effects (double-invokes effects, etc) in dev only -
      // no behaviour change in production builds.
      reactStrictMode: true,
    };
    return nextConfig;
  };

module.exports = { createConfig };
