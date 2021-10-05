import axios, { AxiosResponse, Method, AxiosRequestConfig } from 'axios';

export async function callMiddlewareApi(
  method: Method,
  url: string,
  data?: unknown,
  otherConfig: Partial<AxiosRequestConfig> = {}
): Promise<AxiosResponse> {
  return axios({
    ...otherConfig,
    method,
    url,
    data,
  });
}
