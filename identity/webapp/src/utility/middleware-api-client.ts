import axios, { AxiosResponse, Method } from "axios";

const config = {
  prefix: ''
};

export function initaliseMiddlewareClient(prefix: string | null) {
  config.prefix = !!prefix ? prefix : '';
}

export async function callMiddlewareApi(
  method: Method,
  url: string,
  data?: unknown,
): Promise<AxiosResponse> {
  return axios({
    method: method,
    url: config.prefix + url,
    data: data,
  });
}
