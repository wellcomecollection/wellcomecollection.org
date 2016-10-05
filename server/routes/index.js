module.exports = function (router, controllers) {
    router.get('/patterns', controllers.patterns);
    return router.middleware();
};
