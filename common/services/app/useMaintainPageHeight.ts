import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useMaintainPageHeight = (): void => {
  const router = useRouter();
  return useEffect(() => {
    const pageHeights: number[] = [];
    const htmlElement = document.querySelector('html');

    const handleRouteChangeStart = () => {
      const offsetHeight = document?.documentElement?.offsetHeight;
      if (offsetHeight) {
        pageHeights.push(offsetHeight);
      }
    };
    const handleRouteChangeComplete = () => {
      if (htmlElement) {
        htmlElement.style.height = 'initial';
      }
    };
    const handleBeforePopState = () => {
      if (htmlElement && pageHeights.length !== 0) {
        htmlElement.style.height = `${pageHeights.pop()}px`;
      }
      return true;
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.beforePopState(handleBeforePopState);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);
};

export default useMaintainPageHeight;
