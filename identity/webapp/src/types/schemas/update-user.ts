import { AuthenticationSchema } from './auth';

export interface UpdateUserSchema extends AuthenticationSchema {
  newEmail: string;
}
