import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { config } from './config';

export async function callRemoteApi(
  req: NextApiRequest,
  res: NextApiResponse,
  method: string,
  url: string,
  body?: unknown
): Promise<Response> {
  const headers = new Headers();
  headers.append('x-api-key', config.remoteApi.apiKey);

  let requestInit: RequestInit = {
    method: method,
  };

  const authToken = await getBearerToken(req, res);
  if (authToken) {
    headers.append('Authorization', authToken);
  }
  if (body) {
    headers.append('Content-Type', 'application/json');
    requestInit = {
      ...requestInit,
      body: JSON.stringify(body),
    };
  }

  requestInit = {
    ...requestInit,
    headers: headers,
  };

  const fullUrl = config.remoteApi.baseUrl + url;
  return fetch(fullUrl, requestInit);
}

function getBearerToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<string | undefined> {
  return getAccessToken(req, res, {
    scopes: ['openid', 'profile', 'email'],
  }).then(result => {
    return result.accessToken ? 'Bearer ' + result.accessToken : undefined;
  });
}
