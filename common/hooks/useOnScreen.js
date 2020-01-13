import { useEffect, useState } from 'react';

export default function useOnScreen({
  ref,
  root = null,
  rootMargin = '0px',
  threshold = 0,
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
}
