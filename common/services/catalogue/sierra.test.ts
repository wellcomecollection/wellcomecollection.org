import { looksLikeSierraId } from './sierra';

describe('looksLikeSierraId', () => {
  it('allows a pure-numeric Sierra ID', () => {
    expect(looksLikeSierraId('b12345678')).toBeTruthy();
  });

  it('allows a Sierra ID with a non-numeric check digit', () => {
    expect(looksLikeSierraId('b1234560x')).toBeTruthy();
  });

  it('rejects IDs which don’t look like Sierra', () => {
    // A Prismic ID
    expect(looksLikeSierraId('XphUbREAACMAgRNP')).toBeFalsy();

    // The wrong length of ID
    expect(looksLikeSierraId('b1')).toBeFalsy();
    expect(looksLikeSierraId('b12345678901234567890')).toBeFalsy();

    // Something clearly malicious
    expect(looksLikeSierraId('../etc/passwd')).toBeFalsy();
  });
});
