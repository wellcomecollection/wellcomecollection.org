import { useEffect, useState } from 'react';

function renderScript() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log('hello world');
  (function(h: any, o, t, j, a, r) {
    h.hj =
      h.hj ||
      function() {
        // eslint-disable-next-line prefer-rest-params
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = { hjid: 3858, hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script');
    r.async = true;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');
}

const useHotjar = (shouldRender: boolean): void => {
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    if (shouldRender && !rendered) {
      renderScript();
      setRendered(true);
    }
  }, []);
};

export default useHotjar;
