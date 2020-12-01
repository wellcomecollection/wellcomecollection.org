import { useEffect, useState } from 'react';
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hj: any;
  }
}
async function renderScript() {
  return new Promise<boolean>(resolve => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    resolve(true);
  });
}

const heatMapTrigger = (): void => {
  // Use heatmaps if page cannot be determinted by url. e.g archive page.
  // https://help.hotjar.com/hc/en-us/articles/115011867948
  try {
    window.hj('trigger', 'archives_heatmap_trigger');
  } catch (e) {}
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useHotjar = (shouldRender: boolean) => {
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    if (shouldRender && !rendered) {
      renderScript().then(() => {
        setRendered(true);
        heatMapTrigger(); // trigger this on first load
      });
    }

    if (rendered) {
      heatMapTrigger(); // trigger this if script has already been inserted.
    }
  }, []);
};

export default useHotjar;
