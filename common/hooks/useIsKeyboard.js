import { useEffect, useState } from 'react';

const useIsKeyboard = () => {
  const [isKeyboard, setIsKeyboard] = useState(true);

  function setIsKeyboardTrue() {
    setIsKeyboard(true);
  }

  function setIsKeyboardFalse(event) {
    setIsKeyboard(false);
  }

  useEffect(() => {
    document.addEventListener('mousedown', setIsKeyboardFalse);
    document.addEventListener('keydown', setIsKeyboardTrue);

    return () => {
      document.removeEventListener('keydown', setIsKeyboardTrue);
      document.removeEventListener('mousedown', setIsKeyboardFalse);
    };
  });

  return isKeyboard;
};

export default useIsKeyboard;
