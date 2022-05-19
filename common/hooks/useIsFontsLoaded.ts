import { useEffect, useState } from 'react';

const useIsFontsLoaded = (isInter?: boolean): boolean => {
  const [isFontsLoaded, setIsFontsLoaded] = useState(false);
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    let isMounted = true;
    // This needs to be dynamically required as it's only on the client-side
    /* eslint-disable @typescript-eslint/no-var-requires */
    const FontFaceObserver = require('fontfaceobserver');
    /* eslint-enable @typescript-eslint/no-var-requires */

    const WB = new FontFaceObserver('Wellcome Bold Web', { weight: 'bold' });
    const HNR = new FontFaceObserver('Helvetica Neue Roman Web');
    const HNB = new FontFaceObserver('Helvetica Neue Bold Web');
    const LR = new FontFaceObserver('Lettera Regular Web');

    const fonts = [WB, LR].concat(isInter ? [] : [HNR, HNB]);

    Promise.all(fonts.map(font => font.load(null)))
      .then(() => {
        if (isMounted) {
          setIsFontsLoaded(true);
        }
      })
      .catch(console.error);
    return () => {
      // We can't cancel promises, so using the isMounted value to prevent the component from trying to update the state if it's been unmounted.
      isMounted = false;
    };
  }, []);

  return isFontsLoaded;
};

export default useIsFontsLoaded;
