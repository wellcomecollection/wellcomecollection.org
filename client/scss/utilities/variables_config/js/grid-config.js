const containerPadding = require('../container-padding.json');
const gutterWidth = require('../gutter-width.json');

const gridConfig = {
  s: {
    padding: containerPadding.small,
    gutter: gutterWidth.small,
    columns: 12,
    respond: ['small', 'medium']
  },
  m: {
    padding: containerPadding.medium,
    gutter: gutterWidth.medium,
    columns: 12,
    respond: ['medium', 'large']
  },
  l: {
    padding: containerPadding.large,
    gutter: gutterWidth.large,
    columns: 12,
    respond: 'large'
  },
  xl: {
    padding: containerPadding.xlarge,
    gutter: gutterWidth.xlarge,
    columns: 12,
    respond: 'xlarge'
  }
};

module.exports = gridConfig;
