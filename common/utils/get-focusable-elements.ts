// https://gomakethings.com/how-to-get-the-first-and-last-focusable-elements-in-the-dom/
const getFocusableElements = (el: HTMLElement): Element[] => {
  return [
    ...el.querySelectorAll(
      'button, [href]:not([tabindex="-1"]), input, select, textarea, [tabindex]:not([tabindex="-1"]), [role=slider]'
    ),
  ];
};

export default getFocusableElements;
