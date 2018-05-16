const path = require('path');
module.exports = (storybookBaseConfig, configType) => {
  storybookBaseConfig.module.rules.push({
    test: /\.js$/,
    loaders: ['babel-loader'],
    include: path.resolve(__dirname, '../../common'),
    exclude: /node_modules/
  });
  return storybookBaseConfig;
};
