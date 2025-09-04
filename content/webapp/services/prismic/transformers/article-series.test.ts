import { ArticleBasic } from '@weco/content/types/articles';
import { SeriesBasic } from '@weco/content/types/series';

import { sortSeriesItems } from './article-series';

describe('sortSeriesItems', () => {
  it('puts articles in a serial in part number order', () => {
    // Here Prismic has returned the articles in descending date of publication;
    // we want to sort them into serial part number order.

    const series: SeriesBasic = {
      id: 'YxnFmxEAAHzJngrE',
      uid: 'the-hidden-side-of-violence',
      title: 'The Hidden Side of Violence',
      labels: [{ text: 'Serial' }],
      type: 'series',
      schedule: [
        {
          type: 'article-schedule-items',
          id: 'YxnFmxEAAHzJngrE_1',
          title: 'Are people born violent?',
          publishDate: new Date('2022-09-29T09:00:00.000Z'),
          partNumber: 2,
        },
        {
          type: 'article-schedule-items',
          id: 'YxnFmxEAAHzJngrE_0',
          title: 'What is violence?',
          publishDate: new Date('2022-09-22T09:00:00.000Z'),
          partNumber: 1,
        },
        {
          type: 'article-schedule-items',
          id: 'YxnFmxEAAHzJngrE_3',
          title: 'Why do victims become violent?',
          publishDate: new Date('2022-10-13T09:00:00.000Z'),
          partNumber: 4,
        },
        {
          type: 'article-schedule-items',
          id: 'YxnFmxEAAHzJngrE_2',
          title: 'Where does violence come from?',
          publishDate: new Date('2022-10-06T09:00:00.000Z'),
          partNumber: 3,
        },
        {
          type: 'article-schedule-items',
          id: 'YxnFmxEAAHzJngrE_5',
          title: 'How can we prevent violence?',
          publishDate: new Date('2022-10-27T09:00:00.000Z'),
          partNumber: 6,
        },
        {
          type: 'article-schedule-items',
          id: 'YxnFmxEAAHzJngrE_4',
          title: 'What is structural violence?',
          publishDate: new Date('2022-10-20T09:00:00.000Z'),
          partNumber: 5,
        },
      ],
      color: 'accent.salmon',
    };

    const articles: ArticleBasic[] = [
      {
        type: 'articles',
        id: 'Y0-8rxEAAA1CBr3a',
        uid: 'how-can-we-prevent-violence',
        hasLinkedWorks: false,
        title: 'How can we prevent violence?',
        series: [],
        datePublished: new Date('2022-10-27T09:00:00.000Z'),
        labels: [{ text: 'Serial' }],
      },
      {
        type: 'articles',
        id: 'Y0Uv0REAAImM14IP',
        uid: 'what-is-structural-violence',
        hasLinkedWorks: false,
        series: [],
        title: 'What is structural violence?',
        datePublished: new Date('2022-10-20T09:00:00.000Z'),
        labels: [{ text: 'Serial' }],
      },
      {
        type: 'articles',
        id: 'Yz1IdhEAABfUtA8u',
        hasLinkedWorks: false,
        series: [],
        uid: 'why-do-victims-become-violent',
        title: 'Why do victims become violent?',
        datePublished: new Date('2022-10-13T09:00:01.000Z'),
        labels: [{ text: 'Serial' }],
      },
    ];

    const sortedTitles = sortSeriesItems({ series, articles }).map(
      article => article.title
    );

    expect(sortedTitles).toStrictEqual([
      'Why do victims become violent?',
      'What is structural violence?',
      'How can we prevent violence?',
    ]);
  });
});
