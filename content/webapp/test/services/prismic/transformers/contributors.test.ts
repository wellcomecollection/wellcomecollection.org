import {
  transformContributorAgent,
  transformContributors,
} from '@weco/content/services/prismic/transformers/contributors';

describe('transformContributorAgent', () => {
  it('transforms an organisation without a sameAs', () => {
    // From e.g. https://wellcomecollection.org/event-series/WlYT_SQAACcAWccj
    const contributor = transformContributorAgent({
      id: 'W3QzZykAACIAFwFt',
      type: 'organisations',
      tags: [],
      slug: 'bloomsbury-festival',
      lang: 'en-gb',
      data: {
        name: [{ type: 'heading1', text: 'Bloomsbury Festival', spans: [] }],
        image: {
          dimensions: { width: 500, height: 187 },
          alt: null,
          copyright: null,
          url: 'https://images.prismic.io/wellcomecollection/941b71506cf51a7ee74dc46b8cd760e9de3d7ee7_bf2018-logo-web.jpg?auto=compress,format',
          id: '',
          edit: { x: 0, y: 0, zoom: 0, background: '' },
          '32:15': {
            id: '',
            edit: { x: 0, y: 0, zoom: 0, background: '' },
            dimensions: { width: 3200, height: 1500 },
            alt: 'Photograph of an exhibition gallery wall, square on. The wall is a light pink colour and contains a central panel which is set forward from the way, upon which a large colourful old painting is hung. The painting depicts a family portrait with a mother figure a father figure and a young child. At the base of the wall, under the painting is a low white barrier to prevent visitors from getting too close. In front of the painting, standing with their backs to the camera are 3 young people looking at the painting. One stands alone on the left hand side and the other 2 stand together on the right. Either side of the main painting, further small pen and ink artworks can be seen, framed in brown wooden frames.',
            copyright:
              'Joy exhibition | Painting: © Joy Labinjo. Gallery Photo: Steven Pocock | | | CC-BY-NC | |',
            url: 'https://images.prismic.io/wellcomecollection/ce3d3529-53f5-401d-a011-0d444bae99cd_EP_001514_055.jpg?auto=compress,format&rect=0,487,4000,1875&w=3200&h=1500',
          },
          '16:9': {
            id: '',
            edit: { x: 0, y: 0, zoom: 0, background: '' },
            dimensions: { width: 3200, height: 1800 },
            alt: 'Photograph of an exhibition gallery wall, square on. The wall is a light pink colour and contains a central panel which is set forward from the way, upon which a large colourful old painting is hung. The painting depicts a family portrait with a mother figure a father figure and a young child. At the base of the wall, under the painting is a low white barrier to prevent visitors from getting too close. In front of the painting, standing with their backs to the camera are 3 young people looking at the painting. One stands alone on the left hand side and the other 2 stand together on the right. Either side of the main painting, further small pen and ink artworks can be seen, framed in brown wooden frames.',
            copyright:
              'Joy exhibition | Painting: © Joy Labinjo. Gallery Photo: Steven Pocock | | | CC-BY-NC | |',
            url: 'https://images.prismic.io/wellcomecollection/ce3d3529-53f5-401d-a011-0d444bae99cd_EP_001514_055.jpg?auto=compress,format&rect=0,394,4000,2250&w=3200&h=1800',
          },
          square: {
            id: '',
            edit: { x: 0, y: 0, zoom: 0, background: '' },
            dimensions: { width: 3200, height: 3200 },
            alt: 'Photograph of an exhibition gallery wall, square on. The wall is a light pink colour and contains a central panel which is set forward from the way, upon which a large colourful old painting is hung. The painting depicts a family portrait with a mother figure a father figure and a young child. At the base of the wall, under the painting is a low white barrier to prevent visitors from getting too close. In front of the painting, standing with their backs to the camera are 3 young people looking at the painting. One stands alone on the left hand side and the other 2 stand together on the right. Either side of the main painting, further small pen and ink artworks can be seen, framed in brown wooden frames.',
            copyright:
              'Joy exhibition | Painting: © Joy Labinjo. Gallery Photo: Steven Pocock | | | CC-BY-NC | |',
            url: 'https://images.prismic.io/wellcomecollection/ce3d3529-53f5-401d-a011-0d444bae99cd_EP_001514_055.jpg?auto=compress,format&rect=464,0,3232,3232&w=3200&h=3200',
          },
        },
        description: [],
        sameAs: [],
      },
      link_type: 'Document',
      isBroken: false,
    });

    // In the test this will always be true, but types are complaining as it could technically be undefined
    if (contributor) expect(contributor.sameAs).toStrictEqual([]);
  });
});

describe('transformContributors', () => {
  it('transforms a document without contributors', () => {
    // From e.g. https://wellcomecollection.org/guides/YL9OAxIAAB8AHsyv
    const document = {
      title: [
        {
          type: 'heading1',
          text: 'Archives at Wellcome Collection',
          spans: [],
        },
      ],
      id: 'ZZaByxAAAJQ63n4l',
      uid: null,
      url: null,
      type: 'articles',
      tags: [],
      first_publication_date: '2024-02-14T10:00:00+0000',
      last_publication_date: '2024-02-16T09:52:22+0000',
      slugs: [
        'primodos-paternalism-and-the-fight-to-be-heard',
        'primodos-and-two-womens-fight-to-be-heard',
        'primodos-paternalism-and-the-quest-to-be-heard',
        'primodos-paternalism-and-two-womens-quest-to-be-heard',
      ],
      linked_documents: [],
      lang: 'en-gb',
      alternate_languages: [],
      data: {
        contributors: [],
      },
    };

    // @ts-expect-error this transformer expects contributors and they should never be missing if called
    const contributor = transformContributors(document);

    expect(contributor).toStrictEqual([]);
  });
});
