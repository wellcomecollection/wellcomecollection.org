import { useEffect, RefObject } from 'react';

const useFocusTrap = (
  startRef: RefObject<HTMLButtonElement> | RefObject<HTMLDivElement>,
  endRef: RefObject<HTMLButtonElement> | RefObject<HTMLInputElement>
) => {
  function handleTrapStartKeyDown(event) {
    if (event.shiftKey && event.key === 'Tab') {
      event.preventDefault();
      endRef.current && endRef.current.focus();
    }
  }

  function handleTrapEndKeyDown(event) {
    if (!event.shiftKey && event.key === 'Tab') {
      event.preventDefault();
      startRef.current && startRef.current.focus();
    }
  }

  useEffect(() => {
    const startEl = startRef.current;
    const endEl = endRef.current;

    startEl && startEl.addEventListener('keydown', handleTrapStartKeyDown);
    endEl && endEl.addEventListener('keydown', handleTrapEndKeyDown);

    return () => {
      startEl && startEl.removeEventListener('keydown', handleTrapStartKeyDown);
      endEl && endEl.removeEventListener('keydown', handleTrapEndKeyDown);
    };
  }, [startRef.current, endRef.current]);
};

export default useFocusTrap;
