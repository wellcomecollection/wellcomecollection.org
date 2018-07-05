import cookie from 'cookie-cutter';

const infoBanner = el => {
  const cookieName = el.getAttribute('data-cookie-name');
  const isAccepted = cookie.get(cookieName);
  const singleSessionCookies = ['WC_globalAlert'];
  const isSingleSessionCookie = singleSessionCookies.indexOf(cookieName) > -1;
  const closeButton = el.querySelector('.js-info-banner-close');

  if (isAccepted) {
    el.parentNode.removeChild(el);

    return;
  }

  // TODO: remove line below after Wellcome Images redirect has bedded in
  if (!window.location.search.match('wellcomeImagesUrl') && cookieName === 'WC_wellcomeImagesRedirect') return;

  el.classList.remove('is-hidden');

  if (closeButton) {
    closeButton.addEventListener('click', event => {
      event.preventDefault();

      el.classList.add('is-hidden');

      cookie.set(cookieName, 'true', {
        path: '/',
        expires: isSingleSessionCookie ? null : 'Fri, 31 Dec 2036 23:59:59 GMT'
      });
    });
  }
};

export default infoBanner;
