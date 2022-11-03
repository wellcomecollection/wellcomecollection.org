import { transformPrismicResponse } from '../../services/prismic/transformers';

describe('transformPrismicResponse', () => {
  it('transforms Prismic GraphQL response into result list', async () => {
    const samplePrismicResponse = {
      edges: [
        {
          node: {
            _meta: {
              id: 'X123456',
              firstPublicationDate: '2022-09-08T09:29:27+0000',
            },
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
                      text: 'A cat in a hat, a great story of an ace cat',
                    },
                  ],
                },
              },
            ],
            contributors: [{ contributor: { name: 'Dr. Seuss' } }],
            promo: [
              {
                primary: {
                  image: {
                    dimensions: { width: 4000, height: 2644 },
                    alt: 'Photograph of a a cat in a hat.',
                    copyright:
                      'A cat | Wellcome Collection | https://wellcomecollection.org/works/g8rvn3y7 | CC-BY | | ',
                    url: 'https://images.prismic.io/wellcomecollection/8b6b4b4e-4f1c-4f9e-8c1a-1b0c2b0e8b1a_The+cat+in+the+hat.jpg?auto=compress,format&rect=0,0,2000,2000&w=2000&h=2000',
                  },
                },
              },
            ],
            type: 'articles',
          },
        },
      ],
    };

    const transformResponse = await transformPrismicResponse(
      ['articles'],
      samplePrismicResponse.edges
    );

    expect(transformResponse).toStrictEqual([
      {
        title: 'A cat in a hat',
        summary: 'A cat in a hat, a great story of an ace cat',
        id: 'X123456',
        url: 'https://wellcomecollection.org/articles/X123456',
        firstPublicationDate: '2022-09-08T09:29:27+0000',
        contributors: [
          {
            contributor: {
              name: 'Dr. Seuss',
            },
          },
        ],
        image: {
          url: 'https://images.prismic.io/wellcomecollection/8b6b4b4e-4f1c-4f9e-8c1a-1b0c2b0e8b1a_The+cat+in+the+hat.jpg?auto=compress,format&rect=0,0,2000,2000&w=2000&h=2000',
        },
        type: [
          'articles'
        ],
      },
    ]);
  });
});
