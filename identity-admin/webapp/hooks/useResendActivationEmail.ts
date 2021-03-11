import { useRouter } from 'next/router';
import { useMutation } from './useMutation';

type ResendActivationEmailMutation = {
  isLoading: boolean;
  resendActivationEmail: () => Promise<void>;
};

export function useResendActivationEmail(): ResendActivationEmailMutation {
  const router = useRouter();
  const { userId } = router.query;
  const { mutate, isLoading } = useMutation(
    `/api/resend-activation-email/${userId}`
  );

  return { resendActivationEmail: mutate, isLoading };
}
