export function enforceSSL() {
  return (ctx, next) => {
    const host = ctx.request.host;
    if (host.indexOf('https:') !== 0) {
      ctx.response.status = 301;
      ctx.response.redirect(host.replace('http:', 'https:'));
    }

    // This is the minimum required age as per Chrome's preload list:
    // see: https://hstspreload.org
    const maxAge = 10886400;
    ctx.response.set('Strict-Transport-Security', `max-age=${maxAge}`);

    return next();
  };
}
