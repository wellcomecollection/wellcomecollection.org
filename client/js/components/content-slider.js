import { nodeList, featureTest } from '../util';
import debounce from 'lodash.debounce';
import Hammer from 'hammerjs';

const contentSlider = (el, options) => {
  if (!featureTest('transform', 'translateX(0px)') && !featureTest('transition', 'transform 0.3s ease')) return;
  // Establish settings
  const defaults = {
    startPosition: 0,
    transitionSpeed: 0.7,
    slideSelector: 'li',
    cssPrefix: ''
  };
  const settings = Object.assign({}, defaults, options);
  // Grab/create necessary slider elements
  const sliderElements = {
    slidesContainer: el,
    slideItems: el.querySelectorAll(settings.slideSelector),
    slider: document.createElement('div'),
    sliderInner: document.createElement('div'),
    sliderControls: document.createElement('div'),
    prevControl: document.createElement('button'),
    nextControl: document.createElement('button')
  };
  // Generate classes for slider elements
  const classes = {
    slider: `${settings.cssPrefix}slider`,
    slidesContainer: `${settings.cssPrefix}slides-container`,
    sliderItem: `${settings.cssPrefix}slide-item`,
    currentItem: `${settings.cssPrefix}slide-item--current`,
    sliderControls: `${settings.cssPrefix}slider-controls`,
    prevControl: `${settings.cssPrefix}slider-control--prev`,
    nextControl: `${settings.cssPrefix}slider-control--next`,
    sliderControlInActive: `${settings.cssPrefix}slider-control--inactive`
  };
  // Define vars
  const sliderTouch = new Hammer(sliderElements.slidesContainer);
  const indexAttr = 'data-slide-index';
  let containerWidth;
  let slidesWidthArray;
  let slidesCombinedWidth;
  let positionArrayBySlide;
  let positionArrayByContainer;
  let positionIndex = settings.startPosition;
  let positionArray;

  function setup() {
    // Add classes to elements
    sliderElements.slider.className = classes.slider;
    sliderElements.slidesContainer.classList.add(classes.slidesContainer);
    sliderElements.sliderControls.className = classes.sliderControls;
    sliderElements.prevControl.className = classes.prevControl;
    sliderElements.nextControl.className = classes.nextControl;
    addClassToElements(sliderElements.slideItems, classes.sliderItem);

    // Add ARIA attributes
    sliderElements.slidesContainer.setAttribute('aria-live', 'polite');
    sliderElements.slidesContainer.setAttribute('aria-label', 'carousel');
    sliderElements.prevControl.setAttribute('aria-controls', sliderElements.slidesContainer.getAttribute('id'));
    sliderElements.prevControl.setAttribute('aria-label', 'previous item');
    sliderElements.nextControl.setAttribute('aria-controls', sliderElements.slidesContainer.getAttribute('id'));
    sliderElements.nextControl.setAttribute('aria-label', 'next item');

    // Place slider elements into DOM
    sliderElements.slidesContainer.parentNode.insertBefore(sliderElements.slider, sliderElements.slidesContainer);
    sliderElements.slider.appendChild(sliderElements.slidesContainer);
    sliderElements.slider.parentNode.insertBefore(sliderElements.sliderControls, sliderElements.slider.nextSibling);
    sliderElements.sliderControls.appendChild(sliderElements.prevControl);
    sliderElements.sliderControls.appendChild(sliderElements.nextControl);
    sliderElements.prevControl.innerHTML = 'previous';
    sliderElements.nextControl.innerHTML = 'next';

    // Set transition styles
    sliderElements.slidesContainer.style.webkitTransition =
    sliderElements.slidesContainer.style.msTransition =
    sliderElements.slidesContainer.style.MozTransition =
    sliderElements.slidesContainer.style.OTransition =
    sliderElements.slidesContainer.Transition = `transform ${settings.transitionSpeed}s ease`;

    addAttrToElements(sliderElements.slideItems, indexAttr);
    calculateDimensions();
    toggleControls(slidesCombinedWidth, containerWidth, sliderElements.sliderControls);
    updatePosition(positionIndex, positionArray);
  }

  function calculateDimensions() {
    containerWidth = calculateContainerWidth(sliderElements.slidesContainer);
    slidesWidthArray = createWidthArray(sliderElements.slideItems);
    slidesCombinedWidth = calculateCombinedWidth(slidesWidthArray);
    positionArrayBySlide = calculateSlidePositionArray(slidesWidthArray);
    positionArrayByContainer = calculatepositionArrayByContainer(slidesWidthArray, slidesCombinedWidth, containerWidth);
    positionArray = positionArrayByContainer;
  }

  function toggleControls(slidesCombinedWidth, containerWidth, controls) {
    if (slidesCombinedWidth <= containerWidth) {
      controls.style.visibility = 'hidden';
    } else {
      controls.style.removeProperty('visibility');
    }
  }

  function addClassToElements(elements, className) {
    nodeList(elements).forEach(function(e) {
      e.classList.add(className);
    });
  }

  function addAttrToElements(elements, attr, value) {
    if (elements.forEach) {
      nodeList(elements).forEach(function(e, i) {
        e.setAttribute(attr, value || i);
      });
    }
  }

  function createWidthArray(slidesArray) {
    const widthArray = [];
    nodeList(slidesArray).forEach((e, i) => {
      const elementWidth = e.getBoundingClientRect().width;
      widthArray.push(elementWidth);
    });
    return widthArray;
  };

  function calculateCombinedWidth(widthArray) {
    const width = widthArray.reduce(function(acc, val, i) {
      return acc + val;
    }, 0);
    return width;
  };

  function calculateContainerWidth(element) {
    return element.getBoundingClientRect().width;
  }

  function calculateSlidePositionArray(widthArray) {
    const positionArrayBySlide = [];
    widthArray.reduce(function(acc, val, i) {
      return positionArrayBySlide[i] = acc + val;
    }, 0);
    positionArrayBySlide.pop();
    positionArrayBySlide.unshift(0);
    return positionArrayBySlide;
  };

  function calculatepositionArrayByContainer(widthArray, slidesWidth, containerWidth) {
    const positionArrayBySlide = [0];
    let start = 0;
    widthArray.reduce(function(acc, val, i) {
      if (acc + val - start > containerWidth) {
        positionArrayBySlide.push(acc);
        start = acc;
      }
      return acc + val;
    }, 0);
    positionArrayBySlide.pop();
    positionArrayBySlide.push(slidesWidth - containerWidth);
    return positionArrayBySlide;
  };

  function removeClass(className, parent) {
    const element = parent.querySelectorAll(`.${className}`);
    if (element.length === 1) {
      element[0].classList.remove(className);
    } else {
      nodeList(element).forEach((e) => {
        e.classList.remove(className);
      });
    }
  }

  function addClass(element, className) {
    if (element) {
      element.classList.add(className);
    }
  };

  function changeCurrentItemsStatus(items, n, className, positionArrayBySlide, positionArray, slidesWidthArray, containerWidth) {
    const positionValue = positionArray[n];
    const lowerBoundary = positionValue;
    const upperBoundary = containerWidth + positionValue;
    const currentItems = [];

    slidesWidthArray.reduce((acc, curr) => {
      const nextLength = acc + curr;
      if (acc >= lowerBoundary && nextLength <= upperBoundary) {
        currentItems.push(items[positionArrayBySlide.indexOf(acc)]);
      }
      return nextLength;
    }, 0);

    removeClass(className, items[0].parentNode);
    addAttrToElements(sliderElements.slideItems, 'aria-hidden', 'true');
    nodeList(currentItems).forEach((item) => {
      addClass(item, className);
      item.setAttribute('aria-hidden', 'false');
    });
  }

  function changeInactiveControlClass(prevControl, nextControl, n, items, className) {
    removeClass(className, prevControl.parentNode);
    if (n === 0) {
      addClass(prevControl, className);
    }
    if (n === items.length - 1) {
      addClass(nextControl, className);
    }
  }

  function updatePosition(n, positionArray) {
    if (n < 0) {
      positionIndex = 0;
    } else if (n >= positionArray.length) {
      positionIndex = positionArray.length - 1;
    } else {
      positionIndex = n;
    }
    changePosition(positionIndex, positionArray, settings.speed);
    changeCurrentItemsStatus(sliderElements.slideItems, positionIndex, classes.currentItem, positionArrayBySlide, positionArray, slidesWidthArray, containerWidth);
    changeInactiveControlClass(sliderElements.prevControl, sliderElements.nextControl, positionIndex, positionArray, classes.sliderControlInActive);
  };

  function changePosition (n, positionArray, speed) {
    let leftPosition = 0;
    leftPosition = positionArray[n] * -1;
    sliderElements.slidesContainer.style.webkitTransform = 'translate(' + leftPosition + 'px,0) translateZ(0)';
    sliderElements.slidesContainer.style.msTransform =
    sliderElements.slidesContainer.style.MozTransform =
    sliderElements.slidesContainer.style.OTransform =
    sliderElements.slidesContainer.Transform = 'translateX(' + leftPosition + 'px)';
  };

  function nextSlide(e) {
    if (e.target.classList.contains(classes.sliderControlInActive)) return;
    return updatePosition(positionIndex + 1, positionArray);
  }

  function prevSlide(e) {
    if (e.target.classList.contains(classes.sliderControlInActive)) return;
    return updatePosition(positionIndex - 1, positionArray);
  }

  function onWidthChange() {
    calculateDimensions();
    toggleControls(slidesCombinedWidth, containerWidth, sliderElements.sliderControls);
    updatePosition(positionIndex, positionArray);
  }

  setup();

  // Handle click
  sliderElements.prevControl.addEventListener('click', prevSlide, true);
  sliderElements.nextControl.addEventListener('click', nextSlide, true);

  // Handle touch
  sliderTouch.on('swiperight', prevSlide);
  sliderTouch.on('swipeleft', nextSlide);

  // Handle tabbing onto elements contained inside a slide
  sliderElements.slidesContainer.addEventListener('focus', function(event) {
    updatePosition(event.target.closest(`.${classes.sliderItem}`).getAttribute(indexAttr), positionArray);
  }, true);

  // Handle slider width changes
  window.addEventListener('resize', debounce(onWidthChange, 500));
  window.addEventListener('orientationchange', onWidthChange);
};

export default contentSlider;
