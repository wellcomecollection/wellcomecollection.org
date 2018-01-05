import fetch from 'isomorphic-unfetch';
import FormData from 'form-data';

export async function isValidStructuredData(html: string) {
  const validatorUrl = 'https://search.google.com/structured-data/testing-tool/validate';
  const form = new FormData();
  form.append('html', html);
  const response = await fetch(validatorUrl, {
    method: 'POST',
    body: form
  });
  const text = await response.text();
  const validatorJsonResponse = JSON.parse(text.substring(4));

  return validatorJsonResponse.totalNumErrors === 0;
}
