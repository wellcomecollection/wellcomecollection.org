import { validateEmail } from './validate-email-address';

describe('validateEmail', () => {
  it('validates an email address', () => {
    expect(validateEmail('bob@example.com')).toEqual(true);
  });

  it('does not validate with missing @', () => {
    expect(validateEmail('bobexample.com')).toEqual(false);
  });

  it('does not validate with missing domain', () => {
    expect(validateEmail('bob@example')).toEqual(false);
  });
});
