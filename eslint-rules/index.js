const requireDataComponent = require('./require-data-component');

module.exports = {
  rules: {
    'require-data-component': requireDataComponent,
  },
  configs: {
    recommended: {
      plugins: ['weco-components'],
      rules: {
        'weco-components/require-data-component': 'error',
      },
    },
  },
};
