import { easings } from '../util';

// Adapted and promisified from https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/
export function smoothScrollTo(destination, duration, easing) {
  return new Promise((resolve, reject) => {
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? window.performance.now() : new Date().getTime();
    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

    if ('requestAnimationFrame' in window === false) {
      window.scroll(0, destinationOffsetToScroll);

      return resolve();
    }

    function scroll() {
      const now = 'now' in window.performance ? window.performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));
      const timeFunction = easings[easing](time);

      window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

      if (window.pageYOffset === destinationOffsetToScroll) return resolve();

      window.requestAnimationFrame(scroll);
    }

    scroll();
  });
}
