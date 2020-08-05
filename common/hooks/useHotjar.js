import { useEffect, useContext } from 'react';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';

const useHotjar = () => {
  const { isHotjarActive } = useContext(TogglesContext);

  useEffect(() => {
    isHotjarActive &&
      (function(h, o, t, j, a, r) {
        h.hj =
          h.hj ||
          function() {
            (h.hj.q = h.hj.q || []).push(arguments);
          };
        h._hjSettings = { hjid: 3858, hjsv: 6 };
        a = o.getElementsByTagName('head')[0];
        r = o.createElement('script');
        r.async = true;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');
  }, []);
};

export default useHotjar;
