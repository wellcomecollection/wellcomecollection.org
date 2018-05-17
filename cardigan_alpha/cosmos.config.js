const path = require('path');
module.exports = {
  webpack: (config, { env }) => {
    config.module.rules.push({
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: path.resolve(__dirname, '../common'),
      exclude: /node_modules/
    });
    return config;
  },
  globalImports: ['../dist/assets/css/styleguide.css']
};
