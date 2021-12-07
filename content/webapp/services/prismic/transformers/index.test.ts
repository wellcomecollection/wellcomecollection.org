import { PrismicDocument } from '@prismicio/types';
import { emptyDocument } from '@weco/common/services/prismic/documents';
import { transformPromo } from '.';
import { CommonPrismicFields } from '../types';

describe('transformPromo', () => {
  it('accounts for empty promo array', () => {
    const expected = transformPromo(
      emptyDocument<PrismicDocument<CommonPrismicFields>>({
        title: [],
        body: [],
        promo: [],
        metadataDescription: null,
      })
    );

    expect(expected).toStrictEqual(undefined);
  });
});
