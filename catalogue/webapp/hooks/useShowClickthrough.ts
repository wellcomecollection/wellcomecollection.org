import { useEffect, useState } from 'react';
import { AuthClickThroughServiceWithPossibleServiceArray } from '../types/manifest';
import { AuthAccessTokenService } from '@iiif/presentation-3';

const useShowClickthrough = (
  clickThroughService:
    | AuthClickThroughServiceWithPossibleServiceArray
    | undefined,
  tokenService: AuthAccessTokenService | undefined
): boolean => {
  const [showClickthrough, setShowClickthrough] = useState(false);

  useEffect(() => {
    function receiveMessage(event) {
      const data = event.data;
      const serviceOrigin = tokenService && new URL(tokenService['@id']);
      if (
        serviceOrigin &&
        `${serviceOrigin.protocol}//${serviceOrigin.hostname}` === event.origin
      ) {
        if (data.hasOwnProperty('accessToken')) {
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
