const path = require('path');
const withTM = require('@weco/next-plugin-transpile-modules');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const buildHash = process.env.BUILD_HASH || 'test';

module.exports = function(webpack, assetPrefix) {
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
    webpack(config, options) {
      config.module.rules.push({
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.join(__dirname, '../styles')],
            },
          },
        ],
      });
      config.plugins.push(
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.NormalModuleReplacementPlugin(
          /moment-timezone\/data\/packed\/latest\.json/,
          path.join(__dirname, 'timezones.json')
        )
      );

      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader',
      });

      return config;
    },
  });

  const isProd = process.env.NODE_ENV === 'production';
  return withTM({
    assetPrefix: isProd ? `https://${assetPrefix}.wellcomecollection.org` : '',
    transpileModules: ['@weco'],
    ...withBundleAnalyzerConfig,
  });
};
