import { AccessTokenError } from '@auth0/nextjs-auth0/errors';
import { NextApiRequest, NextApiResponse } from 'next';

import auth0, { auth0Domain } from '@weco/identity/utils/auth0';

// Replaces the profile endpoint the v3 SDK served at this URL: the v4
// equivalent responds 401 rather than 204 when there is no session, and has
// no refetch option. The UserContextProvider in the common package, used
// across all the webapps, relies on both.
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const session = await auth0.getSession(req);
  if (!session) {
    res.status(204).end();
    return;
  }

  if ('refetch' in req.query) {
    // As v3's handleProfile({ refetch: true }): fetch a fresh user profile
    // from Auth0 and save it to the session. Used after operations that
    // change the profile, eg updating an email address.
    try {
      const { token } = await auth0.getAccessToken(req, res, {
        refresh: true,
      });
      const profileResponse = await fetch(`https://${auth0Domain}/userinfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!profileResponse.ok) {
        console.error(
          `Failed fetching the user profile from Auth0: ${profileResponse.status}`
        );
        res.status(500).end();
        return;
      }
      const profile = await profileResponse.json();
      const user = { ...session.user, ...profile };
      await auth0.updateSession(req, res, { ...session, user });
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof AccessTokenError) {
        res.status(401).end();
        return;
      }
      throw error;
    }
    return;
  }

  res.status(200).json(session.user);
};

export default handler;
