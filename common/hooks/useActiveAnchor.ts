import { useEffect, useState } from 'react';

/**
 * Tracks which element (by id) is closest to the top of the viewport.
 * @param ids Array of element ids to observe
 * @returns The id of the element closest to the top of the viewport
 */
export function useActiveAnchor(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!ids.length) return;
    const elements = ids
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    let ticking = false;
    let lastActiveId: string | null = null;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Only consider elements that are at least partially visible in the viewport
          const visibleElements = elements.filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < window.innerHeight;
          });

          let closestId: string | null = null;
          let minDistance = Number.POSITIVE_INFINITY;

          visibleElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const distance = Math.abs(rect.top);
            if (distance < minDistance) {
              minDistance = distance;
              closestId = el.id;
            }
          });
          if (closestId !== lastActiveId) {
            setActiveId(closestId);
            lastActiveId = closestId;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ids.join(',')]);

  return activeId;
}