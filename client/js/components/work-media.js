import { nodeList } from '../util';
import fastdom from '../utils/fastdom-promise';

export default (el) => {
  let timeout;
  const controls = el.querySelectorAll('.js-work-media-control');

  function showHideControls() {
    clearTimeout(timeout);

    fastdom.mutate(() => {
      el.classList.add('work-media--is-controls-visible');
    });

    timeout = setTimeout(() => {
      fastdom.mutate(() => {
        el.classList.remove('work-media--is-controls-visible');
      });
    }, 2000);
  }

  el.addEventListener('mousemove', showHideControls);

  nodeList(controls).forEach(control => {
    control.addEventListener('keyup', showHideControls);
  });

  showHideControls();
};
