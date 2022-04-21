import type { NextApiRequest, NextApiResponse } from 'next';
import { generateNewToken, decodeToken } from '../../src/utility/jwt-codec';

export default (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method === 'POST') {
    const {
      state,
      redirectUri,
      firstName,
      lastName,
      termsAndConditions,
      sessionToken,
    } = req.body;

    const decodedToken = decodeToken(sessionToken);
    const formData = { firstName, lastName, termsAndConditions };

    if (typeof decodedToken !== 'string') {
      const newToken = generateNewToken(decodedToken, state, formData);

      res.redirect(
        308,
        `${redirectUri}?state=${state}&session_token=${newToken}`
      );
    }
  } else {
    res.redirect('/account');
  }
};
