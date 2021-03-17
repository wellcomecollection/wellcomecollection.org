import { useState } from 'react';
import { AxiosError } from 'axios';
import { UpdatePasswordSchema } from '../../types/schemas/update-password';
import { callMiddlewareApi } from '../../utility/middleware-api-client';

export enum UpdatePasswordError { // eslint-disable-line no-shadow
  INCORRECT_PASSWORD,
  DID_NOT_MEET_POLICY,
  UNKNOWN,
}

type UseUpdatePasswordMutation = {
  updatePassword: (userDetails: UpdatePasswordSchema) => void;
  isLoading: boolean;
  isSuccess: boolean;
  error?: UpdatePasswordError;
};

export function useUpdatePassword(): UseUpdatePasswordMutation {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UpdatePasswordError>();

  const updatePassword = (updatePasswordBody: UpdatePasswordSchema) => {
    setIsLoading(true);
    callMiddlewareApi('PUT', '/api/users/me/password', updatePasswordBody)
      .then(() => {
        setIsSuccess(true);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401: {
            setError(UpdatePasswordError.INCORRECT_PASSWORD);
            break;
          }
          case 422: {
            setError(UpdatePasswordError.DID_NOT_MEET_POLICY);
            break;
          }
          default: {
            setError(UpdatePasswordError.UNKNOWN);
            break;
          }
        }
      })
      .finally(() => setIsLoading(false));
  };

  return { updatePassword, isLoading, isSuccess, error };
}
