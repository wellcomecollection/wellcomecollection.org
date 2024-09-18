import { useEffect, useState } from 'react';

import { TransformedAuthService } from '@weco/content/utils/iiif/v3';

const useShowClickthrough = (
  clickThroughService: TransformedAuthService | undefined,
  tokenService: TransformedAuthService | undefined
): boolean => {
  const [showClickthrough, setShowClickthrough] = useState(false);

  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      const data = event.data;
      const serviceOrigin = tokenService && new URL(tokenService.id);
      if (
        serviceOrigin &&
        `${serviceOrigin.protocol}//${serviceOrigin.hostname}` === event.origin
      ) {
        if (Object.prototype.hasOwnProperty.call(data, 'accessToken')) {
          setShowClickthrough(false);
        } else {
          setShowClickthrough(true);
        }
      }
    }

    if (clickThroughService) {
      setShowClickthrough(true);
      window.addEventListener('message', receiveMessage);
      return () => window.removeEventListener('message', receiveMessage);
    } else {
      setShowClickthrough(false);
    }
  }, []);

  return showClickthrough;
};

export default useShowClickthrough;
