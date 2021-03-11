import { useRouter } from 'next/router';
import { useMutation } from './useMutation';

type DeleteAccountMutation = {
  isLoading: boolean;
  deleteAccount: () => Promise<void>;
};

export function useDeleteAccount(): DeleteAccountMutation {
  const router = useRouter();
  const { userId } = router.query;
  const { mutate, isLoading } = useMutation(`/api/delete-account/${userId}`);

  return { deleteAccount: mutate, isLoading };
}
