import { RefObject, useEffect, useState } from 'react';

type UseOnScreenProps = {
  ref?: RefObject<HTMLDivElement>;
  root?: HTMLDivElement;
  threshold: number[];
};

export default function useOnScreen({
  ref,
  root,
  threshold,
}: UseOnScreenProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const rootMargin = '0px';
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const midPointOfRoot =
            entry.rootBounds!.top + entry.rootBounds!.height / 2;
          const targetTop = entry.boundingClientRect.top;
          const targetBottom = entry.boundingClientRect.bottom;
          const topPassedMidPoint = targetTop < midPointOfRoot;
          const bottomPassedMidPoint = targetBottom < midPointOfRoot;
          if (topPassedMidPoint && !bottomPassedMidPoint) {
            setIsIntersecting(true);
          }
          if (topPassedMidPoint && bottomPassedMidPoint) {
            setIsIntersecting(false);
          }
        } else {
          setIsIntersecting(false);
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );
    if (ref && ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
}
