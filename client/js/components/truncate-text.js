import xstream from 'xstream';
import {onWindowOrientationChange$, onWindowResizeDebounce$} from '../utils/dom-events';
import {nodeList} from '../util';
// TODO ARIA
// TODO cross browser testing
// TODO fix content slider stuff
const truncateText = (elements) => { // TODO pass in class prefix?
  const truncateClass = 'captioned-image__caption-text--truncate';
  const moreText = '+ More';
  const lessText = '- Less';

  nodeList(elements).forEach(function(text) {
    const truncateControl = document.createElement('button');
    const toggleText = function(control, element, className) {
      element.classList.toggle(className);
      if (element.classList.contains(className)) {
        control.innerHTML = moreText;
      } else {
        control.innerHTML = lessText;
      }
    };
    truncateControl.className = 'captioned-image__truncate-control';
    truncateControl.innerHTML = moreText;
    text.parentNode.insertBefore(truncateControl, text.nextSibling);
    text.classList.add(truncateClass);
    truncateControl.addEventListener('click', function(e) { toggleText(e.target, text, truncateClass); });
  });

  const truncate = function(els) {
    nodeList(els).forEach(function(e) {
      e.classList.add(truncateClass);
      const textControl = e.nextSibling;
      textControl.innerHTML = moreText;
      const isEllipsisActive = e => (e.offsetWidth < e.scrollWidth);
      const showHideControl = function(text, control) {
        if (isEllipsisActive(text)) {
          control.style.display = 'block';
        } else {
          control.style.display = 'none';
        }
      };
      showHideControl(e, textControl);
    });
  };

  const windowResizes$ = xstream.merge(onWindowOrientationChange$, onWindowResizeDebounce$).startWith(null);
  windowResizes$.subscribe({ next: function() { truncate(elements); } });
};

export default truncateText;
