export default (el) => {
  el.classList.remove('is-hidden'); // Hidden until JS fires

  el.addEventListener('click', (e) => {
    const copyText = e.currentTarget.getAttribute('data-copy-text');
    const textarea = document.createElement('textarea');

    textarea.setAttribute('style', 'position: fixed; left: -9999px;');
    el.parentNode.insertBefore(textarea, el.nextSibling);
    textarea.innerHTML = copyText;
    textarea.select();

    try {
      document.execCommand('copy');
      el.innerHTML = 'Copied';
    } catch (err) {
      el.innerHTML = 'Copy failed';
    }

    el.focus();
  });
};
