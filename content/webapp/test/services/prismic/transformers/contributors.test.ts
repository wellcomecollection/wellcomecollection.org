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
