/* global fetch */
import contentSlider from './content-slider';
import shrinkStoriesNav from './shrink-stories-nav';

export default function asyncContent(el, dispatch) {
  const component = el.getAttribute('data-component');

  return fetch(el.getAttribute('data-endpoint')).then(resp => resp.json()).then(json => {
    el.outerHTML = json.html;

    if (component === 'series-nav') {
      const seriesSlider = document.querySelector('.js-numbered-slider');
      const seriesNav = document.querySelector('.js-series-nav');

      if (seriesSlider) {
        contentSlider(seriesSlider, {
          transitionSpeed: 0.7,
          cssPrefix: 'numbered-list__'
        });
      }

      if (seriesNav) {
        shrinkStoriesNav(seriesNav, dispatch);
      }
    }

    if (component === 'series-transporter') {
      const numberedListTransporter = document.querySelector('.js-numbered-list-transporter');

      if (numberedListTransporter) {
        contentSlider(numberedListTransporter, {
          slideSelector: '.numbered-list__item',
          cssPrefix: 'transporter__',
          transitionSpeed: 0.7,
          truncateText: false,
          containImages: false,
          scrollToClickedItem: false
        });
      }
    }
  });
};
