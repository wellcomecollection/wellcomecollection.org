import { HOMEPAGE_UID, prismicPageIds } from '@weco/common/data/hardcoded-ids';

import { looksLikePrismicId } from '.';

describe('looksLikePrismicId', () => {
  it('thinks Prismic IDs look like Prismic IDs', () => {
    expect(looksLikePrismicId('sun')).toBeTruthy();
    expect(looksLikePrismicId('sun-set')).toBeTruthy();
    expect(looksLikePrismicId(prismicPageIds.press)).toBeTruthy();
    expect(looksLikePrismicId(HOMEPAGE_UID)).toBeTruthy();
  });

  it('thinks malicious inputs don’t look like Prismic IDs', () => {
    expect(looksLikePrismicId('<script>alert("BOOM!");</script>')).toBeFalsy();
    expect(looksLikePrismicId('DROP TABLE names;')).toBeFalsy();
  });
});
