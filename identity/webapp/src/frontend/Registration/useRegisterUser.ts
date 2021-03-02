import { useState } from 'react';
import { AxiosError } from 'axios';
import { RegisterUserSchema } from '../../types/schemas/register-user';
import { callMiddlewareApi } from '../../utility/middleware-api-client';

export enum RegistrationError { // eslint-disable-line no-shadow
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  PASSWORD_TOO_COMMON = 'PASSWORD_TOO_COMMON',
  UNKNOWN = 'UNKNOWN',
}

type UseRegisterUserMutation = {
  registerUser: (userDetails: RegisterUserSchema) => void;
  isSuccess: boolean;
  error?: RegistrationError;
};

export function useRegisterUser(): UseRegisterUserMutation {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<RegistrationError>();

  const registerUser = (userDetails: RegisterUserSchema) => {
    callMiddlewareApi('POST', '/api/user/create', userDetails)
      .then(() => setIsSuccess(true))
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 409: {
            setError(RegistrationError.EMAIL_ALREADY_EXISTS);
            break;
          }
          case 422: {
            setError(RegistrationError.PASSWORD_TOO_COMMON);
            break;
          }
          default: {
            setError(RegistrationError.UNKNOWN);
            break;
          }
        }
      });
  };

  return { registerUser, isSuccess, error };
}
