const Prismic = require('@prismicio/client');
const withMemoizedPrismicValue = require('./withMemoizedPrismicValue');

module.exports = withMemoizedPrismicValue({
  name: 'openingTimes',
  getValueFromApi: api => {
    try {
      return api.query([
        Prismic.Predicates.any('document.type', ['collection-venue']),
      ]);
    } catch (e) {
      // TODO: Alert to sentry
    }
  },
  refreshInterval: 60 * 1000,
});
