// @flow

// https://gomakethings.com/how-to-get-the-first-and-last-focusable-elements-in-the-dom/
export default (el: HTMLElement): HTMLElement[] => {
  return [
    ...el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ),
  ];
};
