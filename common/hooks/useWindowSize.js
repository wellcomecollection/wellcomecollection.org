import { useState, useEffect } from 'react';
import theme from '@weco/common/views/themes/default';

export default function useWindowSize() {
  const [size, setSize] = useState('large');

  function updateSize() {
    switch (true) {
      case window.innerWidth < theme.sizes.medium:
        setSize('small');
        break;
      case window.innerWidth < theme.sizes.large:
        setSize('medium');
        break;
      case window.innerWidth < theme.sizes.xlarge:
        setSize('large');
        break;
      default:
        setSize('xlarge');
    }
  }
  useEffect(() => {
    window.addEventListener('resize', updateSize);

    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
