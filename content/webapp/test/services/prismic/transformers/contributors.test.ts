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
      data: {
        contributors: [],
      },
    };

    const contributor = transformContributors(document);

    expect(contributor).toStrictEqual([]);
  });
});
