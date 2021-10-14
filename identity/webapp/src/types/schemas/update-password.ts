import { AuthenticationSchema } from './auth';

export interface UpdatePasswordSchema extends AuthenticationSchema {
  newPassword: string;
}
