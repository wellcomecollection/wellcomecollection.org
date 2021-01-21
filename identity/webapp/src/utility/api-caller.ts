import { config } from '../config';
import axios, {AxiosInstance, AxiosResponse, Method} from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: config.remoteApi.baseUrl,
  headers: {
    'x-api-key': config.remoteApi.apiKey
  },
});

export async function callRemoteApi(method: Method, url: string, body?: any): Promise<AxiosResponse> {
  if (body) {
    return instance.request({
      method: method,
      url: url,
      data: body,
      headers: { ... instance.defaults.headers, 'Content-Type': 'application/json' }
    }).catch(function(error) {
      return error.response;
    });
  }
  return instance.request({
    method: method,
    url: url
  }).catch(function(error) {
    return error.response;
  });
}
