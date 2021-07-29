const withMemoizedPrismicValue = require('./withMemoizedPrismicValue');

module.exports = withMemoizedPrismicValue({
  name: 'globalAlert',
  getValueFromApi: async api => {
    try {
      const document = await api.getSingle('global-alert');
      return document.data;
    } catch (e) {
      // TODO: Alert to sentry
    }
  },
  refreshInterval: 60 * 1000,
});
