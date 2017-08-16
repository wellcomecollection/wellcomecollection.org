import { nodeList } from '../util';
import fastdom from '../utils/fastdom-promise';

export default (el) => {
  let timeout;
  const container = el.querySelector('.js-work-media-controls');
  const controls = container.querySelectorAll('.js-work-media-control');

  function showHideControls() {
    clearTimeout(timeout);

    fastdom.mutate(() => {
      container.classList.add('is-active');
    });

    timeout = setTimeout(() => {
      fastdom.mutate(() => {
        container.classList.remove('is-active');
      });
    }, 1000);
  }

  el.addEventListener('mousemove', showHideControls);

  nodeList(controls).forEach(control => {
    control.addEventListener('keyup', showHideControls);
  });

  showHideControls();
};
