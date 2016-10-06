module.exports = function (router, controllers) {
    router.get('/patterns', controllers.patterns.index);
    router.get('/patterns/typography', controllers.patterns.typography);
    router.get('/patterns/grids', controllers.patterns.grids);
    router.get('/patterns/palette', controllers.patterns.palette);

    router.get('/healthcheck', controllers.healthcheck);

    return router.middleware();
};
