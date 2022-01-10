// @flow
import { parseMediaObjectList } from '../../../services/prismic/parsers';

export const sameAs = [
  { link: 'https://twitter.com/mbannisy', title: [] },
  { link: 'http://things.com', title: [] },
  {
    link: 'https://google.com',
    title: [{ type: 'heading1', text: 'This is it!', spans: [] }],
  },
];

describe('parsers', () => {
  describe('parseMediaObjectList', () => {
    const mockDataMissingImageText = [
      {
        title: [
          {
            type: 'heading1',
            text: 'Only book for your household or bubble',
            spans: [],
          },
        ],
        text: [],
        image: { '32:15': {}, '16:9': {}, square: {} },
      },
    ];

    it('Should return data structure if missing image and title content', () => {
      const parseMissingImageText = parseMediaObjectList(
        mockDataMissingImageText
      );
      expect(parseMissingImageText).toEqual([
        {
          title: 'Only book for your household or bubble',
          text: null,
          image: null,
        },
      ]);
    });
  });
});
