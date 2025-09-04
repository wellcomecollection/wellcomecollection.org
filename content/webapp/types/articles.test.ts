import { ArticleBasic } from '@weco/content/types/articles';

import { getPartNumberInSeries } from './articles';

describe('getPartNumberInSeries', () => {
  it('finds the part number, if available', () => {
    const article: ArticleBasic = {
      type: 'articles',
      id: 'Y_iu0RQAACYAwp8A',
      uid: 'cataloguing-audrey',
      hasLinkedWorks: false,
      series: [
        {
          id: 'Y_OGkRQAACgAq4ui',
          uid: 'finding-audrey-amiss',
          type: 'series',
          title: 'Finding Audrey Amiss',
          labels: [{ text: 'Serial' }],
          color: 'accent.green',
          schedule: [
            {
              type: 'article-schedule-items',
              id: 'Y_OGkRQAACgAq4ui_0',
              title: 'Who was Audrey Amiss?',
              publishDate: new Date('2023-03-02T00:00:00.000Z'),
              partNumber: 1,
            },
            {
              type: 'article-schedule-items',
              id: 'Y_OGkRQAACgAq4ui_1',
              title: 'Cataloguing Audrey',
              publishDate: new Date('2023-03-09T00:00:00.000Z'),
              partNumber: 2,
            },
          ],
        },
      ],
      title: 'Cataloguing Audrey',
      datePublished: new Date('2023-03-09T14:00:01.000Z'),
      labels: [{ text: 'Serial' }],
    };

    const partNumber = getPartNumberInSeries(article);

    expect(partNumber).toBe(2);
  });

  it('returns undefined if there is no part number', () => {
    const article: ArticleBasic = {
      type: 'articles',
      id: 'Y-0A1hQAACUAjrjg',
      uid: 'stones-for-healing',
      hasLinkedWorks: false,
      series: [
        {
          id: 'WsSUrR8AAL3KGFPF',
          type: 'series',
          uid: 'inside-our-collections',
          title: 'Inside Our Collections',
          labels: [{ text: 'Series' }],
          color: 'accent.blue',
          schedule: [],
        },
      ],
      title: 'Stones for healing',
      format: { id: 'W5uKaCQAACkA3C0T', title: 'In pictures' },
      datePublished: new Date('2023-02-21T10:00:01.000Z'),
      labels: [{ text: 'In pictures' }],
    };

    const partNumber = getPartNumberInSeries(article);

    expect(partNumber).toBeUndefined();
  });
});
