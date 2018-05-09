export default (el) => {
  const emailInputEl = el.querySelector('input[type="email"]');
  const checkboxEls = [...el.querySelectorAll('input[type="checkbox"]')];
  const checkboxErrorMessage = document.createElement('p');
  const emailErrorMessage = document.createElement('p');
  const errorClasses = ['border-width-1', 'border-color-red', 'padding-left-s2', 'padding-right-s2', 'padding-top-s2', 'padding-bottom-s2', 'margin-bottom-s2', 'font-red'];
  let isSubmitAttempted = false;

  checkboxErrorMessage.classList.add(...errorClasses);
  checkboxErrorMessage.innerHTML = 'Please select at least one newsletter.';
  emailErrorMessage.classList.add(...errorClasses);
  emailErrorMessage.innerHTML = 'Please enter a valid email address.';

  el.setAttribute('novalidate', '');

  function handleSubmit(event) {
    event.preventDefault();

    isSubmitAttempted = true;

    if (!emailInputEl.validity.valid) {
      el.classList.add('is-error');
      el.append(emailErrorMessage);
    }

    if (!isAnyChecked()) {
      el.classList.add('is-error');
      el.append(checkboxErrorMessage);
    }

    if (!el.classList.contains('is-error')) {
      event.target.submit();
    }
  }

  function isAnyChecked() {
    return checkboxEls.some(el => el.checked);
  }

  function handleCheckboxChange() {
    if (el.contains(checkboxErrorMessage) && isAnyChecked()) {
      el.classList.remove('is-error');
      el.removeChild(checkboxErrorMessage);
    } else if (!isAnyChecked() && isSubmitAttempted) {
      el.classList.add('is-error');
      el.append(checkboxErrorMessage);
    }
  }

  function handleEmailInput() {
    if (el.contains(emailErrorMessage) && emailInputEl.validity.valid) {
      el.classList.remove('is-error');
      el.removeChild(emailErrorMessage);
    } else if (!emailInputEl.validity.valid && isSubmitAttempted) {
      el.classList.add('is-error');
      el.append(emailErrorMessage);
    }
  }

  emailInputEl.addEventListener('input', handleEmailInput);
  checkboxEls.forEach(el => el.addEventListener('change', handleCheckboxChange));
  el.addEventListener('submit', handleSubmit);
};
