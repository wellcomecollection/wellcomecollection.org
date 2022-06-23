import { transformGenericFields } from '.';

describe('transformGenericFields', () => {
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
    };

    const fields = transformGenericFields(doc as any);

    expect(fields.metadataDescription).toBe(
      'Positive attitudes towards touch are linked with greater wellbeing and lower levels of loneliness, according to a huge new global study investigating public attitudes and experiences of touch.'
    );
  });
});
