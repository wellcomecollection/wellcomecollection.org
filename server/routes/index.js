module.exports = function (router, controllers) {
  router.get('/library/:id*', controllers.article);
  router.get('/healthcheck', controllers.healthcheck);

  return router.middleware();
};
