export function enforceSSL() {
  return (ctx, next) => {
    // This is the minimum required age as per Chrome's preload list:
    // see: https://hstspreload.org
    const maxAge = 10886400;
    ctx.response.set('Strict-Transport-Security', `max-age=${maxAge}`);

    return next();
  };
}
