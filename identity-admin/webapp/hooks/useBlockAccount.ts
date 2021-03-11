import { useRouter } from 'next/router';
import { useMutation } from './useMutation';

type BlockAccountMutation = {
  isLoading: boolean;
  blockAccount: () => Promise<void>;
};

export function useBlockAccount(): BlockAccountMutation {
  const router = useRouter();
  const { userId } = router.query;
  const { mutate, isLoading } = useMutation(`/api/block-account/${userId}`);

  return { blockAccount: mutate, isLoading };
}
