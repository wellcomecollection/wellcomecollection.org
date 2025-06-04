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

    // If no elements found, exit early
    if (!elements.length) return;

    // Map to keep track of elements whose top is visible in the viewport
    let observer: IntersectionObserver | null = null;

    const updateActive = ([el]) => {
      if (el.boundingClientRect.top < 50) {
        setActiveId(el.target.id);
      }
    };

    observer = new IntersectionObserver(updateActive, {
      root: document,
      rootMargin: '-50px',
    });

    elements.forEach(el => observer.observe(el));
    // Initial update
    setTimeout(updateActive, 0);

    return () => {
      if (observer) {
        elements.forEach(el => observer.unobserve(el));
        observer.disconnect();
      }
    };
  }, [ids.join(',')]);

  return activeId;
}
