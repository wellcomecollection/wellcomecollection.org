const fs = require('fs');
const nodeModules = fs.readdirSync('node_modules')
  .filter(m => m !== '.bin')
  .reduce((acc, val) => {
    acc[val] = `commonjs ${val}`;
    return acc;
  }, {});

module.exports = {
  entry:  ['babel-polyfill', './app'],
  target: 'node',
  devtool: 'sourcemap',
  output: {
    filename: 'app.pack.js'
  },
  externals: nodeModules,
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-3']
      }
    }]
  }
};
