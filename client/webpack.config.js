var path = require('path');

module.exports = {
  entry: './js/app.js',
  resolve: {
    alias: {
      views: path.resolve('../server/views')
    },
    extensions: ['', '.js', '.njk']
  },
  resolveLoader: {
    // This is here as we're loading stuff from the `../server` directory.
    modulesDirectories: [path.resolve('./node_modules')],
  },
  output: {
    filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.(njk|nunjucks)$/,
      loader: 'nunjucks-loader',
      query: {
        config: 'nunjucks.config.js'
        // quiet: true
      }
    }]
  }
};
