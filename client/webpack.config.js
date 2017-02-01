const webpack = require('webpack');
const minimise = process.argv.indexOf('--dev') === -1;

module.exports = {
  entry: './js/app.js',
  output: {
    filename: 'app.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  plugins: minimise ? [
    new webpack.optimize.UglifyJsPlugin()
  ] : []
};
