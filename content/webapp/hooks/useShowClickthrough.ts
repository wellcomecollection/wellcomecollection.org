import { useEffect, useState } from 'react';

import { isObject } from '@weco/common/utils/type-guards';
import { TransformedAuthService } from '@weco/content/utils/iiif/v3';

const useShowClickthrough = (
  clickThroughService: TransformedAuthService | undefined,
  tokenService: string | undefined
): boolean => {
  const [showClickthrough, setShowClickthrough] = useState(false);

  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      const data = event.data;
      const serviceOrigin = tokenService && new URL(tokenService);
      if (serviceOrigin && serviceOrigin.origin === event.origin) {
        // The token service posts either an access token or, on failure, an
        // error payload. Anything that isn't an object at all is malformed, so
        // we ignore it rather than treating it as a failure: reading a property
        // off null or undefined would throw, and re-showing the clickthrough
        // would undo a successful authentication.
        if (!isObject(data)) return;

        if ('accessToken' in data) {
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
