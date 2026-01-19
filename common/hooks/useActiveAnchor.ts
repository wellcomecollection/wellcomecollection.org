import { useEffect, useState } from 'react';

import { isNotNull } from '@weco/common/utils/type-guards';

/**
 * Tracks which intersecting element (by id) is closest to the top of the viewport.
 * @param ids Array of element ids to observe
 * @param rootMargin Optional root margin for the intersection observer (e.g., '-50px 0px 0px 0px')
 * @returns The id of the intersecting section with the highest boundingClientRect.top
 */
export function useActiveAnchor(
  ids: string[],
  rootMargin?: string
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!ids.length) return;

    // Find the elements corresponding to the IDs
    const anchorElements = ids
      .map(id => {
        const element = document.getElementById(id);
        if (!element && process.env.NODE_ENV === 'development') {
          console.warn(
            `useActiveAnchor: Element with id "${id}" not found in the DOM`
          );
        }
        return element;
      })
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

    // Get unique containers from all slice wrappers
    const containers = [
      ...new Set(
        sliceWrappers.map(wrapper => wrapper.parentElement).filter(isNotNull)
      ),
    ];

    if (!containers.length) return;

    // Create a map of id to element once to avoid repeated DOM queries
    const idToElementMap = new Map(
      anchorElements.map((element, index) => [ids[index], element])
    );

    // Map each slice (child of container) to the active ID
    const elementIdMap = new Map<Element, string>();

    // Process all containers
    containers.forEach(container => {
      let currentId: string | null = null;
      Array.from(container.children).forEach(child => {
        const element = child as HTMLElement;

        const foundId = ids.find(id => {
          const target = idToElementMap.get(id);
          return target && element.contains(target);
        });

        if (foundId) {
          currentId = foundId;
        }

        if (currentId) {
          elementIdMap.set(element, currentId);
        }
      });
    });

    const intersectingElements = new Set<Element>();

    const sectionObserver = new IntersectionObserver(
      entries => {
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
      },
      rootMargin ? { rootMargin } : undefined
    );

    elementIdMap.forEach((_, element) => sectionObserver.observe(element));

    return () => {
      sectionObserver.disconnect();
    };
  }, [ids.join(','), rootMargin]);

  return activeId;
}
