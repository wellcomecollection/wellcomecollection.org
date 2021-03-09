import { useRouter } from 'next/router';
import { useMutation } from './useMutation';

type UnblockAccountMutation = {
  isLoading: boolean;
  unblockAccount: () => Promise<void>;
};

export function useUnblockAccount(): UnblockAccountMutation {
  const router = useRouter();
  const { userId } = router.query;
  const { mutate, isLoading } = useMutation(`/api/unblock-account/${userId}`);

  return { unblockAccount: mutate, isLoading };
}
