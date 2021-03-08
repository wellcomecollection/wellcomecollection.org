import { useRouter } from 'next/router';
import { useMutation } from './useMutation';

type ReverseDeleteRequestMutation = {
  isLoading: boolean;
  reverseDeleteRequest: () => Promise<void>;
};

export function useReverseDeleteRequest(): ReverseDeleteRequestMutation {
  const router = useRouter();
  const { userId } = router.query;
  const { mutate, isLoading } = useMutation(
    `/api/reverse-delete-request/${userId}`
  );

  return { reverseDeleteRequest: mutate, isLoading };
}
