import * as Koa from 'koa';
import { RouterParamContext } from '@koa/router';

export interface ApplicationState {
  // User.
  // JWT.
  // Role.
  // etc...
  user?: any;
}

export interface ApplicationContext {
  logout: () => void;
  isAuthenticated: () => boolean;
}

export type RouteContext<Params = any> = ApplicationContext &
  Omit<RouterParamContext<ApplicationState, ApplicationContext>, 'params'> & {
    params: Params;
  } & {
    login: (...args: any[]) => any;
  };

export type RouteMiddleware<Params = any> = Koa.Middleware<
  ApplicationState,
  RouteContext<Params>
>;
