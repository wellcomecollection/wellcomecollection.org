import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method === 'POST') {
    const { newToken, state, redirectUri } = req.body;

    res.redirect(`${redirectUri}?state=${state}&session_token=${newToken}`);
  }
};
