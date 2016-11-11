module.exports = {
  entry: ['babel-polyfill', './js/jsHead.js'],
  output: {
    filename: 'js-head.njk'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};
