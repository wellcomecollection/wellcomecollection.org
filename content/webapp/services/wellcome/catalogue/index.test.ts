import { looksLikeCanonicalId } from '.';

describe('looksLikeCanonicalId', () => {
  it.each(['a2pjqhmz', 'n4fvtc49', 'nv524fkt'])('accepts %s', id => {
    expect(looksLikeCanonicalId(id)).toBe(true);
  });

  it.each([
    ['too short', 'a2pjqhm'],
    ['too long', 'a2pjqhmza'],
    ['far too long', 'a'.repeat(5000)],
    ['starting with a digit', '2apjqhmz'],
    ['containing an o', 'a2pjqhmo'],
    ['containing an i', 'a2pjqhmi'],
    ['containing an l', 'a2pjqhml'],
    ['containing a 0', 'a2pjqhm0'],
    ['containing a 1', 'a2pjqhm1'],
    ['uppercase', 'A2PJQHMZ'],
    ['not alphanumeric', 'a2pj-hmz'],
    ['containing a hidden character', 'a2pj\u200Bhmz'],
    ['empty', ''],
  ])('rejects an ID %s', (_, id) => {
    expect(looksLikeCanonicalId(id)).toBe(false);
  });

  it('rejects anything that isn’t a single string', () => {
    expect(looksLikeCanonicalId(undefined)).toBe(false);
    expect(looksLikeCanonicalId(['a2pjqhmz'])).toBe(false);
  });
});
