import { emptyDocument } from '@weco/common/services/prismic/documents';
import { PagePrismicDocument } from '../types/pages';
import { transformPage } from './pages';

export const pageWithoutBody: PagePrismicDocument = {
  ...emptyDocument<PagePrismicDocument>(
    {
      title: [],
      datePublished: null,
      showOnThisPage: false,
      metadataDescription: '',
      availableOnline: false,
      isOnline: false,
      format: {
        link_type: 'Document'
      },
      contributorsTitle: [],
      contributors: [],
      parents: [],
      seasons: [],
      body: [],
      promo: []
    },
  ),
  alternate_languages: [],
  type: 'pages'
};

describe('pages', () => {
  describe('parsePage', () => {
    describe('transformOnThisPage', () => {
      it(`Object onThisPage should return [] if body does not exist`, () => {
        const page = transformPage(pageWithoutBody);
        expect(Array.isArray(page.onThisPage)).toBeTruthy();
        expect(page.onThisPage.length).toBe(0);
      });
    });
  });
});
