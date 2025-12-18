import { useEffect, useState } from 'react';

import { isNotNull } from '@weco/common/utils/type-guards';

/**
 * Tracks which intersecting element (by id) is closest to the top of the viewport.
 * @param ids Array of element ids to observe
 * @returns The id of the intersecting section with the highest boundingClientRect.top
 */
export function useActiveAnchor(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!ids.length) return;

    // Find the elements corresponding to the IDs
    const anchorElements = ids
      .map(id => document.getElementById(id))
      .filter(isNotNull);

    // Find the slice wrappers (containers of the content)
    // We look for elements with the 'data-slice-type' attribute
    // or fallback to 'section' tags if not found.
    const sliceWrappers = anchorElements
      .map(
        element =>
          element.closest('[data-slice-type]') || element.closest('section')
      )
      .filter(isNotNull);

    // We assume all slices are siblings within the same container
    const container = sliceWrappers[0]?.parentElement;

    if (!container) return;

    // Map each slice (child of container) to the active ID
    const elementIdMap = new Map<Element, string>();

    let currentId: string | null = null;
    Array.from(container.children).forEach(child => {
      const element = child as HTMLElement;

      // Check if this element corresponds to a new ID
      // 1. Check data-id attribute (used by some slices like Text)
      let foundId = ids.find(id => element.dataset.id === id);

      if (!foundId) {
        // 2. Check if any of the IDs is inside this element
        foundId = ids.find(id => {
          const target = document.getElementById(id);
          return target && element.contains(target);
        });
      }

      if (foundId) {
        currentId = foundId;
      }

      if (currentId) {
        elementIdMap.set(element, currentId);
      }
    });

    const intersectingElements = new Set<Element>();

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          intersectingElements.add(entry.target);
        } else {
          intersectingElements.delete(entry.target);
        }
      });

      const activeElement = [...intersectingElements]
        .map(element => ({
          element,
          top: element.getBoundingClientRect().top,
          id: elementIdMap.get(element),
        }))
        .filter(item => item.id !== undefined)
        .sort((a, b) => a.top - b.top)?.[0];

      setActiveId(activeElement?.id || null);
    });

    elementIdMap.forEach((_, element) => sectionObserver.observe(element));

    return () => {
      sectionObserver.disconnect();
    };
  }, [ids.join(',')]);

  return activeId;
}
