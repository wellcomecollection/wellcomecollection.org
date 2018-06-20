/* global fetch */
import contentSlider from './content-slider';
import shrinkStoriesNav from './shrink-stories-nav';

export default function asyncContent(el, dispatch) {
  const component = el.getAttribute('data-component');
  const prefixEndpoint = el.getAttribute('data-prefix-endpoint') !== 'false';
  const endpoint = el.getAttribute('data-endpoint');

  return fetch(`${prefixEndpoint ? '/async' : ''}${endpoint}`)
    .then(resp => {
      if (resp.status !== 200) {
        throw new Error(`async content: ${endpoint} responded with ${resp.status}`);
      } else {
        return resp.json();
      }
    })
    .then(json => {
      const outerEl = document.createElement('div');
      outerEl.innerHTML = json.html;
      const newEl = outerEl.firstElementChild;
      const parentNode = el.parentNode;
      parentNode.insertBefore(newEl, el);
      parentNode.removeChild(el);

      if (component === 'series-nav') {
        const seriesSlider = document.querySelector('.js-numbered-slider');
        const seriesNav = document.querySelector('.js-series-nav');

        if (seriesSlider) {
          contentSlider(seriesSlider, {
            transitionSpeed: 0.7,
            modifiers: ['numbered-list']
          });
        }

        if (seriesNav) {
          shrinkStoriesNav(seriesNav, dispatch);
        }
      }

      if (component === 'series-transporter') {
        const dataModifiers = el.getAttribute('data-modifiers') || JSON.stringify({});
        const parsedModifiers = JSON.parse(dataModifiers);
        const modifiers = Object.keys(parsedModifiers)
          .filter(modifier => modifier)
          .concat(['transporter', 'in-content']);

        if (newEl.classList.contains('js-numbered-list-transporter')) {
          contentSlider(newEl, {
            slideSelector: '.numbered-list__item',
            modifiers: modifiers,
            transitionSpeed: 0.7,
            containImages: false,
            scrollToClickedItem: false
          });
        }
      }
    })
    // if it's a 500 or similar, we'll hear it in other alerting
    .catch(() => {});
};
