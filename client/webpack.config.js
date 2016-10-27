module.exports = {
  entry: './js/app.js',
  output: {
    filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.(njk)$/,
      loader: 'nunjucks-loader'
    }]
  }
};
