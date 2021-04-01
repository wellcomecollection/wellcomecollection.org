import { User } from '../interfaces';
import { useMutation } from './useMutation';

type DeleteAccountMutation = {
  isLoading: boolean;
  deleteAccount: () => Promise<void>;
};

export function useDeleteAccount(
  userId: User['userId']
): DeleteAccountMutation {
  const { mutate, isLoading } = useMutation(`/api/delete-account/${userId}`);

  return { deleteAccount: mutate, isLoading };
}
