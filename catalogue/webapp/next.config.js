const webpack = require('webpack');
const withTM = require('@weco/next-plugin-transpile-modules');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const buildHash = process.env.BUILD_HASH || 'test';

const commonDirRegExp = /@weco(?!.*node_modules)/;

const withBundleAnalyzerConfig = withBundleAnalyzer({
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      generateStatsFile: true,
      statsFilename: `../../.dist/server.${buildHash}.json`,
      reportFilename: `../../.dist/server.${buildHash}.html`,
      openAnalyzer: false
    },
    browser: {
      analyzerMode: 'static',
      generateStatsFile: true,
      statsFilename: `../.dist/browser.${buildHash}.json`,
      reportFilename: `../.dist/browser.${buildHash}.html`,
      openAnalyzer: false
    }
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.scss$/,
      include: (str) => {
        return commonDirRegExp.test(str);
      },
      use: ['babel-loader', 'raw-loader', 'postcss-loader', 'sass-loader']
    });
    config.plugins.push(
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.NormalModuleReplacementPlugin(
        /moment-timezone\/data\/packed\/latest\.json/,
        require.resolve('./timezones.json')
      )
    );

    return config;
  }
});

module.exports = withTM({
  transpileModules: ['@weco'],
  ...withBundleAnalyzerConfig
});
