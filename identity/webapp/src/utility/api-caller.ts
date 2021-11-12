import { config } from '../config';
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  Method as AxiosMethod,
} from 'axios';
import { ApplicationContext, ApplicationState } from '../types/application';
import { ParameterizedContext } from 'koa';

export const identityAxios: AxiosInstance = axios.create({
  baseURL: config.remoteApi.host,
  headers: {
    'x-api-key': config.remoteApi.apiKey,
  },
});

type ContextState = ApplicationState | { user?: { accessToken?: string } };

const isAuthenticated = (contextState: ContextState): boolean =>
  !!contextState.user?.accessToken;

export async function callRemoteApi(
  path: string,
  context: ParameterizedContext<ContextState, ApplicationContext>
): Promise<AxiosResponse> {
  let request: AxiosRequestConfig = {
    url: path,
    method: context.method as AxiosMethod,
    headers: identityAxios.defaults.headers.common,
    validateStatus: (status: number) => status >= 200 && status < 500,
  };

  if (isAuthenticated(context.state)) {
    request = {
      ...request,
      headers: {
        ...request.headers,
        Authorization: 'Bearer ' + context.state.user.accessToken,
      },
    };
  }

  if (context.request.length) {
    request = {
      ...request,
      data: context.request.body,
    };
  }

  return identityAxios.request(request).catch(function (error) {
    console.error(error);
    return error.response;
  });
}
