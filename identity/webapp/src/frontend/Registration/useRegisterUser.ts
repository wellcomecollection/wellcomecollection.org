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
  isLoading: boolean;
  isSuccess: boolean;
  error?: RegistrationError;
};

export function useRegisterUser(): UseRegisterUserMutation {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<RegistrationError>();

  const registerUser = (userDetails: RegisterUserSchema) => {
    setIsLoading(true);
    callMiddlewareApi('POST', '/api/user/create', userDetails)
      .then(() => {
        setIsLoading(false);
        setIsSuccess(true);
      })
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
      })
      .finally(() => setIsLoading(false));
  };

  return { registerUser, isLoading, isSuccess, error };
}
