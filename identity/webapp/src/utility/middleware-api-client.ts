import axios, { AxiosResponse, Method } from 'axios';

export async function callMiddlewareApi(
  method: Method,
  url: string,
  data?: unknown
): Promise<AxiosResponse> {
  return axios({
    method,
    url,
    data,
  });
}
