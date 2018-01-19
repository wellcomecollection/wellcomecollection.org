const path = require('path');
const nextPagesDir = path.resolve(__dirname, 'node_modules', 'next', 'dist', 'pages');
const commonDir = path.resolve(__dirname, 'node_modules', '@wellcomecollection', 'common');
const commonDirRegExp = /@wellcomecollection(?!.*node_modules)/;

module.exports = {
  webpack: (config, { buildId, dev }) => {
    config.module.rules.forEach(rule => {
      // We can't just add this as another loader as we need to use the options
      // set withing `next.js/server/build/webpack.js`
      if (rule.loader === 'emit-file-loader') {
        rule.include.push(commonDir);
        rule.exclude = (str) => {
          if (commonDirRegExp.test(str)) {
            return false;
          }
          return /node_modules/.test(str) && str.indexOf(nextPagesDir) !== 0;
        }
      }
    });

    config.resolve.symlinks = false;
    config.module.rules.push({
      test: /\.js/,
      loader: 'babel-loader',
      include: (str) => {
        return commonDirRegExp.test(str);
      }
    }, {
      test: /\.scss/,
      loader: 'emit-file-loader',
      include: (str) => {
        return commonDirRegExp.test(str);
      },
      options: {
        name: 'dist/[path][name].[ext]'
      }
    }, {
      test: /\.scss$/,
      include: (str) => {
        return commonDirRegExp.test(str);
      },
      use: ['babel-loader', 'raw-loader', 'postcss-loader', 'sass-loader']
    });

    return config;
  }
};
