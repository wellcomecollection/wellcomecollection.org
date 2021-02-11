// import { useState } from 'react';
import { AxiosError } from 'axios';
import { UpdateUserSchema } from '../../types/schemas/update-user';
import { callMiddlewareApi } from "../../utility/middleware-api-client";

type Mutation = (body: UpdateUserSchema, onSuccess: () => void, onFailure: (statusCode?: number) => void) => void;

export function useUpdateUserInfo(): [Mutation] {
  const mutate: Mutation = async (body, onSuccess, onFailure) => {
    await callMiddlewareApi('PUT','/api/users/me', body)
      .then(onSuccess)
      .catch((error: AxiosError) => {
        onFailure(error.response?.status);
      });
  };

  return [mutate];
}
