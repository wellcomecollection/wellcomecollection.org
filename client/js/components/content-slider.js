import debounce from 'lodash.debounce';
import { nodeList, setPropertyPrefixed, featureTest, addClassesToElements, removeClassesFromElements, addAttrToElements, removeAttrFromElements } from '../util';
import { trackGaEvent } from '../tracking';
import fastdom from '../utils/fastdom-promise';

const contentSlider = (el, options) => {
  if (!featureTest('transform', 'translateX(0px)') && !featureTest('transition', 'transform 0.3s ease')) return;
  // Establish settings
  const defaults = {
    startPosition: 0,
    transitionSpeed: 0.7,
    slideSelector: 'li',
    sliderType: 'default',
    containImages: true,
    scrollToClickedItem: true,
    modifiers: []
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

  // TODO: remove this when removing data-modifiers from async. It smells.
  function setModifiers(cssBlock) {
    return settings.modifiers.reduce((acc, curr) => {
      return `${acc} ${cssBlock}--${curr}`;
    }, '');
  }

  const sliderModifiers = setModifiers('slider');
  const slidesContainerModifiers = setModifiers('slides-container');
  const sliderControlsModifiers = setModifiers('slider-controls');
  const inContent = settings.modifiers.indexOf('in-content') > -1;
  const flushRightClass = inContent ? 'flush-container-right' : '';

  // Generate classes for slider elements
  const classes = {
    slider: `slider ${sliderModifiers}`,
    sliderInner: `slider-inner`,
    slidesContainer: `slides-container`,
    sliderItem: `slide-item`,
    currentItem: `slide-item--current`,
    sliderControls: `slider-controls  ${sliderControlsModifiers} ${flushRightClass}`,
    prevControl: `slider-control--prev`,
    nextControl: `slider-control--next`,
    sliderControlInactive: `slider-control--inactive`
  };
  // Define vars
  const indexAttr = 'data-slide-index'; // Added to slide items to help with tabbing
  const id = el.getAttribute('data-id');

  let slidesWidthArray;
  let slidesCombinedWidth;
  let positionArrayBySlide; // An array of positions if we move the slider by the width of each slide
  let positionArrayByContainer; // An array of positions if we move the slider by the width of the container
  let positionIndex = settings.startPosition;
  let positionArray; // Holds either positionArrayBySlide or positionArrayByContainer depending on settings

  function setup() {
    // Add classes
    sliderElements.slider.className = classes.slider;
    sliderElements.sliderInner.className = classes.sliderInner;
    sliderElements.slidesContainer.classList.add(classes.slidesContainer);
    slidesContainerModifiers.split(' ').forEach((modifier) => {
      // TODO: remove this with the data-modifiers above
      if (modifier.trim() !== '') {
        sliderElements.slidesContainer.classList.add(modifier);
      }
    });
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
    calculateDimensions(); // Dimensions which determine movement amounts
  }

  function calculateDimensions() { // Dimensions which determine movement amounts
    calculateContainerWidth(sliderElements.slidesContainer).then((containerWidth) => {
      containImages(sliderElements.slideImages, containerWidth, document.documentElement.clientHeight, settings);
      slidesWidthArray = createItemsWidthArray(sliderElements.slideItems);
      Promise.all(slidesWidthArray.map((promise) => {
        return promise.then((width) => {
          return width;
        });
      })).then((slidesWidthArray) => {
        slidesCombinedWidth = calculateCombinedWidth(slidesWidthArray);
        positionArrayBySlide = calculateSlidePositionArray(slidesWidthArray);
        positionArrayByContainer = calculatePositionArrayByContainer(slidesWidthArray, slidesCombinedWidth, containerWidth, sliderElements, indexAttr);
        if (settings.sliderType === 'gallery') {
          positionArray = positionArrayBySlide;
        } else {
          positionArray = positionArrayByContainer;
        }

        updatePosition(setSlideIndexes(slidesWidthArray, containerWidth, sliderElements, indexAttr) || positionIndex, positionArray);
      });
    });
  }

  function createItemsWidthArray(slidesArray) {
    return nodeList(slidesArray).map((el) => {
      const width = fastdom.measure(() => {
        return el.offsetWidth;
      });
      const style =  fastdom.measure(() => {
        return window.getComputedStyle(el);
      });
      return Promise.all([width, style]).then(([width, style]) => {
        const horizontalMargins = parseInt(style.marginLeft) + parseInt(style.marginRight);
        return width + horizontalMargins;
      });
    });
  };

  function containImages(imagesArray, containerWidth, screenHeight, settings) {
    if (settings.containImages) {
      const maxWidth = containerWidth;
      const maxHeight = screenHeight * 0.7 < 640 ? screenHeight * 0.7 : 640;
      nodeList(imagesArray).forEach((img, imageIndex) => {
        if (img) {
          const imgHeight = maxHeight;
          const imageWidth = img.getAttribute('width');
          const imageHeight = img.getAttribute('height');
          const widthByHeight = imageWidth / imageHeight * imgHeight;
          img.parentNode.style.height = imgHeight + 'px';
          if (widthByHeight <= maxWidth) {
            img.parentNode.parentNode.style.width = widthByHeight + 'px';
          } else {
            img.parentNode.parentNode.style.width = maxWidth + 'px';
          }
        }
      });
    }
  }

  function calculateCombinedWidth(widthArray) {
    const width = widthArray.reduce((acc, val, i) => {
      return acc + val;
    }, 0);
    return width;
  };

  function calculateContainerWidth(element) {
    return fastdom.measure(() => {
      return element.getBoundingClientRect().width;
    });
  };

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
    removeAttrFromElements([prevControl, nextControl], 'aria-hidden');
    if (n === 0) {
      addClassesToElements(prevControl, className);
      addAttrToElements(prevControl, 'disabled', 'true');
      addAttrToElements(prevControl, 'aria-hidden', 'true');
    }
    if (n === items.length - 1) {
      addClassesToElements(nextControl, className);
      addAttrToElements(nextControl, 'disabled', 'true');
      addAttrToElements(nextControl, 'aria-hidden', 'true');
    }
  }

  function updatePosition(n, positionArray, containerWidth) {
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

  function changePosition(n, positionArray) {
    let leftPosition = 0;
    leftPosition = positionArray[n] * -1;
    setPropertyPrefixed(sliderElements.slidesContainer, 'transform', `translateX(${leftPosition}px)`);
  }

  function getOneIndex(number) {
    return number + 1;
  }

  function nextSlide(e) {
    if (e.target.classList.contains(classes.sliderControlInactive)) return;
    const moveToPosition = positionIndex + 1;
    trackGaEvent({
      category: 'component',
      action: `content-slider-button:${e.type}`,
      label: `id:${id}, type:next, to-position:${getOneIndex(moveToPosition)}, total-items:${sliderElements.slideImages.length}`
    });
    return updatePosition(moveToPosition, positionArray);
  }

  function prevSlide(e) {
    if (e.target.classList.contains(classes.sliderControlInactive)) return;
    const moveToPosition = positionIndex - 1;
    trackGaEvent({
      category: 'component',
      action: `content-slider-button:${e.type}`,
      label: `id:${id}, type:prev, to-position:${getOneIndex(moveToPosition)}, total-items:${sliderElements.slideImages.length}`
    });
    return updatePosition(moveToPosition, positionArray);
  }

  function onWidthChange() {
    calculateDimensions();
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

  if (settings.scrollToClickedItem) {
    nodeList(sliderElements.slideItems).forEach((item) => {
      item.addEventListener('click', ({ target, currentTarget }) => {
        // We only want to match clicks on the img, because clicks on the
        // caption could be on the 'more/less' controls
        if (!target.matches('img')) return;

        updatePosition(parseInt(currentTarget.getAttribute(indexAttr), 10), positionArray);
      });
    });
  }

  // Handle slider width changes
  window.addEventListener('resize', debounce(onWidthChange, 500));
  window.addEventListener('orientationchange', onWidthChange);
};

export default contentSlider;
