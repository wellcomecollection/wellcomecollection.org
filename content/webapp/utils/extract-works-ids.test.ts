import { getWorksIdsFromDocumentBody } from '@weco/content/utils/extract-works-ids';

describe('extract-works-ids', () => {
  describe('getWorksIdsFromDocumentBody', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns empty array when no body is provided', () => {
      expect(getWorksIdsFromDocumentBody(undefined)).toEqual([]);
      expect(getWorksIdsFromDocumentBody([])).toEqual([]);
    });

    it('extracts work IDs from text slice with hyperlinks', () => {
      const documentBody = [
        {
          slice_type: 'text',
          primary: {
            text: [
              {
                type: 'paragraph',
                text: 'Check out this work',
                spans: [
                  {
                    start: 10,
                    end: 20,
                    type: 'hyperlink',
                    data: {
                      link_type: 'Web',
                      url: 'https://wellcomecollection.org/works/abc123def',
                    },
                  },
                ],
              },
            ],
          },
        },
      ] as unknown as Parameters<typeof getWorksIdsFromDocumentBody>[0];

      const result = getWorksIdsFromDocumentBody(documentBody);
      expect(result).toEqual(['abc123def']);
    });

    it('extracts work IDs from editorial image copyright', () => {
      const documentBody = [
        {
          slice_type: 'editorialImage',
          primary: {
            image: {
              copyright:
                'Title | Author | Wellcome Collection | https://wellcomecollection.org/works/xyz789/items | CC-BY | |',
            },
            caption: [],
          },
        },
      ] as unknown as Parameters<typeof getWorksIdsFromDocumentBody>[0];

      const result = getWorksIdsFromDocumentBody(documentBody);
      expect(result).toEqual(['xyz789']);
    });

    it('extracts work IDs from gifVideo tasl field', () => {
      const documentBody = [
        {
          slice_type: 'gifVideo',
          primary: {
            tasl: 'Video title | Creator | Wellcome Collection | https://wellcomecollection.org/works/def456 | CC-BY | |',
            caption: [],
          },
        },
      ] as unknown as Parameters<typeof getWorksIdsFromDocumentBody>[0];

      const result = getWorksIdsFromDocumentBody(documentBody);
      expect(result).toEqual(['def456']);
    });

    it('ignores slices that cannot contain work links', () => {
      const documentBody = [
        {
          slice_type: 'embed',
          primary: {
            embed: { url: 'https://example.com' },
          },
        },
        {
          slice_type: 'quote',
          primary: {
            text: [
              {
                type: 'paragraph',
                text: 'This quote contains a work link',
                spans: [],
              },
            ],
          },
        },
        {
          slice_type: 'audioPlayer',
          primary: {
            title: [
              {
                type: 'paragraph',
                text: 'Audio with work link',
                spans: [],
              },
            ],
          },
        },
        {
          slice_type: 'editorialImage',
          primary: {
            image: {
              copyright:
                'Title | Author | Wellcome Collection | https://wellcomecollection.org/works/should-be-found | CC-BY | |',
            },
            caption: [],
          },
        },
      ] as unknown as Parameters<typeof getWorksIdsFromDocumentBody>[0];

      const result = getWorksIdsFromDocumentBody(documentBody);
      expect(result).toEqual(['should-be-found']);
    });
  });
});
