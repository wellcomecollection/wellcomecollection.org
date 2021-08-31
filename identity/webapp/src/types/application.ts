import * as Koa from 'koa';
import { RouterParamContext } from '@koa/router';
import { router } from '../router';
import { Ajv } from 'ajv';

export interface ApplicationState {
  // User.
  // JWT.
  // Role.
  // etc...
  user: any;
}

export interface ApplicationContext {
  routes: typeof router;
  logout: () => void;
  isAuthenticated: () => boolean;
  ajv: Ajv;
}

export type RouteContext<Params = any, Body = any> = ApplicationContext &
  Omit<RouterParamContext<ApplicationState, ApplicationContext>, 'params'> & {
    params: Params;
  } & {
    requestBody: Body;
    login: (...args: any[]) => any;
  };

export type RouteMiddleware<Params = any, Body = any> = Koa.Middleware<
  ApplicationState,
  RouteContext<Params, Body>
>;
