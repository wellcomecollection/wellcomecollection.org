const path = require('path');
module.exports = (storybookBaseConfig, configType) => {
  storybookBaseConfig.module.rules.push({
    test: /\.js$/,
    loaders: ['babel-loader'],
    include: [
      path.resolve(__dirname, '../../common'),
      path.resolve(__dirname, '../../catalogue/webapp'),
      path.resolve(__dirname, '../../content/webapp')
    ],
    exclude: /node_modules/
  });
  return storybookBaseConfig;
};
