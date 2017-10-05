export default (el) => {
  const iframeTrigger = el.querySelector('.js-iframe-trigger');
  const iframe = el.querySelector('.js-iframe');
  const play = el.querySelector('.js-play');
  const iframeSrc = iframe.getAttribute('data-src');

  el.addEventListener('click', () => {
    play.innerHTML = 'Loading…';

    iframe.setAttribute('src', iframeSrc);
    iframe.addEventListener('load', () => {
      iframeTrigger.style.display = 'none';
    });
  });
};
