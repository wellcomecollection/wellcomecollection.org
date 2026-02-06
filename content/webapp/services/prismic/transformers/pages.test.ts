import {
  PagesDocument as RawPagesDocument,
  TextSlice as RawTextSlice,
} from '@weco/common/prismicio-types';
import { emptyDocumentWithUid } from '@weco/common/services/prismic/documents';

import { transformPage } from './pages';

const exampleTextSlice = {
  variation: 'default',
  version: 'initial',
  items: [],
  primary: {
    text: [
      {
        type: 'paragraph',
        text: 'A very short sentence',
        spans: [],
      },
    ],
  },
  id: 'standfirst$cdd0c06c-a8e0-4390-89fb-a1c54a35a335',
  slice_type: 'text',
  slice_label: null,
} as RawTextSlice;

export const pageWithoutBody: RawPagesDocument = {
  ...emptyDocumentWithUid<RawPagesDocument>({
    title: [],
    introText: exampleTextSlice.primary.text,
    datePublished: null,
    showOnThisPage: false,
    metadataDescription: exampleTextSlice.primary.text,
    format: {
      link_type: 'Any' as const, // Marks it as an empty field
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
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const fields = transformPage(doc as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      expect(fields.metadataDescription).toBe(
        'Positive attitudes towards touch are linked with greater wellbeing and lower levels of loneliness, according to a huge new global study investigating public attitudes and experiences of touch.'
      );
    });
  });
});
