import auth0 from '../../../src/utility/auth0';
import queryString from 'queryString';

export default auth0.handleAuth({
  callback: async (req, res) => {
    const { error } = req.query;

    if (error) {
      const query = queryString.stringify(req.query);
      res.redirect(`/account/error?${query}`);
    }

    return auth0.handleCallback(req, res);
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
