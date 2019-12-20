// @flow

import { useEffect, type ElementRef } from 'react';

type TrapElRef = {|
  current: ElementRef<any>,
|};

const useFocusTrap = (startRef: ?TrapElRef, endRef: ?TrapElRef) => {
  function handleTrapStartKeyDown(event) {
    if (event.shiftKey && event.key === 'Tab') {
      console.log(event);
      event.preventDefault();
      endRef && endRef.current && endRef.current.focus();
    }
  }

  function handleTrapEndKeyDown(event) {
    if (!event.shiftKey && event.key === 'Tab') {
      event.preventDefault();
      startRef && startRef.current && startRef.current.focus();
    }
  }

  useEffect(() => {
    const startEl = startRef && startRef.current;
    const endEl = endRef && endRef.current;

    startEl && startEl.addEventListener('keydown', handleTrapStartKeyDown);
    endEl && endEl.addEventListener('keydown', handleTrapEndKeyDown);

    return () => {
      startEl && startEl.removeEventListener('keydown', handleTrapStartKeyDown);
      endEl && endEl.addEventListener('keydown', handleTrapEndKeyDown);
    };
  }, [startRef, endRef]);
};

export default useFocusTrap;
