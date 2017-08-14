export default (options = {}) => {
  const cacheControl = options || '';
  const year = 60*60*24*365;

  return function setCacheControl(ctx, next) {
    return next().then(() => {
      cacheControl.forEach((config) => {
        if (config.contentType === ctx.response.type) {
          ctx.response.set('Cache-Control', `max-age=${config.maxAge || year}`);
        }
      });
    });
  };
}
