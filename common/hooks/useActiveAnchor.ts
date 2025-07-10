import { useEffect, useState } from 'react';

import { isNotNull, isNotUndefined } from '@weco/common/utils/type-guards';
/**
 * Tracks which intersecting element (by id) is closest to the top of the viewport.
 * @param ids Array of element ids to observe
 * @returns The id of the intersecting section with the highest boundingClientRect.top
 */
export function useActiveAnchor(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!ids.length) return;

    // Track ids of currently intersecting elements
    const intersectingIds = new Set();

    const sections = ids
      .map(id => document.getElementById(id)?.closest('section'))
      .filter(isNotNull)
      .filter(isNotUndefined);

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        intersectingIds[entry.isIntersecting ? 'add' : 'delete'](
          (entry.target as HTMLElement)?.dataset.id
        );
      });

      const sectionTops = [...intersectingIds]
        .map(i => {
          const section = sections.find(section => section?.dataset.id === i);
          const top = section?.getBoundingClientRect().top;
          return section?.dataset.id && top !== undefined
            ? {
                id: section?.dataset.id,
                top,
              }
            : undefined;
        })
        .filter(isNotUndefined)
        .filter(isNotNull);

      // Sort to get the element that is currently intersecting and has the highest `boundingClientRect.top`
      const activeSection = sectionTops.sort((a, b) => a.top - b.top)?.[0];
      setActiveId(activeSection?.id);
    });

    sections.forEach(section => sectionObserver.observe(section));

    return () => {
      if (sectionObserver) {
        sections.forEach(section => sectionObserver.unobserve(section));
        sectionObserver.disconnect();
      }
    };
  }, [ids.join(',')]);

  return activeId;
}
