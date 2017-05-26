import { setPropertyPrefixed } from '../util';

const wobblyEdge = (el) => {
  const options = {};

  if (el.getAttribute('data-max-intensity')) {
    options.maxIntensity = el.getAttribute('data-max-intensity');
  };

  if (el.getAttribute('data-number-of-points')) {
    options.numberOfPoints = el.getAttribute('data-number-of-points');
  }

  const defaults = {
    maxIntensity: 50,
    numberOfPoints: 5,
    isStatic: el.getAttribute('data-is-static') === 'true'
  };
  const settings = Object.assign({}, defaults, options);

  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const polygonPoints = (totalPoints, intensity) => {
    const first = '0% 100%,';
    const last = ',100% 100%';
    const innerPoints = [];

    for (let i = 1; i < totalPoints; i++) {
      const xMean = 100 / totalPoints * i;
      const xShift = (100 / totalPoints) / 2;
      const x = randomIntFromInterval((xMean - xShift), (xMean + xShift - 1));
      const y = randomIntFromInterval((100 - intensity), 100);
      innerPoints.push(`${x}% ${y}%`);
    }

    return `polygon(${first.concat(innerPoints.join(','), last)})`;
  };

  // Initial zero-intensity (flat) path
  setPropertyPrefixed(el, 'clipPath', polygonPoints(0, 0));

  window.requestAnimationFrame(() => {
    // Create path when renderer is ready
    setPropertyPrefixed(el, 'clipPath', polygonPoints(settings.numberOfPoints, settings.maxIntensity));
  });

  let timer;
  let isActive = false;

  if (!settings.isStatic) {
    window.addEventListener('scroll', () => {
      if (!isActive) {
        // Change path when scroll starts
        setPropertyPrefixed(el, 'clipPath', polygonPoints(settings.numberOfPoints, settings.maxIntensity));
        isActive = true;
      }

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        // Change path when scroll stops
        setPropertyPrefixed(el, 'clipPath', polygonPoints(settings.numberOfPoints, settings.maxIntensity));
        isActive = false;
      }, 150);
    });
  }
};

export default wobblyEdge;
