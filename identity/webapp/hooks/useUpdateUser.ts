import { useState } from 'react';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { UserInfo } from '@weco/common/model/user';
import { UpdateUserSchema } from '@weco/identity/types/schemas/update-user';
import { accountApiClient } from '@weco/identity/utils/api-client';
import { FetchError } from '@weco/identity/utils/fetch-helpers';

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
  const { reload: refreshUserSession } = useUserContext();
  const [state, setState] = useState<State>('initial');
  const [error, setError] = useState<UpdateUserError>();

  const updateUser: UseUpdateUserMutation['updateUser'] = async (
    userDetails,
    onComplete = () => undefined
  ) => {
    setState('loading');
    try {
      const response = await accountApiClient.put('/users/me', userDetails);
      await refreshUserSession();
      setState('success');
      const updatedUser = response.data as UserInfo;
      onComplete(updatedUser);
    } catch (err) {
      setState('error');
      // Ensure error is FetchError before accessing response property
      if (err instanceof FetchError) {
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
      } else {
        // Non-FetchError (network error, etc.)
        setError(UpdateUserError.UNKNOWN);
      }
    }
  };

  return { updateUser, state, error };
}
