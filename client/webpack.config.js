var path = require('path');

module.exports = {
  entry: './js/app.js',
  devtool: 'source-map',
  resolve: {
    root: [
      __dirname,
      path.resolve(`${__dirname}/../common/views`)
    ],
    alias: {
      views: path.resolve('../dist/views')
    },
    extensions: ['', '.js', '.njk']
  },
  resolveLoader: {
    // This is here as we're loading stuff from the `../common` directory.
    modulesDirectories: [path.resolve('./node_modules')],
    alias: {
      'nnunjucks-loader': path.resolve(`${__dirname}/nunjucks-loader`)
    }
  },
  output: {
    filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
      test: /\.njk$/,
      loader: 'nunjucks-loader',
      query: {
        root: path.resolve(`${__dirname}/../common/views`),
        config: path.resolve(`${__dirname}/nunjucks.config.js`)
      }
    }]
  },
  // TODO: Not sure why this isn't working on the query key of the loader
  'nunjucks-loader': {
    path: [path.resolve('../common/views')],
  },
};
