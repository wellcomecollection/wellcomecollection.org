import { transformPrismicResponse } from '../../services/prismic/transformers';

describe('transformPrismicResponse', () => {
  it('transforms Prismic GraphQL response into result list', async () => {
    const samplePrismicResponse = {
      totalCount: 30,
      edges: [
        {
          cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          node: {
            _meta: {
              id: 'X123456',
              firstPublicationDate: new Date('2022-09-08T09:29:27+0000'),
              format: { _meta: { id: 'X123456' } },
            },
            format: { __typename: 'ArticleFormats' },
            title: [
              {
                type: 'heading1',
                text: 'A cat in a hat',
              },
            ],
            body: [
              {
                primary: {
                  text: [
                    {
                      type: 'paragraph',
                      text: 'A cat in a hat, a great story of an ace cat',
                    },
                  ],
                },
              },
            ],
            contributors: [
              {
                contributor: {
                  name: 'Willow Wisp',
                },
              },
            ],
            promo: [
              {
                primary: {
                  image: {
                    dimensions: { width: 4000, height: 2667 },
                    alt: 'Colour photograph of salt deposits in evaporation pools. The image is abstract in appearance with few recognisable reference points. This makes it difficult to gauge the scale of the subject matter. The image itself is made up of blue, green and white tones. Most of the image seems to have a ripple pattern of whites and blues which resemble the surface of water, but which could be solid. Towards the top of the image the ripple disappear to leave a more constant tone of blues and greens, speckled with white specks and shapes.',
                    copyright:
                      "Salt deposits in the evaporation pools at the only operating lithium mine in USA. Albemarle's Silver Peak mine, Clayton Valley, Nevada, USA. 2018 | | | | | Matjaž Krivic/INSTITUTE |",
                    url: 'https://images.prismic.io/wellcomecollection/71f733a0-08f5-4137-ad79-b1863ccb6f52_IAM_00089333.jpg?auto=compress,format',
                    '32:15': {
                      dimensions: { width: 3200, height: 1500 },
                      alt: 'Colour photograph of salt deposits in evaporation pools. The image is abstract in appearance with few recognisable reference points. This makes it difficult to gauge the scale of the subject matter. The image itself is made up of blue, green and white tones. Most of the image seems to have a ripple pattern of whites and blues which resemble the surface of water, but which could be solid. Towards the top of the image the ripple disappear to leave a more constant tone of blues and greens, speckled with white specks and shapes.',
                      copyright:
                        "Salt deposits in the evaporation pools at the only operating lithium mine in USA. Albemarle's Silver Peak mine, Clayton Valley, Nevada, USA. 2018 | | | | | Matjaž Krivic/INSTITUTE |",
                      url: 'https://images.prismic.io/wellcomecollection/71f733a0-08f5-4137-ad79-b1863ccb6f52_IAM_00089333.jpg?auto=compress,format&rect=0,293,4000,1875&w=3200&h=1500',
                    },
                    '16:9': {
                      dimensions: { width: 3200, height: 1800 },
                      alt: 'Colour photograph of salt deposits in evaporation pools. The image is abstract in appearance with few recognisable reference points. This makes it difficult to gauge the scale of the subject matter. The image itself is made up of blue, green and white tones. Most of the image seems to have a ripple pattern of whites and blues which resemble the surface of water, but which could be solid. Towards the top of the image the ripple disappear to leave a more constant tone of blues and greens, speckled with white specks and shapes.',
                      copyright:
                        "Salt deposits in the evaporation pools at the only operating lithium mine in USA. Albemarle's Silver Peak mine, Clayton Valley, Nevada, USA. 2018 | | | | | Matjaž Krivic/INSTITUTE |",
                      url: 'https://images.prismic.io/wellcomecollection/71f733a0-08f5-4137-ad79-b1863ccb6f52_IAM_00089333.jpg?auto=compress,format&rect=0,244,4000,2250&w=3200&h=1800',
                    },
                    square: {
                      dimensions: { width: 3200, height: 3200 },
                      alt: 'Colour photograph of salt deposits in evaporation pools. The image is abstract in appearance with few recognisable reference points. This makes it difficult to gauge the scale of the subject matter. The image itself is made up of blue, green and white tones. Most of the image seems to have a ripple pattern of whites and blues which resemble the surface of water, but which could be solid. Towards the top of the image the ripple disappear to leave a more constant tone of blues and greens, speckled with white specks and shapes.',
                      copyright:
                        "Salt deposits in the evaporation pools at the only operating lithium mine in USA. Albemarle's Silver Peak mine, Clayton Valley, Nevada, USA. 2018 | | | | | Matjaž Krivic/INSTITUTE |",
                      url: 'https://images.prismic.io/wellcomecollection/71f733a0-08f5-4137-ad79-b1863ccb6f52_IAM_00089333.jpg?auto=compress,format&rect=477,0,2667,2667&w=3200&h=3200',
                    },
                  },
                  caption: [
                    {
                      type: 'paragraph',
                      text: 'A cat in a hat, a great story of an ace cat',
                    },
                  ],
                },
              },
            ],
            type: 'articles',
          },
        },
      ],
    };

    const { edges } = samplePrismicResponse;

    const transformResponse = await transformPrismicResponse(
      ['articles'],
      edges
    );

    expect(transformResponse).toStrictEqual([
      {
        title: 'A cat in a hat',
        summary: 'A cat in a hat, a great story of an ace cat',
        id: 'X123456',
        url: '/articles/X123456',
        firstPublicationDate: new Date('2022-09-08T09:29:27+0000'),
        contributors: ['Willow Wisp'],
        image: {
          contentUrl:
            'https://images.prismic.io/wellcomecollection/71f733a0-08f5-4137-ad79-b1863ccb6f52_IAM_00089333.jpg?auto=compress,format',
          width: 4000,
          height: 2667,
          alt: 'Colour photograph of salt deposits in evaporation pools. The image is abstract in appearance with few recognisable reference points. This makes it difficult to gauge the scale of the subject matter. The image itself is made up of blue, green and white tones. Most of the image seems to have a ripple pattern of whites and blues which resemble the surface of water, but which could be solid. Towards the top of the image the ripple disappear to leave a more constant tone of blues and greens, speckled with white specks and shapes.',
          tasl: {
            title:
              "Salt deposits in the evaporation pools at the only operating lithium mine in USA. Albemarle's Silver Peak mine, Clayton Valley, Nevada, USA. 2018",
            author: undefined,
            sourceName: undefined,
            sourceLink: undefined,
            license: undefined,
            copyrightHolder: 'Matjaž Krivic/INSTITUTE',
            copyrightLink: undefined,
          },
          simpleCrops: {
            '32:15': {
              contentUrlSuffix: '&rect=0,293,4000,1875&w=3200&h=1500',
              width: 3200,
              height: 1500,
            },
            '16:9': {
              contentUrlSuffix: '&rect=0,244,4000,2250&w=3200&h=1800',
              width: 3200,
              height: 1800,
            },
            square: {
              contentUrlSuffix: '&rect=477,0,2667,2667&w=3200&h=3200',
              width: 3200,
              height: 3200,
            },
          },
          richCrops: undefined,
        },
        label: { text: 'Article' },
        type: ['articles'],
      },
    ]);
  });
});
