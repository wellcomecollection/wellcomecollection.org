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
): Promise<void> =>
  res.redirect(`${identityBasePath}/api/auth/login?screen_hint=signup`);
