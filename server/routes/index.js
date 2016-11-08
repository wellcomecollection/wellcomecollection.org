module.exports = function (router, controllers) {
  router.get('/healthcheck', controllers.healthcheck);
  router.get('/:id*', controllers.article);

  return router.middleware();
};
