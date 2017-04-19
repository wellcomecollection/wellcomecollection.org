import fromEvent from 'xstream/extra/fromEvent';
import { onWindowResizeDebounce$ } from '../utils/dom-events';

const truncateClass = 'captioned-image__caption-text--truncate';
const hiddenControlClass = 'captioned-image__truncate-control--is-hidden';
const moreText = '+ More';
const lessText = '- Less';

const truncateText = (caption) => {
  const toggleTruncate = function(isTruncated, control, className) {
    const textElement = control.previousSibling;
    if (isTruncated) {
      control.innerHTML = lessText;
      textElement.classList.remove(className);
    } else {
      control.innerHTML = moreText;
      textElement.classList.add(className);
    }
  };
  const hasBeenEllipsified = (e) => {
    return (e.scrollWidth > e.offsetWidth);
  };
  const createControl = () => {
    const control = document.createElement('button');
    control.className = 'captioned-image__truncate-control';
    control.innerHTML = moreText;
    control.setAttribute('tabindex', -1);
    return control;
  };
  const truncateControl = createControl();

  caption.classList.add(truncateClass);

  if (hasBeenEllipsified(caption)) {
    caption.parentNode.insertBefore(truncateControl, caption.nextSibling);
    const truncated$ = fromEvent(truncateControl, 'click').fold((isClosed) => !isClosed, false);

    truncated$.subscribe({
      next: (isClosed) => {
        toggleTruncate(isClosed, truncateControl, truncateClass);
      }
    });
  }

  onWindowResizeDebounce$.subscribe({
    next() {
      if (hasBeenEllipsified(caption)) {
        truncateControl.classList.remove(hiddenControlClass);
      } else {
        truncateControl.classList.add(hiddenControlClass);
      }
    }
  });
};

export default truncateText;

