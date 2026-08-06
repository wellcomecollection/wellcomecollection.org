import { removeDisplayMarkupTags } from '@weco/content/utils/string';

describe('Removes display markup tags from strings', () => {
  it('ignores dates contained within angled brackets', () => {
    const result = removeDisplayMarkupTags(
      'Joseph Frank <1771-1842> und die Brownsche Lehre / [Dr. Richard Müller].'
    );

    expect(result).toEqual(
      'Joseph Frank <1771-1842> und die Brownsche Lehre / [Dr. Richard Müller].'
    );
  });

  it('removes lowercase display markup tags from strings', () => {
    const result = removeDisplayMarkupTags(
      '<i>Physiological Pharmacy</i>- Population Services'
    );

    expect(result).toEqual('Physiological Pharmacy- Population Services');
  });

  it('removes uppercase display markup tags from strings', () => {
    const result = removeDisplayMarkupTags(
      '<I>Physiological Pharmacy</I>- Population Services'
    );

    expect(result).toEqual('Physiological Pharmacy- Population Services');
  });

  it('removes superscript and subscript tags from strings', () => {
    const result = removeDisplayMarkupTags(
      "'How to relax in body and mind', Margaret Smith MCSP, 33<sup>1</sup>/<sub>3</sub> rpm"
    );

    expect(result).toEqual(
      "'How to relax in body and mind', Margaret Smith MCSP, 331/3 rpm"
    );
  });

  it('removes paragraph and underline tags from strings', () => {
    const result = removeDisplayMarkupTags(
      '<p>"Polyvarn [<u>sic</u>] Cases and Literature. Battersea. June 1928"'
    );

    expect(result).toEqual(
      '"Polyvarn [sic] Cases and Literature. Battersea. June 1928"'
    );
  });

  it('separates adjacent paragraphs with a space', () => {
    const result = removeDisplayMarkupTags(
      '<p>First paragraph.</p><p>Second paragraph.</p>'
    );

    expect(result).toEqual('First paragraph. Second paragraph.');
  });

  it('leaves malformed tag fragments alone', () => {
    const result = removeDisplayMarkupTags(
      "'Mercurialentis', with A Lister, <i.British Journal of Opthalmology"
    );

    expect(result).toEqual(
      "'Mercurialentis', with A Lister, <i.British Journal of Opthalmology"
    );
  });
});
