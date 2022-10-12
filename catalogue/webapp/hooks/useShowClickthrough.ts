import { useEffect, useState } from 'react';
import {
  AuthService,
  AuthServiceService,
} from '../services/iiif/types/manifest/v2';

const useShowClickthrough = (
  authService: AuthService | undefined,
  tokenService: AuthServiceService | undefined
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

    if (authService) {
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
