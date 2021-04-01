import { useState, useEffect } from 'react';
import theme, { Size } from '../views/themes/default';

export function getScreenSize(): Size {
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
export default function useWindowSize(
  initialSize: Size | undefined = 'small'
): string {
  const [size, setSize] = useState<Size>(initialSize);
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
