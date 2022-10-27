module.exports = {
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/' },
      '/404': { page: '/404' },
      '/pa11y/index': { page: '/pa11y' },
      '/toggles/index': { page: '/toggles' },
    };
  },
};
