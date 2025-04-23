import axios, { AxiosError } from 'axios';
import { useState } from 'react';

import { UpdatePasswordSchema } from '@weco/identity/types/schemas/update-password';

export enum UpdatePasswordError {
  INCORRECT_PASSWORD,
  BRUTE_FORCE_BLOCKED,
  DID_NOT_MEET_POLICY,
  UNKNOWN,
  REPEATED_CHARACTERS,
}

type UseUpdatePasswordMutation = {
  updatePassword: (
    userDetails: UpdatePasswordSchema,
    onComplete: () => void
  ) => void;
  isLoading: boolean;
  isSuccess: boolean;
  error?: UpdatePasswordError;
};

export function useUpdatePassword(): UseUpdatePasswordMutation {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UpdatePasswordError>();

  const updatePassword: UseUpdatePasswordMutation['updatePassword'] = (
    updatePasswordBody,
    onComplete
  ) => {
    setIsLoading(true);
    axios
      .put('/account/api/users/me/password', updatePasswordBody)
      .then(() => {
        setIsSuccess(true);
        onComplete();
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 400: {
            if (err.message.includes('PIN is not valid : PIN is trivial')) {
              setError(UpdatePasswordError.REPEATED_CHARACTERS);
              break;
            } else {
              setError(UpdatePasswordError.UNKNOWN);
              break;
            }
          }
          case 401: {
            setError(UpdatePasswordError.INCORRECT_PASSWORD);
            break;
          }
          case 422: {
            setError(UpdatePasswordError.DID_NOT_MEET_POLICY);
            break;
          }
          case 429: {
            setError(UpdatePasswordError.BRUTE_FORCE_BLOCKED);
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
