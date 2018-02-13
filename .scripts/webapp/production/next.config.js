const commonDirRegExp = /@weco(?!.*node_modules)/;

module.exports = {
  webpack: (config, { buildId, dev, defaultLoaders }) => {
    config.resolve.symlinks = false;
    config.externals = config.externals.map(external => {
      if (typeof external !== 'function') return external;
      return (ctx, req, cb) => {
        return (/@weco/.test(req) ? cb() : external(ctx, req, cb));
      };
    });
    config.module.rules.push({
      test: /\.js/,
      include: (str) => str.match(commonDirRegExp),
      use: defaultLoaders.babel
    }, {
      test: /\.scss$/,
      include: (str) => {
        return commonDirRegExp.test(str);
      },
      use: ['babel-loader', 'raw-loader', 'postcss-loader', 'sass-loader']
    });

    return config;
  },
  webpackDevMiddleware: config => {
    // The standard config is [/(^|[\/\\])\../, /node_modules/]
    const ignored = [
      config.watchOptions.ignored[0],
      /node_modules(?!\/@weco(?!.*node_modules))/
    ];
    config.watchOptions.ignored = ignored;
    return config;
  }
};
