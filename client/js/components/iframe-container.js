export default (el) => {
  const iframeTrigger = el.querySelector('.js-iframe-trigger');
  const originalIframe = el.querySelector('.js-iframe');
  const launch = el.querySelector('.js-iframe-launch');
  const originalLaunchText = launch.innerHTML;
  const close = el.querySelector('.js-iframe-close');

  iframeTrigger.addEventListener('click', loadIframe);
  close.addEventListener('click', unloadIframe);

  function loadIframe(event) {
    const iframe = el.querySelector('.js-iframe');
    const iframeSrc = iframe.getAttribute('data-src');

    launch.innerHTML = 'Loading…';

    iframe.setAttribute('src', iframeSrc);
    iframe.addEventListener('load', hideTrigger);
  }

  function unloadIframe(event) {
    const iframe = el.querySelector('.js-iframe');

    iframe.removeEventListener('load', hideTrigger);

    close.classList.add('is-hidden');
    launch.innerHTML = originalLaunchText;
    iframeTrigger.classList.remove('is-hidden');

    el.removeChild(iframe);
    el.appendChild(originalIframe);
  }

  function hideTrigger() {
    iframeTrigger.classList.add('is-hidden');
    close.classList.remove('is-hidden');
  }
};
