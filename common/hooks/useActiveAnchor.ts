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

    // We ignore the passed element from the IntersectionObserver, as there are situations
    // like on initial call where we must still consider the other elements as candidates,
    // in this case it is simpler to perform the check each time a candidate is observed.
    const updateActive = () => {
      // Consider all elements whose top is visible or above the viewport (but whose bottom is below the top)
      // This ensures that when scrolling up, the previous section becomes active as soon as its top crosses into view
      let bestId: string | null = null;
      let minDelta = Number.POSITIVE_INFINITY;
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // Section is considered if its top is above the viewport but its bottom is below the top (partially visible or just above)
        if (rect.top <= 0 && rect.bottom > 0) {
          const delta = Math.abs(rect.top);
          if (delta < minDelta) {
            minDelta = delta;
            bestId = el.id;
          }
        }
        // If no such section, fallback to the first section whose top is visible
        else if (!bestId && rect.top >= 0 && rect.top < window.innerHeight) {
          minDelta = rect.top;
          bestId = el.id;
        }
      });

      setActiveId(bestId);
    };

    const observer = new IntersectionObserver(updateActive, {
      root: document,
      rootMargin: '-50px',
    });

    elements.forEach(el => observer!.observe(el));

    return () => {
      if (observer) {
        elements.forEach(el => observer.unobserve(el));
        observer.disconnect();
      }
    };
  }, [ids.join(',')]);

  return activeId;
}
