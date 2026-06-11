import { NextApiRequest, NextApiResponse } from 'next';

import { identityBasePath } from '@weco/identity/utils/auth0';

// This will redirect the user directly to the sign-up page: the SDK's login
// handler forwards arbitrary authorization params from the query string.
//
// See
// https://community.auth0.com/t/how-do-i-redirect-users-directly-to-the-hosted-signup-page/42520
export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // Forward any query params (eg returnTo) to the login handler, as the v3
  // signup handler did, but always force the signup screen.
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    for (const v of Array.isArray(value) ? value : [value]) {
      if (typeof v === 'string') params.append(key, v);
    }
  }
  params.set('screen_hint', 'signup');

  res.redirect(`${identityBasePath}/api/auth/login?${params.toString()}`);
};
