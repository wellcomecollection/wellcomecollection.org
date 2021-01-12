import { RouteMiddleware } from '../../types/application';
import { RegisterUserSchema } from '../../types/schemas/register-user';
// import axios from 'axios';

// This will communicate with the backend api to make the call on our behalf.

export const registerUser: RouteMiddleware<{
  firstName: string;
  lastName: string;
  email: string;
  password: string; }, RegisterUserSchema> = (context) => {

  const body = context.requestBody; // type = RegisterUserSchema

  // Make call to API.
  // fetch( ... ,  { body: body });
  console.log(body);

  // Return whatever you want to the user.
  context.response.status = 200;
};
