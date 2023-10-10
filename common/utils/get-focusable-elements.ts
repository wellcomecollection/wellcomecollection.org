// https://gomakethings.com/how-to-get-the-first-and-last-focusable-elements-in-the-dom/
function getFocusableElements<E extends Element = Element>(
  el: HTMLElement,
  keepNegativeTabIndex?: boolean
): E[] {
  const selectors = keepNegativeTabIndex
    ? 'button:not([disabled]), input, select, textarea, [role=slider]'
    : 'button:not([disabled]), [href]:not([tabindex="-1"]), input, select, textarea, [tabindex]:not([tabindex="-1"]), [role=slider]';
  return [...el.querySelectorAll<E>(selectors)];
}

export default getFocusableElements;
