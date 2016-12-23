import cookie from 'cookie-cutter';
const COOKIE_NAME = 'cookies_accepted';

const cookieNotification = (el) => {
  const isAccepted = cookie.get(COOKIE_NAME);
  const closeButton = document.getElementById('cookie-notification-close');

  if (isAccepted) {
    el.parentNode.removeChild(el);

    return;
  }

  el.classList.add('cookie-notification--is-visible');

  closeButton.addEventListener('click', (event) => {
    event.preventDefault();

    el.classList.add('cookie-notification--is-faded');

    cookie.set(COOKIE_NAME, 'true', {
      path: '/',
      expires: 'Fri, 31 Dec 2036 23:59:59 GMT'
    });
  });
};

export default cookieNotification;
