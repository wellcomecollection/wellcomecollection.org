// https://gomakethings.com/how-to-get-the-first-and-last-focusable-elements-in-the-dom/
function getFocusableElements<E extends Element = Element>(
  el: HTMLElement
): E[] {
  return [
    ...el.querySelectorAll<E>(
      'button:not([disabled]), [href]:not([tabindex="-1"]), input, select, textarea, [tabindex]:not([tabindex="-1"]), [role=slider]'
    ),
  ];
}

export default getFocusableElements;
