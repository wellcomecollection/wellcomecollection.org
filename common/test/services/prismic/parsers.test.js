// @flow
import {
  parseSameAs,
  parseMediaObjectList,
} from '../../../services/prismic/parsers';

export const sameAs = [
  { link: 'https://twitter.com/mbannisy', title: [] },
  { link: 'http://things.com', title: [] },
  {
    link: 'https://google.com',
    title: [{ type: 'heading1', text: 'This is it!', spans: [] }],
  },
];

describe('parsers', () => {
  describe('parseSameAs', () => {
    it('should parse same as correctly', () => {
      const [twitter, url, urlWithTitleOverride] = parseSameAs(sameAs);
      expect(twitter).toEqual({
        link: 'https://twitter.com/mbannisy',
        title: '@mbannisy',
      });
      expect(url).toEqual({ link: 'http://things.com', title: 'things.com' });
      expect(urlWithTitleOverride).toEqual({
        link: 'https://google.com',
        title: 'This is it!',
      });
    });
  });

  describe('parseMediaObjectList', () => {
    const mockDataMissingImageText = [
      {
        content: {
          id: 'X5BeNxIAACEAj7Ze',
          type: 'media-object',
          tags: [],
          slug: 'wear-a-face-covering-hi',
          lang: 'en-gb',
          link_type: 'Document',
          isBroken: false,
          // data: [] -> this is missing image
          data: {
            title: [
              {
                type: 'heading1',
                text: 'Only book for your household or bubble',
                spans: [],
              },
            ],
          },
        },
      },
    ];

    it('Should return data structure if missing image and title content', () => {
      const parseMissingImageText = parseMediaObjectList(
        mockDataMissingImageText
      );
      expect(parseMissingImageText).toEqual([
        {
          id: 'X5BeNxIAACEAj7Ze',
          title: 'Only book for your household or bubble',
          text: null,
          image: null,
        },
      ]);
    });
  });
});
