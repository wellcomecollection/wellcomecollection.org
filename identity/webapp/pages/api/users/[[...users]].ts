// import { AccessTokenError } from '@auth0/nextjs-auth0/errors';
import axios, { AxiosInstance /* Method as AxiosMethod */ } from 'axios';
// import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';

// import { auth0 } from '@weco/identity/lib/auth0';

const { serverRuntimeConfig: config } = getConfig();

export const identityAxios: AxiosInstance = axios.create({
  baseURL: config.remoteApi.host,
  headers: {
    'x-api-key': config.remoteApi.apiKey,
  },
});
// TODO: Handle in middleware

// const handleIdentityApiRequest: NextApiHandler = auth0.withApiAuthRequired(
//   async (req: NextApiRequest, res: NextApiResponse) => {
//     try {
//       const { accessToken } = await auth0.getAccessToken(req, res);
//       const path = '/users/' + (req.query.users as string[]).join('/');
//       const remoteResponse = await identityAxios
//         .request({
//           url: path,
//           method: req.method as AxiosMethod,
//           data: req.body,
//           headers: {
//             ...identityAxios.defaults.headers.common,
//             Authorization: `Bearer ${accessToken}`,
//           },
//           validateStatus: (status: number) => status >= 200 && status < 500,
//         })
//         .catch(error => {
//           if (error.response) {
//             return error.response;
//           }
//           // This can occur if, e.g. the TLS certificate for the API has expired.
//           console.error('Connection-level error (no response received)', error);
//           return {
//             status: 500,
//             data: { message: 'Error connecting to API' },
//           };
//         });

//       res.status(remoteResponse.status).send(remoteResponse.data);
//     } catch (e) {
//       if (e instanceof AccessTokenError) {
//         // Something went wrong with getting the access token
//         console.error('Unexpected authentication error', e);
//         res.status(401).send(e);
//       } else {
//         throw e;
//       }
//     }
//   }
// );

// export default handleIdentityApiRequest;
