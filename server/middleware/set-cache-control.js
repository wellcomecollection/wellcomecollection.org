export default (options = {}) => {
  const cacheControl = options || '';
  const year = 60*60*24*365;

  return function setCacheControl(ctx, next) {
    return next().then(() => {
      const isPreview = /^\/preview\//.test(ctx.request.path);
      const isHtml = ctx.response.type === 'text/html';
      if(isPreview && isHtml) {
        ctx.response.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        ctx.set('Pragma', 'no-cache');
      } else {
        cacheControl.forEach((config) => {
          if (config.contentType === ctx.response.type) {
            ctx.response.set('Cache-Control', `max-age=${config.maxAge || year}`);
          }
        });
      }
    });
  };
}
