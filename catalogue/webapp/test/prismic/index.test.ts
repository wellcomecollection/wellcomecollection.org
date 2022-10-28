import { transformStories } from '../../services/prismic';

it('transforms Prismic GraphQL response into result list', async () => {
  const samplePrismicResponse = {
    edges: [
      {
        node: {
          _meta: {
            id: 'X123456',
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
                text: 'A cat in a hat',
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
          type: 'Story',
        },
      },
    ],
  };

  const transformResponse = await transformStories(samplePrismicResponse);

  expect(transformResponse).toStrictEqual([
    {
      id: 'X123456',
      title: [
        {
          type: 'heading1',
          text: 'A cat in a hat',
        },
      ],
      contributors: [{ contributor: { name: 'Dr. Seuss' } }],
      standfirst: {
        text: 'A cat in a hat',
      },
      image: {
        image: {
          dimensions: { width: 4000, height: 2644 },
          alt: 'Photograph of a a cat in a hat.',
          copyright:
            'A cat | Wellcome Collection | https://wellcomecollection.org/works/g8rvn3y7 | CC-BY | | ',
          url: 'https://images.prismic.io/wellcomecollection/8b6b4b4e-4f1c-4f9e-8c1a-1b0c2b0e8b1a_The+cat+in+the+hat.jpg?auto=compress,format&rect=0,0,2000,2000&w=2000&h=2000',
        },
      },
      type: 'Story',
    },
  ]);
});
