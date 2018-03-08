const commonDirRegExp = /@weco(?!.*node_modules)/;
const withTM = require('@weco/next-plugin-transpile-modules');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

const withBundleAnalyzerConfig = withBundleAnalyzer({
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  webpack(config, options) {
    config.module.rules.push({
      test: /\.scss$/,
      include: (str) => {
        return commonDirRegExp.test(str);
      },
      use: ['babel-loader', 'raw-loader', 'postcss-loader', 'sass-loader']
    });

    return config;
  }
});

module.exports = withTM({
  transpileModules: ['@weco'],
  ...withBundleAnalyzerConfig
});
