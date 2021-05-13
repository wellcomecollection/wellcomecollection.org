import { useState } from 'react';
import { AxiosError } from 'axios';
import { UpdateUserSchema } from '../../types/schemas/update-user';
import { callMiddlewareApi } from '../../utility/middleware-api-client';

export enum UpdateUserError { // eslint-disable-line no-shadow
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  BRUTE_FORCE_BLOCKED = 'BRUTE_FORCE_BLOCKED',
  UNKNOWN = 'UNKNOWN',
}

type UseUpdateUserMutation = {
  updateUser: (userDetails: UpdateUserSchema, onComplete: (newUserDetails: UpdateUserSchema) => void) => void;
  isLoading: boolean;
  isSuccess: boolean;
  error?: UpdateUserError;
};

export function useUpdateUser(): UseUpdateUserMutation {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UpdateUserError>();

  const updateUser = (
    userDetails: UpdateUserSchema,
    onComplete: (newUserDetails: UpdateUserSchema) => void = () => null
  ) => {
    setIsLoading(true);
    callMiddlewareApi('PUT', '/api/users/me', userDetails)
      .then(() => {
        setIsLoading(false);
        setIsSuccess(true);
        onComplete(userDetails);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401: {
            setError(UpdateUserError.INCORRECT_PASSWORD);
            break;
          }
          case 409: {
            setError(UpdateUserError.EMAIL_ALREADY_EXISTS);
            break;
          }
          case 429: {
            setError(UpdateUserError.BRUTE_FORCE_BLOCKED);
            break;
          }
          default: {
            setError(UpdateUserError.UNKNOWN);
            break;
          }
        }
      })
      .finally(() => setIsLoading(false));
  };

  return { updateUser, isLoading, isSuccess, error };
}
