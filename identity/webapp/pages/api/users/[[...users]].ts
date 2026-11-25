import { AccessTokenError } from '@auth0/nextjs-auth0/errors';
import { NextApiRequest, NextApiResponse } from 'next';

import auth0 from '@weco/identity/utils/auth0';
import { FetchClient } from '@weco/identity/utils/fetch-helpers';
import {
  chooseIdentityApi,
  folioUserIdFromAccessToken,
  IdentityApi,
  identityApiV1,
  identityApiV2,
  isAuth0StoredUser,
  patronIp,
  subFromAccessToken,
} from '@weco/identity/utils/identity-api';

const fetchClientFor = (api: IdentityApi): FetchClient =>
  new FetchClient({
    baseURL: api.host,
    headers: {
      'x-api-key': api.apiKey,
    },
  });

const identityFetchClients = new Map<IdentityApi, FetchClient>(
  [identityApiV1, identityApiV2]
    .filter((api): api is IdentityApi => api !== undefined)
    .map(api => [api, fetchClientFor(api)])
);

// Identity API routes for the signed-in user, so nothing else is reachable with
// their token and our API key. A Map so request values can't hit inherited keys.
const allowedRoutes = new Map<string, string[]>([
  ['me', ['GET', 'PUT']],
  ['me/password', ['PUT']],
  ['me/deletion-request', ['PUT']],
  ['me/send-verification-email', ['POST']],
  ['me/validate', ['POST']],
  ['me/item-requests', ['GET', 'POST']],
]);

const handleIdentityApiRequest = auth0.withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const route = ((req.query.users as string[] | undefined) || []).join('/');
    const method = req.method || 'GET';
    const allowedMethods = allowedRoutes.get(route);
    if (!allowedMethods) {
      return res.status(404).json({ message: 'Not found' });
    }
    if (!allowedMethods.includes(method)) {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
      const { token } = await auth0.getAccessToken(req, res);
      const path = `/users/${route}`;

      const sub = subFromAccessToken(token);
      const api = await chooseIdentityApi(
        req,
        folioUserIdFromAccessToken(token),
        sub
      );
      // Only where v2 doesn't exist, since v1 can't serve these users
      if (api.version === 1 && isAuth0StoredUser(sub)) {
        return res
          .status(403)
          .json({ message: "This account can't be used at the moment" });
      }
      const identityFetchClient = identityFetchClients.get(api)!;

      // v2 refuses password checks without the patron's IP address
      const ip = api.version === 2 ? patronIp(req) : undefined;
      if (api.version === 2 && !ip) {
        console.warn('No patron IP address for a v2 identity API request');
      }

      // req.body is '' (not undefined) when the original request had no body
      // at all - Next.js's parseBody falls back to text/plain and yields ''
      // for zero bytes (see parseBody in
      // next/dist/server/api-utils/node/parse-body.js). Treat that the same
      // as "no body" so we don't forward a bogus JSON.stringify('') === '""'
      // payload to the identity API.
      const body = req.body === '' ? undefined : req.body;

      // GET and HEAD requests cannot have a body
      const remoteResponse = await identityFetchClient
        .request({
          url: path,
          method,
          // Only include body for methods that support it
          ...(method !== 'GET' && method !== 'HEAD' && body !== undefined
            ? { data: body }
            : {}),
          headers: {
            ...identityFetchClient.defaults.headers.common,
            Authorization: `Bearer ${token}`,
            ...(ip ? { 'X-Forwarded-For': ip } : {}),
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
