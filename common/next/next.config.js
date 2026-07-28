const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const apmConfig = require('../services/apm/apmConfig');

const createConfig =
  (options = {}) =>
  (phase, { defaultConfig }) => {
    if (!options.applicationName) {
      throw new Error(
        'createConfig requires an applicationName option, e.g. createConfig({ applicationName: "content", ... })'
      );
    }

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

      // Every URL in this app gets this prefix added in front, e.g. '/account'
      // means a page at /search is actually served at /account/search. Only
      // identity sets this, so it can live at wellcomecollection.org/account
      // instead of getting its own subdomain the way content does.
      basePath: options.basePath || '',

      assetPrefix:
        isProd && prodSubdomain
          ? `https://${prodSubdomain}.wellcomecollection.org${options.basePath || ''}`
          : undefined,

      // Next needs to know which files a build actually depends on, so it
      // doesn't bundle more of the repo than necessary. This config file lives
      // in common/next rather than in the app's own folder, so without this,
      // Next would assume the app only needs files from inside common/next and
      // miss everything else in the monorepo. Pointing this at the repo root
      // fixes that.
      outputFileTracingRoot: path.join(__dirname, '../../'),

      publicRuntimeConfig: {
        apmConfig: apmConfig.client(`${options.applicationName}-webapp`),
      },

      // serverRuntimeConfig lets an app pass its own env-derived config (e.g.
      // secrets, API hosts) into next.config.js once, then read it back
      // anywhere in its server-side code via next/config's getConfig(). Only
      // identity currently needs this (for session/auth0 config - see
      // identity/webapp/config.js), so we only add the key when an app
      // actually supplies one, rather than giving every app an empty one.
      ...(options.serverRuntimeConfig && {
        serverRuntimeConfig: options.serverRuntimeConfig,
      }),

      async rewrites() {
        // A "rewrite" serves a different URL's content without changing what
        // the browser shows in the address bar. This one is a local dev
        // convenience: it forwards any /account/* request to wherever the
        // identity app is running, so you can hit /account URLs while running
        // another app locally. An app that already owns its own basePath (eg
        // identity, mounted at /account) doesn't need this - it's already
        // serving those URLs itself.
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

      // Per-app redirect rules (a redirect sends the browser to a genuinely
      // different URL, unlike the rewrites above). E.g. identity redirects
      // /account/search to /search.
      async redirects() {
        return [...redirectEntries];
      },

      webpack: (config, { isServer, webpack }) => {
        // moment-timezone ships its full historical timezone dataset by
        // default, which is large and mostly unused. Swap in our own trimmed
        // version instead, to keep the app's bundle size down.
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
        // Don't run eslint as part of `next build` - it wouldn't do anything
        // useful anyway: this repo's eslint setup uses a newer config format
        // ("flat config", in the root eslint.config.js) that Next's built-in
        // build-time linter doesn't know how to read, so turning this on
        // would just run a check that silently finds nothing. Linting is
        // instead enforced by a git pre-commit hook (see docs/git-hooks.md)
        // that lints whatever files you're committing, or can be run across
        // the whole repo manually with the root `yarn lint` command.
        ignoreDuringBuilds: true,
      },

      // common's code is plain TS/JSX, not pre-compiled. Without this, each
      // app's build would treat common as an ordinary installed package and
      // skip compiling it, which would break.
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
      // Still required as of Next 15 / styled-components 6: styled-components
      // generates each component's CSS class name at build time, and without
      // this option that generation can come out slightly different for the
      // server-rendered HTML vs. the version React re-generates in the
      // browser. React then complains they don't match ("hydration
      // mismatch") and re-renders that part of the page from scratch. This
      // only works because SWC (Next's fast Rust-based compiler) is forced on
      // below - if forceSwcTransforms is ever removed, this option silently
      // stops doing anything and Babel takes over instead.
      compiler: {
        styledComponents: true,
      },

      // Pages Router only (this repo doesn't use the newer App Router). Code
      // that only runs on the server - inside pages/api routes or
      // getServerSideProps - can use server-only npm packages that the
      // browser bundle never needs. Without this option, Next can fail to
      // notice those packages belong in the deployed output at all, since it
      // normally only looks at what pages import directly.
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
        // compiler.styledComponents option above too, since that also
        // requires SWC to be active.
        forceSwcTransforms: true,
      },

      // In development only, this makes React deliberately run certain code
      // twice (e.g. component functions and effects) to help surface bugs
      // where code accidentally relies on running exactly once, or has a side
      // effect it shouldn't. It has no effect on production builds - real
      // users never see the double-run.
      reactStrictMode: true,
    };
    return nextConfig;
  };

module.exports = { createConfig };
