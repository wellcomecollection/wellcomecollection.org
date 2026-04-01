import { useState } from 'react';

import { UpdatePasswordSchema } from '@weco/identity/types/schemas/update-password';
import { accountApiClient } from '@weco/identity/utils/api-client';
import { FetchError } from '@weco/identity/utils/fetch-helpers';

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

  const updatePassword: UseUpdatePasswordMutation['updatePassword'] = async (
    updatePasswordBody,
    onComplete
  ) => {
    setIsLoading(true);
    try {
      await accountApiClient.put('/users/me/password', updatePasswordBody);
      setIsSuccess(true);
      onComplete();
    } catch (err) {
      const fetchErr = err as FetchError;
      switch (fetchErr.response?.status) {
        case 400: {
          // Check response data for backend validation message
          const errorData = fetchErr.response?.data;
          const errorMessage =
            typeof errorData === 'object' && errorData !== null
              ? JSON.stringify(errorData)
              : String(errorData || '');

          if (errorMessage.includes('PIN is not valid : PIN is trivial')) {
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
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePassword, isLoading, isSuccess, error };
}
