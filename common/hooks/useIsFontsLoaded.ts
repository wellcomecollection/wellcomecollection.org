import { useEffect, useState } from 'react';

const useIsFontsLoaded = (): boolean => {
  const [isFontsLoaded, setIsFontsLoaded] = useState(false);
  useEffect(() => {
    let isMounted = true;
    // This needs to be dynamically required as it's only on the client-side
    /* eslint-disable @typescript-eslint/no-var-requires */
    const FontFaceObserver = require('fontfaceobserver');
    /* eslint-enable @typescript-eslint/no-var-requires */

    const WB = new FontFaceObserver('Wellcome Bold Web', { weight: 'bold' });
    const HNR = new FontFaceObserver('Helvetica Neue Roman Web');
    const HNB = new FontFaceObserver('Helvetica Neue Bold Web');
    const LR = new FontFaceObserver('Lettera Regular Web');

    Promise.all([WB.load(), HNR.load(), HNB.load(), LR.load()])
      .then(() => {
        if (isMounted) {
          setIsFontsLoaded(true);
        }
      })
      .catch(console.log);
    return () => {
      isMounted = false;
    };
  }, []);

  return isFontsLoaded;
};

export default useIsFontsLoaded;
