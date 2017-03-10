import { nodeList, setPropertyPrefixed, featureTest } from '../util';
import debounce from 'lodash.debounce';
import Hammer from 'hammerjs';

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
    sliderControls: document.createElement('div'),
    prevControl: document.createElement('button'),
    nextControl: document.createElement('button'),
    arrow: '<svg class="control-arrow" aria-hidden="true" viewBox="0 0 12 13"><path d="M10.95 6.05a1 1 0 0 0-1.41 0L7 8.59V2a1 1 0 0 0-2 0v6.59L2.46 6.05a1 1 0 0 0-1.41 1.41l4.24 4.24a1 1 0 0 0 1.41 0l4.24-4.24a1 1 0 0 0 .01-1.41z"></path></svg>'
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
  const indexAttr = 'data-slide-index'; // Added to slide items to help with tabbing
  let containerWidth;
  let slidesWidthArray;
  // let slidesWidthArrayInverted;
  let slidesCombinedWidth;
  let positionArrayBySlide; // An array of positions if we move the slider by the width of each slide
  let positionArrayByContainer; // An array of positions if we move the slider by the width of the container
  // let positionArrayByContainerInverted;
  let positionIndex = settings.startPosition;
  let positionArray; // Holds either positionArrayBySlide or positionArrayByContainer depending on settings

  function setup() {
    // Add classes
    sliderElements.slider.className = classes.slider;
    sliderElements.slidesContainer.classList.add(classes.slidesContainer);
    sliderElements.sliderControls.className = classes.sliderControls;
    sliderElements.prevControl.className = classes.prevControl;
    sliderElements.nextControl.className = classes.nextControl;
    addClassesToElements(sliderElements.slideItems, classes.sliderItem);

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
    sliderElements.prevControl.innerHTML = sliderElements.arrow;
    sliderElements.nextControl.innerHTML = sliderElements.arrow;

    // Set transition style for slider
    setPropertyPrefixed(sliderElements.slidesContainer, 'transition', `transform ${settings.transitionSpeed}s ease`);

    calculateDimensions(); // Dimensions which determine movement amounts
    setSlideIndexes(slidesWidthArray, containerWidth, sliderElements, indexAttr);
    toggleControlsVisibility(slidesCombinedWidth, containerWidth, sliderElements.sliderControls);
    updatePosition(positionIndex, positionArray);
  }

  function calculateDimensions() { // Dimensions which determine movement amounts
    containerWidth = calculateContainerWidth(sliderElements.slidesContainer);
    slidesWidthArray = createWidthArray(sliderElements.slideItems);
    // slidesWidthArrayInverted = slidesWidthArray.slice().reverse();
    slidesCombinedWidth = calculateCombinedWidth(slidesWidthArray);
    positionArrayBySlide = calculateSlidePositionArray(slidesWidthArray);
    positionArrayByContainer = calculatePositionArrayByContainer(slidesWidthArray, slidesCombinedWidth, containerWidth, sliderElements, indexAttr);
    // positionArrayByContainerInverted = calculatePositionArrayByContainerInverted(calculatePositionArrayByContainer(slidesWidthArrayInverted, slidesCombinedWidth, containerWidth, sliderElements, indexAttr), slidesCombinedWidth, containerWidth);
    if (settings.movementType === 'by-slide') {
      positionArray = positionArrayBySlide;
    } else {
      positionArray = positionArrayByContainer;
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
    const width = widthArray.reduce((acc, val, i) => {
      return acc + val;
    }, 0);
    return width;
  };

  function calculateContainerWidth(element) {
    return element.getBoundingClientRect().width;
  }

  function calculateSlidePositionArray(widthArray) {
    const positionArrayBySlide = [];
    widthArray.reduce((acc, val, i) => {
      return positionArrayBySlide[i] = acc + val;
    }, 0);
    positionArrayBySlide.pop();
    positionArrayBySlide.unshift(0);
    return positionArrayBySlide;
  };

  function setSlideIndexes(widthArray, containerWidth, sliderElements, indexAttr) { // TODO check this is doing what I think it is
    let counter = 0;
    let start = 0;
    widthArray.reduce((acc, val, i) => {
      if (acc + val - start > containerWidth) {
        counter++;
      }
      if (settings.movementType === 'by-slide') {
        addAttrToElements(sliderElements.slideItems[i], indexAttr, i);
      } else {
        addAttrToElements(sliderElements.slideItems[i], indexAttr, counter);
      }
      return acc + val;
    }, 0);
  }

  function calculatePositionArrayByContainer(widthArray, slidesWidth, containerWidth) {
    const positionArrayByContainer = [0];
    let start = 0;
    widthArray.reduce((acc, val, i) => {
      if (acc + val - start > containerWidth) {
        positionArrayByContainer.push(acc);
        start = acc;
      }
      return acc + val;
    }, 0);
    positionArrayByContainer.pop();
    positionArrayByContainer.push(slidesWidth - containerWidth);
    return positionArrayByContainer;
  };

  // function calculatePositionArrayByContainerInverted(positions, totalWidth, containerWidth) {
  //   const newArray = positions.map((value) => {
  //     return totalWidth - value - containerWidth;
  //   });
  //   return newArray.reverse();
  // }

  function addClassesToElements(elements, className) {
    if (elements.length) {
      nodeList(elements).forEach((e) => {
        e.classList.add(className);
      });
    } else {
      elements.classList.add(className);
    }
  }

  function removeClassesFromElements(elements, className) {
    if (elements.length) {
      nodeList(elements).forEach((e) => {
        e.classList.remove(className);
      });
    } else {
      elements.classList.remove(className);
    }
  }

  function addAttrToElements(elements, attr, value) {
    if (elements.length) {
      nodeList(elements).forEach((e, i) => {
        e.setAttribute(attr, value || i);
      });
    } else {
      elements.setAttribute(attr, value);
    }
  }

  function removeAttrFromElements(elements, attr) {
    if (elements.length) {
      nodeList(elements).forEach((e, i) => {
        e.removeAttribute(attr);
      });
    } else {
      elements.removeAttribute(attr);
    }
  }

  function toggleControlsVisibility(slidesCombinedWidth, containerWidth, controls) {
    if (slidesCombinedWidth <= containerWidth) {
      controls.style.visibility = 'hidden';
    } else {
      controls.style.removeProperty('visibility');
    }
  }

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

    removeClassesFromElements(items, className);
    addAttrToElements(sliderElements.slideItems, 'aria-hidden', 'true');
    nodeList(currentItems).forEach((item) => {
      addClassesToElements(item, className);
      item.setAttribute('aria-hidden', 'false');
    });
  }

  function changeInactiveControlClass(prevControl, nextControl, n, items, className) {
    removeClassesFromElements([prevControl, nextControl], className);
    removeAttrFromElements([prevControl, nextControl], 'disabled');
    if (n === 0) {
      addClassesToElements(prevControl, className);
      addAttrToElements(prevControl, 'disabled', 'true');
      // if (settings.movementType !== 'by-slide') { // TODO put somewhere better
      //   positionArray = positionArrayByContainer;
      // }
    }
    if (n === items.length - 1) {
      addClassesToElements(nextControl, className);
      addAttrToElements(nextControl, 'disabled', 'true');
      // if (settings.movementType !== 'by-slide') { // TODO put somewhere better
      //   positionArray = positionArrayByContainerInverted;
      // }
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

  function changePosition (n, positionArray) {
    let leftPosition = 0;
    leftPosition = positionArray[n] * -1;
    setPropertyPrefixed(sliderElements.slidesContainer, 'transform', `translate(${leftPosition}px,0) translateZ(0)`);
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
    setSlideIndexes(slidesWidthArray, containerWidth, sliderElements, indexAttr);
    toggleControlsVisibility(slidesCombinedWidth, containerWidth, sliderElements.sliderControls);
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
  sliderElements.slidesContainer.addEventListener('focus', (event) => {
    updatePosition(event.target.closest(`.${classes.sliderItem}`).getAttribute(indexAttr), positionArray);
  }, true);

  // Handle slider width changes
  window.addEventListener('resize', debounce(onWidthChange, 500));
  window.addEventListener('orientationchange', onWidthChange);
};

export default contentSlider;
