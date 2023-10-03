import { removeIdiomaticTextTags } from '../../utils/string';

describe('Removes idiomatic text tags from strings', () => {
  it('ignores dates contained within angled brackets', () => {
    const result = removeIdiomaticTextTags(
      'Joseph Frank <1771-1842> und die Brownsche Lehre / [Dr. Richard Müller].'
    );

    expect(result).toEqual(
      'Joseph Frank <1771-1842> und die Brownsche Lehre / [Dr. Richard Müller].'
    );
  });

  it('removes lowercase idiomatic text tags from strings', () => {
    const result = removeIdiomaticTextTags(
      '<i>Physiological Pharmacy</i>- Population Services'
    );

    expect(result).toEqual('Physiological Pharmacy- Population Services');
  });

  it('removes uppercase idiomatic text tags from strings', () => {
    const result = removeIdiomaticTextTags(
      '<I>Physiological Pharmacy</I>- Population Services'
    );

    expect(result).toEqual('Physiological Pharmacy- Population Services');
  });
});
