import debounce from 'lodash.debounce';
import Hammer from 'hammerjs';
import truncateText from '../components/truncate-text';
import { nodeList, setPropertyPrefixed, featureTest } from '../util';
import { trackEvent } from '../utils/track-event';

const contentSlider = (el, options) => {
  if (!featureTest('transform', 'translateX(0px)') && !featureTest('transition', 'transform 0.3s ease')) return;
  // Establish settings
  const defaults = {
    startPosition: 0,
    transitionSpeed: 0.7,
    slideSelector: 'li',
    cssPrefix: '',
    sliderType: 'default'
  };
  const settings = Object.assign({}, defaults, options);
  // Grab/create necessary slider elements
  const sliderElements = {
    slidesContainer: el,
    slideItems: el.querySelectorAll(settings.slideSelector),
    slideImages: nodeList(el.querySelectorAll(settings.slideSelector)).map((item) => {
      return item.getElementsByTagName('img')[0];
    }),
    slider: document.createElement('div'),
    sliderInner: document.createElement('div'),
    sliderControls: document.createElement('div'),
    prevControl: document.createElement('button'),
    nextControl: document.createElement('button'),
    arrowThick: '<svg class="control-arrow" aria-hidden="true" viewBox="0 0 12 13"><path d="M10.95 6.05a1 1 0 0 0-1.41 0L7 8.59V2a1 1 0 0 0-2 0v6.59L2.46 6.05a1 1 0 0 0-1.41 1.41l4.24 4.24a1 1 0 0 0 1.41 0l4.24-4.24a1 1 0 0 0 .01-1.41z"></path></svg>',
    arrowThin: '<svg class="control-arrow" aria-hidden="true" viewBox="0 0 20 26"><path class="icon__shape" d="M18.71 15.29a1 1 0 0 0-1.41 0l-6.3 6.3V2a1 1 0 0 0-2 0v19.59l-6.29-6.3A1 1 0 0 0 1.3 16.7l8 8a1 1 0 0 0 1.41 0l8-8a1 1 0 0 0 0-1.41z"></path></svg>'
  };

  // Generate classes for slider elements
  const classes = {
    slider: `${settings.cssPrefix}slider`,
    sliderInner: `${settings.cssPrefix}slider-inner`,
    slidesContainer: `${settings.cssPrefix}slides-container`,
    sliderItem: `${settings.cssPrefix}slide-item`,
    currentItem: `${settings.cssPrefix}slide-item--current`,
    sliderControls: `${settings.cssPrefix}slider-controls`,
    prevControl: `${settings.cssPrefix}slider-control--prev`,
    nextControl: `${settings.cssPrefix}slider-control--next`,
    sliderControlInactive: `${settings.cssPrefix}slider-control--inactive`
  };
  // Define vars
  const sliderTouch = new Hammer(sliderElements.slidesContainer);
  const indexAttr = 'data-slide-index'; // Added to slide items to help with tabbing
  const id = sliderElements.slidesContainer.getAttribute('id');
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
    sliderElements.sliderInner.className = classes.sliderInner;
    sliderElements.slidesContainer.classList.add(classes.slidesContainer);
    sliderElements.sliderControls.className = classes.sliderControls;
    sliderElements.prevControl.className = classes.prevControl;
    sliderElements.nextControl.className = classes.nextControl;
    addClassesToElements(sliderElements.slideItems, classes.sliderItem);

    // Add ARIA attributes
    sliderElements.slidesContainer.setAttribute('aria-live', 'polite');
    sliderElements.slidesContainer.setAttribute('aria-label', 'carousel');
    sliderElements.prevControl.setAttribute('aria-controls', id);
    sliderElements.prevControl.setAttribute('aria-label', 'previous item');
    sliderElements.nextControl.setAttribute('aria-controls', id);
    sliderElements.nextControl.setAttribute('aria-label', 'next item');

    // Place slider elements into DOM
    sliderElements.slidesContainer.parentNode.insertBefore(sliderElements.slider, sliderElements.slidesContainer);
    sliderElements.slider.appendChild(sliderElements.sliderInner);
    sliderElements.sliderInner.appendChild(sliderElements.slidesContainer);
    sliderElements.slider.parentNode.insertBefore(sliderElements.sliderControls, sliderElements.slider.nextSibling);
    sliderElements.sliderControls.appendChild(sliderElements.prevControl);
    sliderElements.sliderControls.appendChild(sliderElements.nextControl);
    if (settings.sliderType === 'gallery') {
      sliderElements.prevControl.innerHTML = sliderElements.arrowThin;
      sliderElements.nextControl.innerHTML = sliderElements.arrowThin;
    } else {
      sliderElements.prevControl.innerHTML = sliderElements.arrowThick;
      sliderElements.nextControl.innerHTML = sliderElements.arrowThick;
    }

    // Set transition style for slider
    setPropertyPrefixed(sliderElements.slidesContainer, 'transition', `transform ${settings.transitionSpeed}s ease`);
    calculateDimensions(); // Dimensions which determine movement amounts
    toggleControlsVisibility(slidesCombinedWidth, containerWidth, sliderElements.sliderControls);
    updatePosition(setSlideIndexes(slidesWidthArray, containerWidth, sliderElements, indexAttr) || positionIndex, positionArray);
  }

  function calculateDimensions() { // Dimensions which determine movement amounts
    containerWidth = calculateContainerWidth(sliderElements.slidesContainer);
    containImages(sliderElements.slideImages, containerWidth, document.documentElement.clientHeight);
    slidesWidthArray = createItemsWidthArray(sliderElements.slideItems);
    // slidesWidthArrayInverted = slidesWidthArray.slice().reverse();
    slidesCombinedWidth = calculateCombinedWidth(slidesWidthArray);
    positionArrayBySlide = calculateSlidePositionArray(slidesWidthArray);
    positionArrayByContainer = calculatePositionArrayByContainer(slidesWidthArray, slidesCombinedWidth, containerWidth, sliderElements, indexAttr);
    // positionArrayByContainerInverted = calculatePositionArrayByContainerInverted(calculatePositionArrayByContainer(slidesWidthArrayInverted, slidesCombinedWidth, containerWidth, sliderElements, indexAttr), slidesCombinedWidth, containerWidth);
    if (settings.sliderType === 'gallery') {
      positionArray = positionArrayBySlide;
    } else {
      positionArray = positionArrayByContainer;
    }
  }

  function createItemsWidthArray(slidesArray) {
    return nodeList(slidesArray).map((el) => {
      const width = el.offsetWidth;
      const style = window.getComputedStyle(el);
      const horizontalMargins = parseInt(style.marginLeft) + parseInt(style.marginRight);
      return width + horizontalMargins;
    });
  };

  function containImages(imagesArray, containerWidth, screenHeight) {
    const maxWidth = containerWidth;
    const maxHeight = screenHeight * 0.7 < 640 ? screenHeight * 0.7 : 640;
    nodeList(imagesArray).forEach((img, imageIndex) => {
      if (img) {
        const imgHeight = maxHeight;
        const imageWidth = img.getAttribute('data-width');
        const imageHeight = img.getAttribute('data-height');
        const widthByHeight = imageWidth / imageHeight * imgHeight;
        img.parentNode.style.height = imgHeight + 'px';
        if (widthByHeight <= maxWidth) {
          img.style.width = widthByHeight + 'px';
          img.parentNode.parentNode.style.width = widthByHeight + 'px';
        } else {
          img.style.width = maxWidth + 'px';
          img.parentNode.parentNode.style.width = maxWidth + 'px';
        }
        if (!img.parentNode.parentNode.querySelector('.captioned-image__truncate-control')) {
          const maybeTruncateControl$ = truncateText(img.parentNode.parentNode.querySelector('.captioned-image__caption-text'));
          if (maybeTruncateControl$) {
            // We drop one as the initial we don't care about for tracking
            maybeTruncateControl$.drop(1).subscribe({
              next: (isClosed) => {
                trackEvent(getTrackingEvent(isClosed ? 'more' : 'less', {imageIndex}));
              }
            });
          }
        }
      }
    });
  }

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

  function setSlideIndexes(widthArray, containerWidth, sliderElements, indexAttr) {
    let counter = 0;
    let start = 0;
    let current;
    widthArray.reduce((acc, val, i) => {
      const slide = sliderElements.slideItems[i];
      if (acc + val - start > containerWidth) {
        counter++;
        start = acc;
      }
      if (settings.sliderType === 'gallery') {
        addAttrToElements(slide, indexAttr, i);
        if (slide.hasAttribute('data-current')) {
          current = i;
        }
      } else {
        addAttrToElements(slide, indexAttr, counter);
        if (slide.hasAttribute('data-current')) {
          current = counter;
        }
      }
      return acc + val;
    }, 0);
    if (current !== undefined) return current;
  }

  function calculatePositionArrayByContainer(widthArray, slidesWidth, containerWidth) {
    const positionArrayByContainer = [0];
    let start = 0;
    widthArray.reduce((acc, val) => {
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
    slidesWidthArray.reduce((acc, curr, i) => {
      const nextLength = acc + curr;
      if (settings.sliderType === 'gallery') {
        if (n === i) {
          currentItems.push(items[i]);
        }
      } else {
        if (acc >= lowerBoundary && nextLength <= upperBoundary) {
          currentItems.push(items[positionArrayBySlide.indexOf(acc)]);
        }
      }
      return nextLength;
    }, 0);
    removeClassesFromElements(items, className);
    addAttrToElements(sliderElements.slideItems, 'aria-hidden', 'true');
    nodeList(sliderElements.slidesContainer.querySelectorAll('a, button')).forEach(function(e) {
      e.setAttribute('tabindex', -1); // only elements in visible slides should be tabbable
    });
    nodeList(currentItems).forEach((item) => {
      const tabbables = item.querySelectorAll('a, button');
      nodeList(tabbables).forEach(function(e) {
        e.setAttribute('tabindex', 0); // make visible elements tabbable
      });
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
      // if (settings.sliderType !== 'gallery') { // TODO put somewhere better
      //   positionArray = positionArrayByContainer;
      // }
    }
    if (n === items.length - 1) {
      addClassesToElements(nextControl, className);
      addAttrToElements(nextControl, 'disabled', 'true');
      // if (settings.sliderType !== 'gallery') { // TODO put somewhere better
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
    changeInactiveControlClass(sliderElements.prevControl, sliderElements.nextControl, positionIndex, positionArray, classes.sliderControlInactive);
  }

  function changePosition (n, positionArray) {
    let leftPosition = 0;
    leftPosition = positionArray[n] * -1;
    setPropertyPrefixed(sliderElements.slidesContainer, 'transform', `translate(${leftPosition}px,0) translateZ(0)`);
  }

  function nextSlide(e) {
    if (e.target.classList.contains(classes.sliderControlInactive)) return;
    const moveToPosition = positionIndex + 1;
    trackEvent(getTrackingEvent('next', {moveToPosition}));
    return updatePosition(moveToPosition, positionArray);
  }

  function prevSlide(e) {
    if (e.target.classList.contains(classes.sliderControlInactive)) return;
    const moveToPosition = positionIndex - 1;
    trackEvent(getTrackingEvent('next', {moveToPosition}));
    return updatePosition(moveToPosition, positionArray);
  }

  function onWidthChange() {
    calculateDimensions();
    toggleControlsVisibility(slidesCombinedWidth, containerWidth, sliderElements.sliderControls);
    updatePosition(setSlideIndexes(slidesWidthArray, containerWidth, sliderElements, indexAttr) || positionIndex, positionArray);
  }

  function getTrackingEvent(action, data) {
    return Object.assign({}, {
      name: 'Content slider',
      properties: {
        id,
        action,
        numberOfItems: sliderElements.slideImages.length
      }
    }, data);
  }

  function blurCurrentTarget({ currentTarget }) {
    currentTarget.blur();
  }

  setup();

  // Handle click
  sliderElements.prevControl.addEventListener('click', prevSlide, true);
  sliderElements.prevControl.addEventListener('mouseup', blurCurrentTarget); // Don't blur for keyboard navigation
  sliderElements.nextControl.addEventListener('click', nextSlide, true);
  sliderElements.nextControl.addEventListener('mouseup', blurCurrentTarget); // Don't blur for keyboard navigation

  nodeList(sliderElements.slideItems).forEach((item) => {
    item.addEventListener('click', ({ target, currentTarget }) => {
      // We only want to match clicks on the img, because clicks on the
      // caption could be on the 'more/less' controls
      if (!target.matches('img')) return;

      updatePosition(parseInt(currentTarget.getAttribute(indexAttr), 10), positionArray);
    });
  });

  // Handle touch
  sliderTouch.on('swiperight', prevSlide);
  sliderTouch.on('swipeleft', nextSlide);

  // Handle slider width changes
  window.addEventListener('resize', debounce(onWidthChange, 500));
  window.addEventListener('orientationchange', onWidthChange);
};

export default contentSlider;
