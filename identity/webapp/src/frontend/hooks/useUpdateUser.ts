import axios from 'axios';
import { useState } from 'react';

import { useUser } from '@weco/common/contexts/UserProvider';
import { UserInfo } from '@weco/common/model/user';
import { UpdateUserSchema } from '@weco/identity/src/types/schemas/update-user';

export enum UpdateUserError {
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',
  BRUTE_FORCE_BLOCKED = 'BRUTE_FORCE_BLOCKED',
  UNKNOWN = 'UNKNOWN',
}

type State = 'initial' | 'loading' | 'success' | 'error';

type UseUpdateUserMutation = {
  updateUser: (
    userDetails: UpdateUserSchema,
    onComplete: (updatedUser: UserInfo) => void
  ) => void;
  state: State;
  error?: UpdateUserError;
};

export function useUpdateUser(): UseUpdateUserMutation {
  const { reload: refreshUserSession } = useUser();
  const [state, setState] = useState<State>('initial');
  const [error, setError] = useState<UpdateUserError>();

  const updateUser: UseUpdateUserMutation['updateUser'] = async (
    userDetails,
    onComplete = () => undefined
  ) => {
    setState('loading');
    try {
      const updateResponse = await axios.put(
        '/account/api/users/me',
        userDetails
      );
      await refreshUserSession();
      setState('success');
      const updatedUser = updateResponse.data as UserInfo;
      onComplete(updatedUser);
    } catch (err) {
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
    }
  };

  return { updateUser, state, error };
}
