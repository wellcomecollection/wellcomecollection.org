import { useState, useEffect } from 'react';
import theme from '../views/themes/default';

type ScreenSize = 'small' | 'medium' | 'large' | 'xlarge';
export function getScreenSize(): ScreenSize {
  switch (true) {
    case window.innerWidth < theme.sizes.medium:
      return 'small';
    case window.innerWidth < theme.sizes.large:
      return 'medium';
    case window.innerWidth < theme.sizes.xlarge:
      return 'large';
    default:
      return 'xlarge';
  }
}
export default function useWindowSize(): string {
  const [size, setSize] = useState('small');
  useEffect(() => {
    function updateSize() {
      setSize(getScreenSize());
    }
    window.addEventListener('resize', updateSize);
    setSize(getScreenSize());

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
