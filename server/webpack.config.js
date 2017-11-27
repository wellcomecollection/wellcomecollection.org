const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  entry: './app.js',
  output: {
    path: path.join(__dirname, '.dist'),
    filename: 'app.js'
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.DefinePlugin({
      __dirname: '__dirname'
    }),
    new CopyWebpackPlugin([
      { from: './views', to: './views' }
    ])
  ],
  module: {
    // Disable handling of requires with a single expression
    exprContextRegExp: /$^/,
    exprContextCritical: false,
    // Disable handling of requires with expression wrapped by string,
    wrappedContextRegExp: /$^/,
    wrappedContextCritical: false,
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
