// https://gomakethings.com/how-to-get-the-first-and-last-focusable-elements-in-the-dom/
// The keepNegativeTabIndex paramater is for the downloads Dropdown button in the viewer
// When a canvas changes in the viewer, some of the download links update to point to the current canvas
// But the whole item link does not need to
// As a result it already has a tabIndex=-1 when the dropdown is collapsed and gets excluded by getFocusableElements the next time it runs
// We therefore pass in the keepNegativeTabIndex value set to true to prevent this from happening
function getFocusableElements<E extends Element = Element>(
  el: HTMLElement,
  keepNegativeTabIndex?: boolean
): E[] {
  const selectors = keepNegativeTabIndex
    ? 'button:not([disabled]), [href], input, select, textarea, [tabindex], [role=slider]'
    : 'button:not([disabled]), [href]:not([tabindex="-1"]), input, select, textarea, [tabindex]:not([tabindex="-1"]), [role=slider]';
  return [...el.querySelectorAll<E>(selectors)];
}

export default getFocusableElements;
