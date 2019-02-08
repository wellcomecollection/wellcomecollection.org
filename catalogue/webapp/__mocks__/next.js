module.exports = () => ({
  prepare: () => Promise.resolve(),
  getRequestHandler: () => (req, res) => Promise.resolve(),
  render: (ctx, next) => {
    ctx.status = 200;
    ctx.body = 'ok';
    return next();
  },
});
