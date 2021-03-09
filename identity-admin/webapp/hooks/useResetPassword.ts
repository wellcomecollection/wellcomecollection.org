import { useRouter } from 'next/router';
import { useMutation } from './useMutation';

type ResetPasswordMutation = {
  isLoading: boolean;
  resetPassword: () => Promise<void>;
};

export function useResetPassword(): ResetPasswordMutation {
  const router = useRouter();
  const { userId } = router.query;
  const { mutate, isLoading } = useMutation(`/api/reset-password/${userId}`);

  return { resetPassword: mutate, isLoading };
}
