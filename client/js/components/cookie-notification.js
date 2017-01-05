import cookie from 'cookie-cutter';
const cookieName = 'cookies_accepted';

const cookieNotification = (el) => {
  const isAccepted = cookie.get(cookieName);
  const closeButton = document.getElementById('cookie-notification-close');

  if (isAccepted) {
    el.parentNode.removeChild(el);

    return;
  }

  el.classList.add('cookie-notification--is-visible');

  closeButton.addEventListener('click', (event) => {
    event.preventDefault();

    el.classList.add('cookie-notification--is-faded');

    cookie.set(cookieName, 'true', {
      path: '/',
      expires: 'Fri, 31 Dec 2036 23:59:59 GMT'
    });
  });
};

export default cookieNotification;
