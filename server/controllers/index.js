module.exports = {
    patterns: {
        index: (ctx) => ctx.render('patterns/index', {}),
        typography: (ctx) => ctx.render('patterns/typography', {}),
        grids: (ctx) => ctx.render('patterns/grids', {}),
        palette: (ctx) => ctx.render('patterns/palette', {})
    },
    healthcheck: (ctx) => ctx.body = 'ok'
};
