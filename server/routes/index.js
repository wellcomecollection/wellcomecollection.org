module.exports = function (router, controllers) {
  router.get('/healthcheck', controllers.healthcheck);
  router.get('/favicon.ico', controllers.favicon);
  router.get('/:id*', controllers.article);

  return router.middleware();
};
