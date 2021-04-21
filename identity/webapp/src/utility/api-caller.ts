import { config } from '../config';
import axios, { AxiosInstance, AxiosResponse, Method, AxiosRequestConfig } from 'axios';
import { ApplicationState } from '../types/application';

const identityInstance: AxiosInstance = axios.create({
  baseURL: config.remoteApi.baseUrl,
  headers: {
    'x-api-key': config.remoteApi.apiKey,
  },
});

type ContextState = ApplicationState | { user: { accessToken: string } };

export async function callRemoteApi(
  method: Method,
  url: string,
  contextState: ContextState,
  body?: unknown,
  authenticate = true
): Promise<AxiosResponse> {
  let request: AxiosRequestConfig = {
    method,
    url,
    headers: identityInstance.defaults.headers,
    validateStatus: (status: number) => status >= 200 && status < 300,
  };

  if (authenticate) {
    request = {
      ...request,
      headers: {
        ...request.headers,
        Authorization: 'Bearer ' + contextState.user.accessToken,
      },
    };
  }
  if (body) {
    request = {
      ...request,
      headers: {
        ...request.headers,
        'Content-Type': 'application/json',
      },
      data: body,
    };
  }

  return identityInstance.request(request).catch(function (error) {
    console.error(error);
    return error.response;
  });
}
