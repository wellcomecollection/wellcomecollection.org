import { emptyDocument } from '@weco/common/services/prismic/documents';
import { PagePrismicDocument } from '../types/pages';
import { transformPage } from './pages';

export const pageWithoutBody: PagePrismicDocument = {
  ...emptyDocument<PagePrismicDocument>({
    title: [],
    datePublished: null,
    showOnThisPage: false,
    metadataDescription: '',
    availableOnline: false,
    isOnline: false,
    format: {
      link_type: 'Document',
    },
    contributorsTitle: [],
    contributors: [],
    parents: [],
    seasons: [],
    body: [],
    promo: [],
  }),
  alternate_languages: [],
  type: 'pages',
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

  describe('transformPage', () => {
    it('uses an image-less promo caption as metadataDescription', () => {
      const doc = {
        id: 'X376ZBAAACUAabIF',
        type: 'pages',
        data: {
          title: [
            {
              type: 'heading1',
              text: 'Results revealed for The Touch Test: the world’s largest study of touch',
              spans: [],
            },
          ],
          datePublished: '2020-10-06T09:00:00+0000',
          body: [],
          promo: [
            {
              primary: {
                caption: [
                  {
                    type: 'paragraph',
                    text: 'Positive attitudes towards touch are linked with greater wellbeing and lower levels of loneliness, according to a huge new global study investigating public attitudes and experiences of touch. ',
                    spans: [],
                  },
                ],
                image: {
                  '32:15': {},
                  '16:9': {},
                  square: {},
                },
                link: null,
              },
              items: [],
              slice_type: 'editorialImage',
              slice_label: null,
            },
          ],
          metadataDescription: [],
        },
        tags: [],
      };

      const fields = transformPage(doc as any);

      expect(fields.metadataDescription).toBe(
        'Positive attitudes towards touch are linked with greater wellbeing and lower levels of loneliness, according to a huge new global study investigating public attitudes and experiences of touch.'
      );
    });
  });
});
