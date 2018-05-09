export default (el) => {
  const emailInput = document.getElementById('email');
  const checkboxEls = [...el.querySelectorAll('input[type="checkbox"]')];
  const checkboxErrorMessage = document.createElement('p');
  const emailErrorMessage = document.createElement('p');
  const errorClasses = ['border-width-1', 'border-color-red', 'padding-left-s2', 'padding-right-s2', 'padding-top-s2', 'padding-bottom-s2', 'margin-bottom-s2', 'font-red'];

  checkboxErrorMessage.classList.add(...errorClasses);
  checkboxErrorMessage.innerHTML = 'Please select at least one newsletter.';
  emailErrorMessage.classList.add(...errorClasses);
  emailErrorMessage.innerHTML = 'Please enter a valid email address.';

  el.setAttribute('novalidate', '');

  function handleSubmit(event) {
    event.preventDefault();

    if (!emailInput.validity.valid) {
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
    if (el.contains(checkboxErrorMessage)) {
      el.classList.remove('is-error');
      el.removeChild(checkboxErrorMessage);
    }
  }

  function handleEmailInput() {
    if (el.contains(emailErrorMessage)) {
      el.classList.remove('is-error');
      el.removeChild(emailErrorMessage);
    }
  }

  emailInput.addEventListener('input', handleEmailInput);
  checkboxEls.forEach(el => el.addEventListener('change', handleCheckboxChange));
  el.addEventListener('submit', handleSubmit);
};
