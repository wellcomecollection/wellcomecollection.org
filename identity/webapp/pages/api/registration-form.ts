import type { NextApiRequest, NextApiResponse } from 'next';
import { generateNewToken, decodeToken } from '../../src/utility/jwt-codec';
import axios from 'axios';
import getConfig from 'next/config';

const { serverRuntimeConfig: config } = getConfig();

export default (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method === 'POST') {
    const { state, firstName, lastName, termsAndConditions, sessionToken } =
      req.body;

    if (
      !state ||
      !firstName ||
      !lastName ||
      !termsAndConditions ||
      !sessionToken
    ) {
      res.status(400).json({
        error: 'Missing required fields',
      });
      return;
    }

    try {
      const decodedToken = decodeToken(sessionToken);
      const formData = { firstName, lastName, termsAndConditions };

      if (typeof decodedToken !== 'string') {
        const newToken = generateNewToken(decodedToken, state, formData);

        axios
          .post(`${config.auth0.domain}/continue`, {
            state,
            session_token: newToken,
          })
          .then(() => {
            res.redirect(302, `/account`);
          })
          .catch(() => {
            res.status(400).json({
              error: 'Registration failed',
            });
          });
      }
    } catch (error) {
      res.status(400).json({
        error: 'Invalid session token',
      });
    }
  } else {
    res.redirect('/account');
  }
};
