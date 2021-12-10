import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { UpdateUserSchema } from '../../types/schemas/update-user';
import { useUser } from '@weco/common/views/components/UserProvider/UserProvider';
import { UserInfo } from '@weco/common/model/user';

export enum UpdateUserError { // eslint-disable-line no-shadow
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  BRUTE_FORCE_BLOCKED = 'BRUTE_FORCE_BLOCKED',
  UNKNOWN = 'UNKNOWN',
}

type State = 'initial' | 'loading' | 'success' | `error`;

type UseUpdateUserMutation = {
  updateUser: (
    userDetails: UpdateUserSchema,
    onComplete: (updatedUser: UserInfo) => void
  ) => void;
  state: State;
  error?: UpdateUserError;
};

export function useUpdateUser(): UseUpdateUserMutation {
  const { _updateUserState } = useUser();
  const [state, setState] = useState<State>('initial');
  const [error, setError] = useState<UpdateUserError>();

  const updateUser: UseUpdateUserMutation['updateUser'] = (
    userDetails,
    onComplete = () => void 0
  ) => {
    setState('loading');
    axios
      .put('/account/api/users/me', userDetails)
      .then(response => {
        setState('success');
        const updatedUser = response.data as UserInfo;
        _updateUserState(updatedUser);
        onComplete(updatedUser);
      })
      .catch((err: AxiosError) => {
        setState('error');
        switch (err.response?.status) {
          case 401: {
            setError(UpdateUserError.INCORRECT_PASSWORD);
            break;
          }
          case 409: {
            setError(UpdateUserError.EMAIL_ALREADY_EXISTS);
            break;
          }
          case 429: {
            setError(UpdateUserError.BRUTE_FORCE_BLOCKED);
            break;
          }
          default: {
            setError(UpdateUserError.UNKNOWN);
            break;
          }
        }
      });
  };

  return { updateUser, state, error };
}
