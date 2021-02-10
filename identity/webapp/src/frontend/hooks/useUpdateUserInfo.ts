// import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { UpdateUserSchema } from '../../types/schemas/update-user';

type Mutation = (body: UpdateUserSchema, onSuccess: () => void, onFailure: (statusCode?: number) => void) => void;

export function useUpdateUserInfo(): [Mutation] {
  const mutate: Mutation = async (body, onSuccess, onFailure) => {
    await axios
      .put<UpdateUserSchema>('/api/users/me', body)
      .then(onSuccess)
      .catch((error: AxiosError) => {
        onFailure(error.response?.status);
      });
  };

  return [mutate];
}
