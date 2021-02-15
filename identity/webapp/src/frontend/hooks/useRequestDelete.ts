// import { useState } from 'react';
import { AxiosError } from 'axios';
import { RequestDeleteSchema } from '../../types/schemas/request-delete';
import { callMiddlewareApi } from '../../utility/middleware-api-client';

type Mutation = (body: RequestDeleteSchema, onSuccess?: () => void, onFailure?: (statusCode?: number) => void) => void;

export function useRequestDelete(): [Mutation] {
  const mutate: Mutation = async (body, onSuccess = () => null, onFailure = () => null) => {
    await callMiddlewareApi('DELETE', '/api/users/me', body)
      .then(onSuccess)
      .catch((error: AxiosError) => {
        onFailure(error.response?.status);
      });
  };

  return [mutate];
}
