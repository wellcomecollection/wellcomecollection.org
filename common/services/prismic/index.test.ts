import { looksLikePrismicId } from '.';
import { homepageId, prismicPageIds } from '@weco/common/data/hardcoded-ids';

describe('looksLikePrismicId', () => {
  it('thinks Prismic IDs look like Prismic IDs', () => {
    expect(looksLikePrismicId('Wuw2MSIAACtd3StS')).toBeTruthy();
    expect(looksLikePrismicId(prismicPageIds.press)).toBeTruthy();
    expect(looksLikePrismicId(homepageId)).toBeTruthy();
  });

  it('thinks catalogue IDs don’t look like Prismic IDs', () => {
    expect(looksLikePrismicId('va2vy7wb')).toBeFalsy();
    expect(looksLikePrismicId('s42juuaz')).toBeFalsy();
  });

  it('thinks malicious inputs don’t look like Prismic IDs', () => {
    expect(looksLikePrismicId('<script>alert("BOOM!");</script>')).toBeFalsy();
    expect(looksLikePrismicId('DROP TABLE names;')).toBeFalsy();
  });
});
