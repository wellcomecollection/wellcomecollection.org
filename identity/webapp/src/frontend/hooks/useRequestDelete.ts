import { useState } from 'react';
import { AxiosError } from 'axios';
import { RequestDeleteSchema } from '../../types/schemas/request-delete';
import { callMiddlewareApi } from '../../utility/middleware-api-client';

export enum RequestDeleteError { // eslint-disable-line no-shadow
  INCORRECT_PASSWORD,
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
    callMiddlewareApi('PUT', '/api/users/me/deletion-request', requestDeleteBody)
      .then(() => {
        setIsSuccess(true);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401: {
            setError(RequestDeleteError.INCORRECT_PASSWORD);
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
