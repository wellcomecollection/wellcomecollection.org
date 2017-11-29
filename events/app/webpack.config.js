const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const sass = require('node-sass');

// Seems easier than setting up the webpack plugin
const css = sass.renderSync({
  file: '../../client/scss/critical.scss',
  includePaths: ['../../client/scss/'],
  outputStyle: 'compressed'
});
mkdirp.sync('./views/partials');
fs.writeFile('./views/partials/critical.css.njk', css.css.toString(), function(err) {
  if (err) throw err;
  console.log('Sass to CSS wrangled!');
});


module.exports = {
  target: 'node',
  entry: './app.js',
  output: {
    path: path.join(__dirname, '.dist'),
    filename: 'app.js'
  },
  plugins: [
    new webpack.DefinePlugin({'global.GENTLY': false }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.DefinePlugin({
      __dirname: '__dirname',
    }),
    new CopyWebpackPlugin([
      { from: './views', to: './views' },
      { from: '../../server/views', to: './views' },
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
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
