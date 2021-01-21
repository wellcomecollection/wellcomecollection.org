import { RouteMiddleware } from '../../types/application';
import { RequestError } from '../../utility/errors/request-error';
import { UpdatePasswordSchema } from '../../types/schemas/update-password';

export const updatePassword: RouteMiddleware<{ user_id: string }, UpdatePasswordSchema> = (context) => {
  if (!context.isAuthenticated()) {
    throw new RequestError(`Unauthorized`); // Can make a specific error if required, this is a generic 400.
  }

  const body = context.requestBody; // type = UpdatePasswordSchema

  // Make call to API.
  // fetch( ... ,  { body: body });
  console.log(body);

  // Return whatever you want to the user.
  context.response.status = 200;
};
