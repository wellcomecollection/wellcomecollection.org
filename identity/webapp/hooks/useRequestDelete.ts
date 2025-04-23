import axios, { AxiosError } from 'axios';
import { useState } from 'react';

import { RequestDeleteSchema } from '@weco/identity/types/schemas/request-delete';

export enum RequestDeleteError {
  INCORRECT_PASSWORD,
  BRUTE_FORCE_BLOCKED,
  UNKNOWN,
}

type UseRequestDeleteMutation = {
  requestDelete: (userDetails: RequestDeleteSchema) => void;
  isLoading: boolean;
  isSuccess: boolean;
  error?: RequestDeleteError;
};

export function useRequestDelete(): UseRequestDeleteMutation {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<RequestDeleteError>();

  const requestDelete = (requestDeleteBody: RequestDeleteSchema) => {
    setIsLoading(true);
    axios
      .put('/account/api/users/me/deletion-request', requestDeleteBody)
      .then(() => {
        setIsSuccess(true);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401: {
            setError(RequestDeleteError.INCORRECT_PASSWORD);
            break;
          }
          case 429: {
            setError(RequestDeleteError.BRUTE_FORCE_BLOCKED);
            break;
          }
          default: {
            setError(RequestDeleteError.UNKNOWN);
            break;
          }
        }
      })
      .finally(() => setIsLoading(false));
  };

  return { requestDelete, isLoading, isSuccess, error };
}
