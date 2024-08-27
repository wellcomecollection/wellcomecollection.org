import { looksLikePrismicId } from '.';
import { homepageId, prismicPageIds } from '@weco/common/data/hardcoded-ids';

describe('looksLikePrismicId', () => {
  it('thinks Prismic IDs look like Prismic IDs', () => {
    expect(looksLikePrismicId('Wuw2MSIAACtd3StS')).toBeTruthy();
    expect(looksLikePrismicId('sun')).toBeTruthy();
    expect(looksLikePrismicId('sun-set')).toBeTruthy();
    expect(looksLikePrismicId(prismicPageIds.press)).toBeTruthy();
    expect(looksLikePrismicId(homepageId)).toBeTruthy();
  });

  it('thinks malicious inputs don’t look like Prismic IDs', () => {
    expect(looksLikePrismicId('<script>alert("BOOM!");</script>')).toBeFalsy();
    expect(looksLikePrismicId('DROP TABLE names;')).toBeFalsy();
  });
});
