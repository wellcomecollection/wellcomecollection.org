const containerPadding = require('./container-padding');
const gutterWidth = require('./gutter-width');

export default const gridConfig = {
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
    respond: ['large', 'xlarge']
  },
  xl: {
    padding: containerPadding.xlarge,
    gutter: gutterWidth.xlarge,
    columns: 12,
    respond: 'xlarge'
  }
};
