import { looksLikeCanonicalId } from '.';

describe('looksLikeCanonicalId', () => {
  it.each(['a2pjqhmz', 'n4fvtc49', '12345678'])('accepts %s', id => {
    expect(looksLikeCanonicalId(id)).toBe(true);
  });

  it.each([
    ['too short', 'a2pjqhm'],
    ['too long', 'a2pjqhmza'],
    ['far too long', 'a'.repeat(5000)],
    ['uppercase', 'A2PJQHMZ'],
    ['not alphanumeric', 'a2pj-hmz'],
    ['a hidden character', 'a2pj​qhmz'],
    ['empty', ''],
  ])('rejects an ID that is %s', (_, id) => {
    expect(looksLikeCanonicalId(id)).toBe(false);
  });

  it('rejects anything that isn’t a single string', () => {
    expect(looksLikeCanonicalId(undefined)).toBe(false);
    expect(looksLikeCanonicalId(['a2pjqhmz'])).toBe(false);
  });
});
