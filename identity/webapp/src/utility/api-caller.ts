import { config } from '../config';
import axios, {AxiosInstance, AxiosResponse, Method} from 'axios';
import {ApplicationState} from "../types/application";

const instance: AxiosInstance = axios.create({
  baseURL: config.remoteApi.baseUrl,
  headers: {
    'x-api-key': config.remoteApi.apiKey
  },
});

export async function callRemoteApi(method: Method, url: string, contextState: ApplicationState, body?: any, authenticate: boolean = true): Promise<AxiosResponse> {
  let headers = instance.defaults.headers;
  if (authenticate) {
    headers = { ... headers, 'Authorization': 'Bearer ' + contextState.user.accessToken};
  }
  if (body) {
    headers = { ... headers, 'Content-Type': 'application/json' };
    return instance.request({
      method: method,
      url: url,
      data: body,
      headers: headers
    }).catch(function(error) {
      return error.response;
    });
  }
  return instance.request({
    method: method,
    url: url,
    headers: headers,
  }).catch(function(error) {
    return error.response;
  });
}
