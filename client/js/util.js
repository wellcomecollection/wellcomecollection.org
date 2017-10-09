// @flow
const KEYS = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

const nodeList = (nl) => {
  return Array.prototype.slice.call(nl || []);
};

const setPropertyPrefixed = (el, property, value) => {
  const cappedProperty = property[0].toUpperCase() + property.substring(1);
  el.style[`Webkit${cappedProperty}`] = value;
  el.style[`moz${cappedProperty}`] = value;
  el.style[`ms${cappedProperty}`] = value;
  el.style[`o${cappedProperty}`] = value;
  el.style[property] = value;
};

const featureTest = (property, value, noPrefixes) => {
  // Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
  const prop = property + ':';
  const el = document.createElement('test');
  const mStyle = el.style;

  if (!noPrefixes) {
    mStyle.cssText = prop + [ '-webkit-', '-moz-', '-ms-', '-o-', '' ].join(value + ';' + prop) + value + ';';
  } else {
    mStyle.cssText = prop + value;
  }
  return mStyle[ property ].indexOf(value) !== -1;
};

const addClassesToElements = (elements, className) => {
  if (elements.length) {
    nodeList(elements).forEach((e) => {
      e.classList.add(className);
    });
  } else {
    elements.classList.add(className);
  }
};

const removeClassesFromElements = (elements, className) => {
  if (elements.length) {
    nodeList(elements).forEach((e) => {
      e.classList.remove(className);
    });
  } else {
    elements.classList.remove(className);
  }
};

const addAttrToElements = (elements, attr, value) => {
  if (elements.length) {
    nodeList(elements).forEach((e, i) => {
      e.setAttribute(attr, value || i);
    });
  } else {
    elements.setAttribute(attr, value);
  }
};

const removeAttrFromElements = (elements, attr) => {
  if (elements.length) {
    nodeList(elements).forEach((e, i) => {
      e.removeAttribute(attr);
    });
  } else {
    elements.removeAttribute(attr);
  }
};

export {
  nodeList,
  KEYS,
  setPropertyPrefixed,
  featureTest,
  addClassesToElements,
  removeClassesFromElements,
  addAttrToElements,
  removeAttrFromElements
};

// Event delegation
function getTarget(delegateEl: HTMLElement, eventEl: HTMLElement, possibleTarget: HTMLElement): ?HTMLElement {
  if (eventEl === delegateEl) {
    return;
  } else if (eventEl === possibleTarget) {
    return possibleTarget;
  } else {
    return getTarget(delegateEl, eventEl.parentNode, possibleTarget);
  }
}

export function on(delegateElSelector: string, eventName: Event, eventElSelector: string, fn: () => mixed): void {
  const delegateEl = document.querySelector(delegateElSelector);

  delegateEl.addEventListener(eventName, (event) => {
    const possibleTargets = nodeList(delegateEl.querySelectorAll(eventElSelector));
    const eventEl = event.target;

    possibleTargets.forEach((possibleTarget) => {
      const correctTarget = getTarget(delegateEl, eventEl, possibleTarget);

      if (correctTarget) {
        return fn.call(correctTarget, event);
      }
    });
  });
}

export function getDocumentHeight() {
  return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
}

export function getWindowHeight() {
  return window.innerHeight;
}

export function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

