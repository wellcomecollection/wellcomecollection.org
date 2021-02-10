// import { useState } from 'react';
import axios from 'axios';
import { UpdateUserSchema } from '../../types/schemas/update-user';

type Mutation = (body: UpdateUserSchema, onSuccess: () => void, onFailure: () => void) => void;

export function useUpdateUserInfo(): [Mutation] {
  // const [data, setData] = useState();
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState();

  const mutate: Mutation = async (body, onSuccess, onFailure) => {
    await axios
      .put<UpdateUserSchema>('/api/users/me', body)
      .then(({ status }) => {
        if (status === 200) {
          return onSuccess();
        }
        return onFailure();
      })
      .catch(() => {
        onFailure();
      });
  };

  return [mutate];
}
