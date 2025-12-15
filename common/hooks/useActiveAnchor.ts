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
    let sectionObserver: IntersectionObserver | null = null;
    let observedSections: Element[] = [];

    const setupObserver = () => {
      // Get sections - they might be created dynamically
      const sections = ids
        .map(id => document.getElementById(id)?.closest('section'))
        .filter(isNotNull)
        .filter(isNotUndefined);

      // If no sections found yet, return false to indicate we should try again
      if (sections.length === 0) return false;

      // Clean up existing observer if any
      if (sectionObserver) {
        observedSections.forEach(section =>
          sectionObserver?.unobserve(section)
        );
      }

      observedSections = sections;

      sectionObserver = new IntersectionObserver(entries => {
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

      sections.forEach(section => sectionObserver?.observe(section));
      return true;
    };

    // Try to set up the observer immediately
    const setupSuccess = setupObserver();

    // If sections don't exist yet, use MutationObserver to watch for them
    let mutationObserver: MutationObserver | null = null;
    if (!setupSuccess) {
      mutationObserver = new MutationObserver(() => {
        const success = setupObserver();
        if (success && mutationObserver) {
          mutationObserver.disconnect();
          mutationObserver = null;
        }
      });

      // Watch the body for added sections
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (sectionObserver) {
        observedSections.forEach(section =>
          sectionObserver?.unobserve(section)
        );
        sectionObserver.disconnect();
      }
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
    };
  }, [ids.join(',')]);

  return activeId;
}
