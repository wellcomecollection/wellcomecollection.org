import type { NextApiRequest, NextApiResponse } from 'next';
import { decodeToken } from '../../src/utility/jwt-codec';
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
      console.error('Missing required fields');
      res.redirect(302, `/account/error`);
    }

    try {
      const decodedToken = decodeToken(sessionToken);

      if (typeof decodedToken !== 'string') {
        const redirectUri = `${config.auth0.domain}/continue?state=${state}`;
        const { sub } = decodedToken;
        const userIdPrefix = /auth0\|p?/;
        const userId = sub.replace(userIdPrefix, '');

        axios
          .put(`/api/users/${userId}/registration`, {
            firstName,
            lastName,
          })
          .then(() => {
            res.redirect(302, `${redirectUri}`);
          })
          .catch(error => {
            console.error(error);
            res.redirect(302, `/account/error`);
          });
      }
    } catch (error) {
      console.error(error);
      res.redirect(302, `/account/error`);
    }
  } else {
    res.redirect('/account');
  }
};
