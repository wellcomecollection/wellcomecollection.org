import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

/** The URL without its hash: what has to change for it to be another page. */
const pagePath = (url: string) => url.split('#')[0];

const RESTART_EVENT = 'wc:restart-scroll-tracking';

const freshThresholds = () => ({
  tracked25: false,
  tracked50: false,
  tracked75: false,
  tracked90: false,
});

/** Starts the count again where the content changes but the URL doesn't. */
export const restartScrollTracking = () =>
  window.dispatchEvent(new Event(RESTART_EVENT));

/**
 * Sends a `wc_scroll_depth` event the first time the person scrolls past 25,
 * 50, 75 and 90% of a page, once each per page they view.
 *
 * A page is its path and query, so anything that changes either is a new one.
 * The hash alone isn't: it marks a place or a state within the page, like
 * which image is open on the image results.
 */
export function useScrollTracking() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    let scrollState = freshThresholds();

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableDistance = documentHeight - windowHeight;

      if (scrollableDistance <= 0) return;

      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / scrollableDistance) * 100;

      const thresholds = [
        { value: 25, key: 'tracked25' as const },
        { value: 50, key: 'tracked50' as const },
        { value: 75, key: 'tracked75' as const },
        { value: 90, key: 'tracked90' as const },
      ];

      thresholds.forEach(({ value, key }) => {
        if (scrollPercentage >= value && !scrollState[key]) {
          scrollState[key] = true;

          window.dataLayer?.push({
            event: 'wc_scroll_depth',
            wc_scroll_depth_threshold: value,
          });
        }
      });
    };

    const debouncedHandleScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });

    let currentPath = pagePath(router.asPath);

    const handleRouteChange = (url: string) => {
      if (pagePath(url) === currentPath) return;

      currentPath = pagePath(url);
      scrollState = freshThresholds();
    };

    const handleRestart = () => {
      scrollState = freshThresholds();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    window.addEventListener(RESTART_EVENT, handleRestart);

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
      window.removeEventListener(RESTART_EVENT, handleRestart);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [router.events]);
}
