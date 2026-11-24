import { RefObject, useEffect, useRef } from 'react';

// Text fields, selects and the like use the arrow keys themselves
const usesArrowKeys = (element: Element): boolean =>
  element instanceof HTMLElement &&
  (element.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName));

/**
 * Left and Right step to the previous and next image, pressed in the sidebar,
 * in `areaRef` (e.g. the results grid), or with focus nowhere in particular.
 * They step by clicking the buttons, so they use whatever step handlers those
 * have now rather than the ones from when the listener was added.
 *
 * Returns what had focus when the key was pressed, which the buttons' click
 * handler can't see for itself, as the click came from here. Reading it
 * clears it.
 */
const useArrowKeySteps = ({
  isActive,
  sidebarRef,
  areaRef,
  previousButtonRef,
  nextButtonRef,
}: {
  isActive: boolean;
  sidebarRef: RefObject<HTMLElement | null>;
  areaRef?: RefObject<HTMLElement | null>;
  previousButtonRef: RefObject<HTMLButtonElement | null>;
  nextButtonRef: RefObject<HTMLButtonElement | null>;
}) => {
  const focusAtKeyPress = useRef<HTMLElement | null>(null);

  // Modifiers are left alone, as Alt+ArrowLeft is the browser's Back; the
  // resize handle's onKeyDown runs first and preventDefaults, stopping a step
  useEffect(() => {
    if (!isActive) return;

    const stepOnArrowKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target as Element;
      const isInArea =
        target === document.body ||
        sidebarRef.current?.contains(target) ||
        areaRef?.current?.contains(target);
      if (!isInArea || usesArrowKeys(target)) return;

      // Swallowed at either end too, so the page doesn't scroll instead
      event.preventDefault();

      // Not clicked at either end, as no image is stepped to
      const button =
        event.key === 'ArrowLeft'
          ? previousButtonRef.current
          : nextButtonRef.current;
      if (!button || button.getAttribute('aria-disabled') === 'true') return;

      focusAtKeyPress.current = target as HTMLElement;
      button.click();
    };
    document.addEventListener('keydown', stepOnArrowKey);
    return () => document.removeEventListener('keydown', stepOnArrowKey);
  }, [isActive]);

  return (): HTMLElement | null => {
    const focused = focusAtKeyPress.current;
    focusAtKeyPress.current = null;
    return focused;
  };
};

export default useArrowKeySteps;
