import fromEvent from 'xstream/extra/fromEvent';
import { onWindowResizeDebounce$ } from '../utils/dom-events';
import fastdom from '../utils/fastdom-promise';

const truncateClass = 'captioned-image__caption-text--truncate';
const moreText = '+ More';
const lessText = '- Less';

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
  return fastdom.measure(() => {
    return (e.scrollWidth > e.offsetWidth);
  });
};

const createControl = () => {
  const control = document.createElement('button');
  control.className = 'captioned-image__truncate-control';
  control.innerHTML = moreText;
  control.setAttribute('tabindex', -1);
  return control;
};

const truncateText = (caption) => {
  if (caption) {
    const truncateControl = createControl();

    caption.classList.add(truncateClass);

    hasBeenEllipsified(caption).then((value) => {
      if (value) {
        caption.parentNode.insertBefore(truncateControl, caption.nextSibling);
        const truncated$ = fromEvent(truncateControl, 'click').fold((isClosed) => !isClosed, false);

        truncated$.subscribe({
          next: (isClosed) => {
            toggleTruncate(isClosed, truncateControl, truncateClass);
          }
        });
        return truncated$;
      }
    });

    onWindowResizeDebounce$.subscribe({
      next() {
        hasBeenEllipsified(caption).then((value) => {
          if (value) {
            truncateControl.classList.remove('is-hidden');
          } else {
            truncateControl.classList.add('is-hidden');
          }
        });
      }
    });
  }
};

export default truncateText;

