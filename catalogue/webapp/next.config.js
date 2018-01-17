const path = require('path');
const nextPagesDir = path.resolve(__dirname, 'node_modules', 'next', 'dist', 'pages');

module.exports = {
  webpack: (config, { buildId, dev }) => {
    config.module.rules.forEach(rule => {
      // recreating this until this is merged:
      // https://github.com/zeit/next.js/commit/d4b1d9babfb4b9ed4f4b12d56d52dee233e862da
      if (rule.exclude) {
        rule.exclude = (str) => {
          // Don't include node_modules within @wellcomecollection
          if (/@wellcomecollection(?!.*node_modules)/.test(str)) {
            return false;
          }
          return /node_modules/.test(str) && str.indexOf(nextPagesDir) !== 0;
        }
      }
    });
    config.resolve.symlinks = false;
    return config;
  }
};
