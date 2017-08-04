export default (el) => {
  el.classList.remove('is-hidden'); // Hidden until JS fires

  el.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    const { origin, pathname } = window.location;

    textarea.setAttribute('style', 'position: fixed; left: -9999px;');
    el.parentNode.insertBefore(textarea, el.nextSibling);
    textarea.innerHTML = `${origin}${pathname}`;
    textarea.select();

    try {
      document.execCommand('copy');
      el.innerHTML = 'Copied to clipboard';
    } catch (err) {
      el.innerHTML = 'Copy failed';
    }

    el.focus();
  });
};
