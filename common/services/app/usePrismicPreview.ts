import { useEffect } from 'react';

import {
  PrismicData,
  SimplifiedPrismicData,
} from '@weco/common/server-data/prismic';

declare global {
  interface Window {
    prismic: PrismicData | SimplifiedPrismicData | { endpoint: string };
  }
}

const usePrismicPreview = (shouldDisplay: () => boolean): void =>
  useEffect(() => {
    if (shouldDisplay()) {
      window.prismic = {
        endpoint: 'https://wellcomecollection.cdn.prismic.io/api/v2',
      };
      const prismicScript = document.createElement('script');
      prismicScript.src = '//static.cdn.prismic.io/prismic.min.js';
      document.head && document.head.appendChild(prismicScript);
      (function () {
        const validationBar = document.createElement('div');
        validationBar.style.position = 'fixed';
        validationBar.style.width = '375px';
        validationBar.style.padding = '15px';
        validationBar.style.background = '#e01b2f';
        validationBar.style.color = '#ffffff';
        validationBar.style.bottom = '0';
        validationBar.style.right = '0';
        validationBar.style.fontSize = '12px';
        validationBar.style.zIndex = '2147483000';

        const validationFails: string[] = [];

        const descriptionEl = document.querySelector(
          'meta[name="description"]'
        );
        if (descriptionEl && !descriptionEl.getAttribute('content')) {
          validationFails.push(`
            <b>Warning:</b>
            This piece of content is missing its description.
            This helps with search engine results and sharing on social channels.
            (If this is from Prismic, it's the promo text).
          `);
        }

        const imageEl = document.querySelector('meta[property="og:image"]');
        if (imageEl && !imageEl.getAttribute('content')) {
          validationFails.push(`
            <b>Warning:</b>
            This piece of content is missing its promo image.
            This is the image that will be shown across our site,
            as well as on social media.
          `);
        }

        if (validationFails.length > 0) {
          validationFails.forEach(function (validationFail) {
            const div = document.createElement('div');
            div.style.marginBottom = '6px';
            div.innerHTML = validationFail;
            validationBar.appendChild(div);
          });
          document.body && document.body.appendChild(validationBar);
        }
      })();
    }
  }, []);

export default usePrismicPreview;
