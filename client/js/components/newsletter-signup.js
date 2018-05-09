export default (el) => {
  const checkboxEls = [...el.querySelectorAll('input[type="checkbox"]')];
  const errorMessage = document.createElement('p');
  errorMessage.classList.add('border-width-1', 'border-color-red', 'padding-left-s2', 'padding-right-s2', 'padding-top-s2', 'padding-bottom-s2', 'margin-bottom-s2', 'font-red');
  errorMessage.innerHTML = 'Please select at least one newsletter below.';

  function handleSubmit(event) {
    event.preventDefault();

    if (!isAnyChecked()) {
      el.classList.add('is-error');
      el.insertBefore(errorMessage, el.firstChild);
    } else {
      event.target.submit();
    }
  }

  function isAnyChecked() {
    return checkboxEls.some(el => el.checked);
  }

  function handleChange() {
    if (el.contains(errorMessage)) {
      el.removeChild(errorMessage);
    }
  }

  checkboxEls.forEach(el => el.addEventListener('change', handleChange));
  el.addEventListener('submit', handleSubmit);
};
