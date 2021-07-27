const withMemoizedPrismicValue = require('./withMemoizedPrismicValue');

module.exports = withMemoizedPrismicValue({
  name: 'popupDialog',
  getValueFromApi: async api => {
    try {
      const document = await api.getSingle('popup-dialog');
      return document.data;
    } catch (e) {
      // TODO: Alert to sentry
    }
  },
  refreshInterval: 60 * 1000,
});
