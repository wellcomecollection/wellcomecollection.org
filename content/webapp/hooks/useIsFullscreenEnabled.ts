import { useEffect, useState } from 'react';

const useIsFullscreenEnabled = (): boolean => {
  const [isFullscreenEnabled, setIsFullscreenEnabled] = useState(false);

  useEffect(() => {
    setIsFullscreenEnabled(
      document?.fullscreenEnabled || document?.['webkitFullscreenEnabled']
    );
  }, []);

  return isFullscreenEnabled;
};

export default useIsFullscreenEnabled;
