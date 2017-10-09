import { nodeList } from '../util';
import fastdom from '../utils/fastdom-promise';

export default (el) => {
  let timeout;
  const container = el.querySelector('.js-work-media-controls');
  const controls = container.querySelectorAll('.js-work-media-control');

  function showHideControls() {
    const activeControl = container.classList.contains('is-control-active');

    clearTimeout(timeout);

    fastdom.mutate(() => {
      container.classList.add('is-active');
    });

    if (activeControl) return;

    timeout = setTimeout(() => {
      fastdom.mutate(() => {
        container.classList.remove('is-active');
      });
    }, 1000);
  }

  el.addEventListener('mousemove', showHideControls);

  nodeList(controls).forEach(control => {
    control.addEventListener('keyup', showHideControls);
    control.addEventListener('mouseenter', () => {
      fastdom.mutate(() => {
        container.classList.add('is-control-active');
      });
    });
    control.addEventListener('mouseleave', () => {
      fastdom.mutate(() => {
        container.classList.remove('is-control-active');
      });
    });
  });

  showHideControls();
};
