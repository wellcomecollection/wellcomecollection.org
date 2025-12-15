import { useEffect } from 'react';

import { dasherize } from '@weco/common/utils/grammar';

/**
 * Wraps h2 elements and their subsequent siblings in section tags with data-id attributes.
 * This ensures continuous section coverage for the useActiveAnchor hook to track.
 *
 * The hook finds all h2 elements within a container, then wraps each h2 and all following
 * elements (until the next h2) in a <section data-id="..."> tag. This fills gaps where
 * content exists without section wrappers.
 *
 * @param containerRef - Ref to the container element to search within
 * @param enabled - Whether to enable the section wrapping (default: true)
 */
export function useSectionWrappers(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    // Get all direct children of the container (these are the slice wrapper divs)
    const slices = Array.from(container.children);

    if (slices.length === 0) return;

    // Find slices that contain h2 elements
    const slicesWithH2 = slices
      .map((slice, index) => {
        const h2 = slice.querySelector('h2');
        if (!h2) return null;

        // Get the data-id from the h2's id attribute or text content
        const dataId =
          (h2 as HTMLElement).id || dasherize(h2.textContent || '');

        return dataId ? { slice, index, dataId } : null;
      })
      .filter(
        (item): item is { slice: Element; index: number; dataId: string } =>
          item !== null
      );

    if (slicesWithH2.length === 0) return;

    // For each h2-containing slice, wrap it and subsequent slices until the next h2
    slicesWithH2.forEach((current, i) => {
      const nextH2Index = slicesWithH2[i + 1]?.index;
      const endIndex = nextH2Index !== undefined ? nextH2Index : slices.length;

      // Get all slices from current to next h2 (or end)
      const slicesToWrap = slices.slice(current.index, endIndex);

      // Skip if already wrapped in an outer section with data-wrapper
      if (
        slicesToWrap[0].parentElement?.closest('section[data-wrapper="true"]')
      ) {
        return;
      }

      // Create a wrapper section
      const wrapperSection = document.createElement('section');
      wrapperSection.setAttribute('data-id', current.dataId);
      wrapperSection.setAttribute('data-wrapper', 'true'); // Mark as wrapper for cleanup

      // Add a custom class for spacing between wrapper sections
      // Using a stable class name that matches the SpacingComponent spacing behaviour
      wrapperSection.classList.add('section-wrapper-spacing');

      // Insert the wrapper before the first slice
      const parent = slicesToWrap[0].parentElement;
      if (parent) {
        parent.insertBefore(wrapperSection, slicesToWrap[0]);

        // Move all slices into the wrapper
        slicesToWrap.forEach(slice => {
          wrapperSection.appendChild(slice);
        });
      }
    });

    // Cleanup function to unwrap sections when component unmounts
    return () => {
      if (!containerRef.current) return;

      // Only remove wrapper sections (marked with data-wrapper attribute)
      const wrapperSections = Array.from(
        containerRef.current.querySelectorAll('section[data-wrapper="true"]')
      );

      wrapperSections.forEach(section => {
        if (section.parentElement) {
          const parent = section.parentElement;
          const children = Array.from(section.children);

          // Insert all children before the section
          children.forEach(child => {
            parent.insertBefore(child, section);
          });

          // Remove the wrapper section
          section.remove();
        }
      });
    };
  }, [containerRef, enabled]);
}
