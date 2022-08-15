import auth0 from '../../../src/utility/auth0';

export default auth0.handleAuth({
  callback: async (req, res) => {
    const { error } = req.query;

    if (error) {
      const query = new URLSearchParams(req.url);
      res.redirect(`/account/error?${query.toString()}`);
    }

    // We have to `try … catch` here so we don't raise an Internal Server Error
    // when the Auth0 callback fails for explicable reasons, e.g. somebody sending
    // a deliberately malformed token or code.
    //
    // We could include the error message:
    //
    //      .end(error.message)
    //
    // but I haven't because I don't think anybody will encounter this in normal running,
    // and I'm not sure if that message might leak sensitive info.
    try {
      return await auth0.handleCallback(req, res);
    } catch (error) {
      res.status(error.status || 500);
    }
  },
  logout: async (req, res) => {
    // A given returnTo value must be in the client's `allowed_logout_urls`
    // See https://github.com/auth0/nextjs-auth0/issues/532
    const { returnTo } = req.query;
    return auth0.handleLogout(req, res, {
      returnTo: Array.isArray(returnTo) ? returnTo[0] : returnTo,
    });
  },
  profile: async (req, res) => {
    return auth0.handleProfile(req, res, { refetch: 'refetch' in req.query });
  },
});
