const containerPadding = require('./container-padding');
const gutterWidth = require('./gutter-width');

const gridConfig = {
  s: {
    padding: containerPadding.small,
    gutter: gutterWidth.small,
    columns: 12,
    primaryStart: 1,
    primaryEnd: 12,
    secondaryStart: 1,
    secondaryEnd: 12,
    respond: ['small', 'medium']
  },
  m: {
    padding: containerPadding.medium,
    gutter: gutterWidth.medium,
    columns: 12,
    primaryStart: 2,
    primaryEnd: 11,
    secondaryStart: 2,
    secondaryEnd: 11,
    respond: ['medium', 'large']
  },
  l: {
    padding: containerPadding.large,
    gutter: gutterWidth.large,
    columns: 12,
    primaryStart: 1,
    primaryEnd: 7,
    secondaryStart: 8,
    secondaryEnd: 12,
    respond: ['large', 'xlarge']
  },
  xl: {
    padding: containerPadding.xlarge,
    gutter: gutterWidth.xlarge,
    columns: 12,
    primaryStart: 1,
    primaryEnd: 7,
    secondaryStart: 8,
    secondaryEnd: 12,
    respond: 'xlarge'
  }
};

module.exports = gridConfig;
