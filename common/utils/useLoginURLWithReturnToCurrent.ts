import { useRouter } from 'next/router';

export const useLoginURLWithReturnToCurrent = (): string => {
  const router = useRouter();
  return `/account/api/auth/login?returnTo=${router.asPath}`;
};
