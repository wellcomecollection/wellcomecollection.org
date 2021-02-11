import { config } from '../config';
import axios, { AxiosInstance, AxiosResponse, Method } from 'axios';
import { ApplicationState } from '../types/application';

const identityInstance: AxiosInstance = axios.create({
  baseURL: config.remoteApi.baseUrl,
  headers: {
    'x-api-key': config.remoteApi.apiKey,
  },
});

const auth0Instance = axios.create({
  baseURL: config.auth0.domain,
});

type ContextState = ApplicationState | { user: { accessToken: string } };

async function callApi(instance: AxiosInstance, method: Method, url: string, contextState: ContextState,
  body?: unknown,
  authenticate = true
) {
  let headers = instance.defaults.headers;
  if (authenticate) {
    headers = { ...headers, Authorization: 'Bearer ' + contextState.user.accessToken };
  }
  if (body) {
    headers = { ...headers, 'Content-Type': 'application/json' };
    return instance
      .request({
        method: method,
        url: url,
        data: body,
        headers: headers,
      })
      .catch(function (error) {
        return error.response;
      });
  }
  return instance
    .request({
      method: method,
      url: url,
      headers: headers,
    })
    .catch(function (error) {
      return error.response;
    });
}

export async function callAuth0Api(method: Method, url: string, contextState: ContextState, body?: any, authenticate: boolean = true): Promise<AxiosResponse> {
  return callApi(auth0Instance, method, url, contextState, body, authenticate);
}

export async function callRemoteApi(method: Method, url: string, contextState: ContextState, body?: any, authenticate: boolean = true): Promise<AxiosResponse> {
  return callApi(identityInstance, method, url, contextState, body, authenticate);
}
