// We have to use the webpack `include` config over the `.babelrc` as we
// include files from external directories. The `babel.config.js` would solve
// this but isn't supported in storybook yet
const path = require('path');
module.exports = (storybookBaseConfig, configType) => {
  storybookBaseConfig.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    include: [
      path.resolve(__dirname, '../../common'),
      path.resolve(__dirname, '../stories'),
      path.resolve(__dirname, '../../catalogue/webapp')
    ],
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-flow',
          '@babel/preset-react'
        ],
        plugins: [
          'babel-plugin-react-require',
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-syntax-dynamic-import'
        ]
      }
    }
  });

  storybookBaseConfig.module.rules.push({
    test: /\.scss$/,
    include: [
      path.resolve(__dirname, '../../common/styles')
    ],
    use: [{
      loader: 'css-loader',
      options: {
        minimize: true
      }
    }, {
      loader: 'postcss-loader',
      options: {
        config: {
          path: path.resolve(__dirname, '../')
        }
      }
    }, 'sass-loader']
  });

  return storybookBaseConfig;
};
