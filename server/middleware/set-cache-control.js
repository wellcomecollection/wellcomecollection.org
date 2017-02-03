export default (options) => {
  options = options || {};

  const files = options.files;
  const maxAge = options.maxAge || 31536000 // 60*60*24*365, i.e. 1 year

  return function setCacheControl(ctx, next) {
    return next().then(() => {
      if (files.indexOf(ctx.response.type) > -1) {
        ctx.response.set('Cache-Control', `max-age=${maxAge}`); 
      }
    });
  };
}
// TODO use file hash as eTag
