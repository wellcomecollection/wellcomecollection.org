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
    const mockData = [
      {
        content: {
          id: 'X5BeNxIAACEAj7Ze',
          type: 'media-object',
          tags: [],
          slug: 'wear-a-face-covering-hi',
          lang: 'en-gb',
          link_type: 'Document',
          isBroken: false,
          // data: [] -> this is missing from data structure
          data: {
            broken: 'data',
          },
        },
      },
    ];

    it('Should return empty array if data is missing from content in data structure', () => {
      const content = parseMediaObjectList(mockData);
      expect(content).toEqual([]);
    });
  });
});
