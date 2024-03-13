module.exports = {
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/' },
      '/404': { page: '/404' },
      '/pa11y/index': { page: '/pa11y' },
      '/prismic-linting/index': { page: '/prismic-linting' },
      '/toggles/index': { page: '/toggles' },
    };
  },
};
