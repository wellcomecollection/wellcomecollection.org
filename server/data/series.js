import {List} from 'immutable';

export function getSeriesCommissionedLength(seriesUrl: string): ?number {
  const lookup = { 'electric-sublime': 6 };
  return lookup[seriesUrl];
}

export const series = List([
  ({
    url: 'electric-sublime',
    name: 'Electric Sublime',
    commissionedLength: getSeriesCommissionedLength('electric-sublime'),
    color: 'purple',
    items: List([
      ({
        contentType: 'article',
        headline: 'Thunderbolts and lightning',
        // url: 'thunder-bolts-and-ligtning',
        url: '',
        description: '',
        datePublished: new Date('2017-03-30')
      }: ArticleStub),
      ({
        contentType: 'article',
        headline: 'Eels and feels',
        // url: 'eels-and-feels',
        url: '',
        description: '',
        datePublished: new Date('6 April 2017')
      }: ArticleStub),
      ({
        contentType: 'article',
        headline: 'Charged bodies',
        // url: 'charged-bodies',
        url: '',
        description: '',
        datePublished: new Date('13 April 2017')
      }: ArticleStub),
      ({
        contentType: 'article',
        headline: 'The current that kills',
        // url: 'the-current-that-kills',
        url: '',
        description: '',
        datePublished: new Date('20 April 2017')
      }: ArticleStub),
      ({
        contentType: 'article',
        headline: 'Dazzling luxury',
        // url: 'dazzling-luxury',
        url: '',
        description: '',
        datePublished: new Date('27 April 2017')
      }: ArticleStub),
      ({
        contentType: 'article',
        headline: 'Titans in the landscape',
        // url: 'titans-in-the-landscape',
        url: '',
        description: '',
        datePublished: new Date('4 May 2017')
      }: ArticleStub)
    ])
  }: Series)
]);
