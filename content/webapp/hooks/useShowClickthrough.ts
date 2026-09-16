import { useEffect, useState } from 'react';

import {
  readTokenServiceMessage,
  TransformedAuthService,
} from '@weco/content/utils/iiif/v3';

const useShowClickthrough = (
  clickThroughService: TransformedAuthService | undefined,
  tokenService: string | undefined
): boolean => {
  const [showClickthrough, setShowClickthrough] = useState(false);

  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      const message = readTokenServiceMessage(event, tokenService);
      if (!message) return;

      setShowClickthrough(!message.hasAccessToken);
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
