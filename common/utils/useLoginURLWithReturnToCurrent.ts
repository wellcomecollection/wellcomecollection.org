import { useRouter } from 'next/router';

export const useLoginURLWithReturnToCurrent = (): string => {
  const router = useRouter();
  // This is perhaps overly defensive, but it does make testing easier
  // as we don't need to provide the full NextJS context
  if (!router?.asPath) {
    return '/account/api/auth/login';
  }
  return `/account/api/auth/login?returnTo=${router.asPath}`;
};
