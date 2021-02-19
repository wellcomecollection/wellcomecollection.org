import { AxiosError } from 'axios';
import { UpdatePasswordSchema } from '../../types/schemas/update-password';
import { callMiddlewareApi } from '../../utility/middleware-api-client';

type Mutation = (body: UpdatePasswordSchema, onSuccess: () => void, onFailure: (statusCode?: number) => void) => void;

export function useUpdatePassword(): [Mutation] {
  const mutate: Mutation = async (body, onSuccess, onFailure) => {
    await callMiddlewareApi('PUT', '/api/users/me/password', body)
      .then(onSuccess)
      .catch((error: AxiosError) => {
        onFailure(error.response?.status);
      });
  };

  return [mutate];
}
