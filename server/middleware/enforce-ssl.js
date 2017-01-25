export function enforceSSL(ctx, next) {
  // TODO: Bump the max-age way higher - this is just for initial testing.
  ctx.response.set('Strict-Transport-Security', 'max-age=60');
  return next();
}
