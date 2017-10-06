export default (el) => {
  el.classList.remove('is-hidden'); // Hidden until JS fires

  el.addEventListener('click', (e) => {
    const copyText = e.currentTarget.getAttribute('data-copy-text');
    const textarea = document.createElement('textarea');
    const btnText = el.querySelector('.js-copy-text');
    const btnIcon = el.querySelector('.icon');

    textarea.setAttribute('style', 'position: fixed; left: -9999px;');
    el.parentNode.insertBefore(textarea, el.nextSibling);
    textarea.innerHTML = copyText;
    textarea.select();

    try {
      document.execCommand('copy');
      btnIcon.classList.remove('is-hidden');
      el.classList.add('plain-button');
      btnText.innerHTML = 'Copied';
    } catch (err) {
      btnText.innerHTML = 'Copy failed';
    }

    el.focus();
  });
};
