import { AccessTokenError } from '@auth0/nextjs-auth0';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';

import auth0 from '@weco/identity/utils/auth0';
import { FetchClient } from '@weco/identity/utils/fetch-helpers';

const { serverRuntimeConfig: config } = getConfig();

export const identityFetchClient: FetchClient = new FetchClient({
  baseURL: config.remoteApi.host,
  headers: {
    'x-api-key': config.remoteApi.apiKey,
  },
});

const handleIdentityApiRequest: NextApiHandler = auth0.withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { accessToken } = await auth0.getAccessToken(req, res);
      const path = '/users/' + (req.query.users as string[]).join('/');

      // GET and HEAD requests cannot have a body
      const method = req.method || 'GET';
      const remoteResponse = await identityFetchClient
        .request({
          url: path,
          method,
          // Only include body for methods that support it
          ...(method !== 'GET' && method !== 'HEAD' ? { data: req.body } : {}),
          headers: {
            ...identityFetchClient.defaults.headers.common,
            Authorization: `Bearer ${accessToken}`,
          },
          validateStatus: (status: number) => status >= 200 && status < 500,
        })
        .catch(error => {
          if (error.response) {
            return error.response;
          }
          // This can occur if, e.g. the TLS certificate for the API has expired.
          console.error('Connection-level error (no response received)', error);
          return {
            status: 500,
            data: { message: 'Error connecting to API' },
          };
        });

      res.status(remoteResponse.status).send(remoteResponse.data);
    } catch (e) {
      if (e instanceof AccessTokenError) {
        // Something went wrong with getting the access token
        console.error('Unexpected authentication error', e);
        res.status(401).send(e);
      } else {
        throw e;
      }
    }
  }
);

export default handleIdentityApiRequest;
