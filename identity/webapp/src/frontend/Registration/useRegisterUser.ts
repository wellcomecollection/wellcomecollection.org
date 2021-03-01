import { useState } from 'react';
import { AxiosError } from 'axios';
import { RegisterUserSchema } from '../../types/schemas/register-user';
import { callMiddlewareApi } from '../../utility/middleware-api-client';

type UseRegisterUserMutation = {
  registerUser: (userDetails: RegisterUserSchema) => void;
  isSuccess: boolean;
  emailAlreadyExists: boolean;
  error: boolean;
};

export function useRegisterUser(): UseRegisterUserMutation {
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
  const [error, setError] = useState(false);

  const registerUser = (userDetails: RegisterUserSchema) => {
    callMiddlewareApi('POST', '/api/user/create', userDetails)
      .then(() => setIsSuccess(true))
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 409: {
            setEmailAlreadyExists(true);
            break;
          }
          default: {
            setError(true);
            break;
          }
        }
      });
  };

  return { registerUser, isSuccess, emailAlreadyExists, error };
}
