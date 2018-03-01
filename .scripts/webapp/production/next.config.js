const commonDirRegExp = /@weco(?!.*node_modules)/;
const withTM = require('@weco/next-plugin-transpile-modules');

module.exports = withTM({
  transpileModules: ['@weco'],
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
