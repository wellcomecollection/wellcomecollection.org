import { transformExhibition } from './exhibitions';

const doc = {
  id: 'YjiSFxEAACIAcqpb',
  uid: null,
  url: null,
  type: 'exhibitions',
  href: 'https://wellcomecollection.cdn.prismic.io/api/v2/documents/search?ref=Yp3GcBEAACMAwRd3&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YjiSFxEAACIAcqpb%22%29+%5D%5D',
  tags: [],
  first_publication_date: '2022-03-21T16:39:14+0000',
  last_publication_date: '2022-05-27T14:33:56+0000',
  slugs: ['in-the-air'],
  linked_documents: [],
  lang: 'en-gb',
  alternate_languages: [],
  data: {
    format: { link_type: 'Document' },
    title: [{ type: 'heading1', text: 'In the Air', spans: [] }],
    shortTitle: [],
    body: [
      {
        primary: {
          text: [
            {
              type: 'paragraph',
              text: 'A bracing, uplifting and potentially reinvigorating exploration of the surprisingly long history of fighting for breath',
              spans: [],
            },
          ],
          citation: [{ type: 'paragraph', text: 'The Guardian', spans: [] }],
        },
        items: [],
        slice_type: 'quote',
        slice_label: null,
      },
    ],
    start: '2022-05-18T23:00:00+0000',
    end: '2022-10-15T23:00:00+0000',
    isPermanent: null,
    statusOverride: [],
    bslInfo: [],
    audioDescriptionInfo: [],
    place: {
      id: 'WoLtlioAACoANrY_',
      type: 'places',
      tags: [],
      lang: 'en-gb',
      slug: 'gallery-2',
      first_publication_date: '2018-02-14T09:02:59+0000',
      last_publication_date: '2018-08-16T10:43:31+0000',
      data: {
        level: 1,
        title: [{ type: 'heading1', text: 'Gallery 2', spans: [] }],
        locationInformation: [
          {
            type: 'paragraph',
            text: 'We’ll be in Gallery 2. To get there, go up the stairs or take the lift to level 1.',
            spans: [],
          },
        ],
      },
      link_type: 'Document',
      isBroken: false,
    },
    exhibits: [],
    events: [],
    articles: [],
    accessResourcesPdfs: [],
    contributors: [],
    contributorsTitle: [],
    promo: [
      {
        primary: {
          caption: [
            {
              type: 'paragraph',
              text: 'Explore our relationship with the air around us. Moving freely across borders and through our bodies, air is both vital to our existence and a threat to our health.',
              spans: [],
            },
          ],
          image: {
            dimensions: { width: 4000, height: 2250 },
            alt: 'Colour photograph of three people watching a very large, curved screen. The young man on the left is standing up with his hands behind his back. The young man in the middle is in a wheelchair, to the right of a girl who is sat on a chair. On the screen is a scene showing blue sky and white clouds.',
            copyright:
              'In the Air exhibition. Cloud Studies, digital film with audio. 2021 | Gallery Photo: Steven Pocock | | | | Forensic Architecture |',
            url: 'https://images.prismic.io/wellcomecollection/4449c562-645a-4371-ad21-78f138e0bf59_EP001913_0053.jpg?auto=compress,format',
          },
          link: null,
        },
        items: [],
        slice_type: 'editorialImage',
        slice_label: null,
      },
    ],
    metadataDescription: [],
    seasons: [{ season: { link_type: 'Document' } }],
    parents: [{ order: null, parent: { link_type: 'Document' } }],
  },
};

describe('transformExhibition', () => {
  it('sets a caption on the exhibition', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const exhibition = transformExhibition(doc as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    expect(exhibition.promo?.caption).toBe(
      'Explore our relationship with the air around us. Moving freely across borders and through our bodies, air is both vital to our existence and a threat to our health.'
    );
  });
});
