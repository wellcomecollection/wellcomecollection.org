function withAuthRedirect(ctx, next) {
  const authRedirect = ctx.cookies.get('WC_auth_redirect');
  // TODO: add guards
  // TODO: put on a dedicated URL

  if (authRedirect) {
    const originalPathnameAndSearch = authRedirect.split('?');
    const originalPathname = originalPathnameAndSearch[0];
    const originalSearchParams = new URLSearchParams(
      originalPathnameAndSearch[1]
    );
    const requestSearchParams = new URLSearchParams(ctx.request.search);
    const code = requestSearchParams.get('code');

    originalSearchParams.set('code', code);

    // 1. Remove redirect cookie (set without value)
    ctx.cookies.set('WC_auth_redirect');

    // 2. Do redirect
    ctx.status = 303;
    ctx.redirect(`${originalPathname}?${originalSearchParams.toString()}`);
  } else {
    return next();
  }
}

module.exports = withAuthRedirect;
