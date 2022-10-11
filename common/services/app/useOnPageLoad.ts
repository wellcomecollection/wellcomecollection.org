import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useOnPageLoad = (handlePageLoad: (url: string) => void): void => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      const url = window.location.pathname + window.location.search;
      handlePageLoad(url);
    };

    handleRouteChangeComplete();
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events]);
};
