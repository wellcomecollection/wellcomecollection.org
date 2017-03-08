import { featureTest } from '../util';
import debounce from 'lodash.debounce';
import Hammer from 'hammerjs';
// TODo - get startPosition from data-current?
// TODO - accessibility (aria-labels) 1hr
// TODO - cross browser testing
// TODO if slidesWidth <= containerWidth get rid of buttons etc., poss. destroy function, opposite of setup
const contentSlider = (el, options) => {
  if (!featureTest('transform', 'translateX(0px)') && !featureTest('transition', 'transform 0.3s ease')) return;
  // Establish settings
  const defaults = {
    startPosition: 0,
    transitionSpeed: 0.7,
    slideSelector: 'li',
    cssPrefix: '',
    movementType: 'default'
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

    addIndexToSlides(sliderElements.slideItems, indexAttr);
    calculateDimensions();
    updatePosition(positionIndex, positionArray);
  }

  function calculateDimensions() {
    containerWidth = calculateContainerWidth(sliderElements.slidesContainer);
    slidesWidthArray = createWidthArray(sliderElements.slideItems);
    slidesCombinedWidth = calculateCombinedWidth(slidesWidthArray);
    positionArrayBySlide = calculateSlidePositionArray(slidesWidthArray);
    if (settings.movementType === 'by-slide') {
      positionArray = positionArrayBySlide;
    } else {
      positionArrayByContainer = calculatepositionArrayByContainer(slidesWidthArray, slidesCombinedWidth, containerWidth);
      positionArray = positionArrayByContainer;
    }
  }

  function addClassToElements(elements, className) {
    elements.forEach(function(e) {
      e.classList.add(className);
    });
  }

  function addIndexToSlides(elements, attr) {
    elements.forEach(function(e, i) {
      e.setAttribute(attr, i);
    });
  }

  function createWidthArray(slidesArray) {
    const widthArray = [];
    slidesArray.forEach((e, i) => {
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

  function addClass(element, className) {
    if (element) {
      element.classList.add(className);
    }
  };

  function removeClass(className, parent) {
    const element = parent.querySelector(`.${className}`);
    if (element) {
      element.classList.remove(className);
    }
  }

  function changeCurrentItemClass(items, n, className) {
    removeClass(className, items[n].parentNode);
    addClass(items[n], className);
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
    changeCurrentItemClass(sliderElements.slideItems, positionIndex, classes.currentItem);
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
