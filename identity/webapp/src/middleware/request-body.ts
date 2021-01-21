import { RequestError } from '../utility/errors/request-error';
import { RouteMiddleware } from '../types/application';

export const requestBody = (schemaName?: string): RouteMiddleware => async (context, next) => {
  if (context.request.body) {
    if (schemaName) {
      const valid = context.ajv.validate(schemaName, context.request.body);
      if (!valid) {
        throw new RequestError(context.ajv.errorsText());
      }
    }
    context.requestBody = context.request.body;
  }
  await next();
};
