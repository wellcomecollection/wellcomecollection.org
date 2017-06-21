import {List} from 'immutable';
import type {ArticleStub} from '../model/article-stub';
import type {Series} from '../model/series';

export function getPositionInSeries(tags: {}): ?number {
  const chapterString = 'chapter';
  const chapterTag = Object.keys(tags).find((tag) => tag.toLowerCase().startsWith(chapterString));

  return chapterTag ? parseInt(chapterTag.slice(chapterString.length), 10) : null;
}

export function getSeriesColor(seriesUrl: string): ?string {
  const lookup = {
    'electric-sublime': 'turquoise',
    'the-outsiders': 'orange'
  };
  return lookup[seriesUrl];
}

export function getSeriesCommissionedLength(seriesUrl: string): ?number {
  const lookup = {
    'electric-sublime': 6,
    'the-outsiders': 6
  };
  return lookup[seriesUrl];
}

export const series = List([
  ({
    url: 'body-squabbles',
    name: 'Body Squabbles',
    items: List([
      ({
        contentType: 'comic',
        headline: 'Demodicid Navigation',
        url: ''
      }: ArticleStub)
    ])
  }: Series),
  ({
    url: 'the-outsiders',
    name: 'The Outsiders',
    commissionedLength: getSeriesCommissionedLength('the-outsiders'),
    color: 'orange',
    items: List([
      ({
        contentType: 'article',
        headline: 'The stranger who started an epidemic',
        // url: 'the-stranger',
        url: '',
        description: '',
        datePublished: new Date('2017-06-15')
      }: ArticleStub),
      ({
        contentType: 'article',
        headline: 'The tradesman who confronted the pestilence',
        // url: 'outsiders-the-tradesman',
        url: '',
        description: '',
        datePublished: new Date('2017-06-22')
      }: ArticleStub),
      ({
        contentType: 'article',
        headline: 'The cook who became a pariah',
        // url: 'outsiders-the-cook',
        url: '',
        description: '',
        datePublished: new Date('2017-06-29')
      }: ArticleStub),
      ({
        contentType: 'article',
        headline: 'The colonist who faced the blue terror',
        // url: 'outsiders-the-colonist',
        url: '',
        description: '',
        datePublished: new Date('2017-07-06')
      }: ArticleStub),
      ({
        contentType: 'article',
        headline: 'The child whose town rejected vaccines',
        // url: 'outsiders-the-child',
        url: '',
        description: '',
        datePublished: new Date('2017-07-13')
      }: ArticleStub),
      ({
        contentType: 'article',
        headline: 'The prostitute whose pox inspired feminists',
        // url: 'outsiders-the-prostitute',
        url: '',
        description: '',
        datePublished: new Date('2017-07-20')
      }: ArticleStub)
    ])
  }: Series),
  ({
    url: 'electric-sublime',
    name: 'Electric Sublime',
    commissionedLength: getSeriesCommissionedLength('electric-sublime'),
    color: 'turquoise',
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
  }: Series),
  ({
    url: 'a-drop-in-the-ocean',
    name: 'A Drop in the Ocean',
    items: List([{ contentType: 'article',
      url: '/articles/a-drop-in-the-ocean-daniel-regan',
      headline: 'A drop in the ocean: Daniel Regan',
      description: '<p>Artist Daniel Regan manages his emotions and stays grounded through photography, allowing him to engage in the world around him.</p>\n',
      thumbnail:
      { type: 'picture',
        contentUrl: 'https://wellcomecollection.files.wordpress.com/2017/01/featured-image2.jpg',
        width: 1896,
        height: 1067 },
      datePublished: new Date('10 January 2017'),
      series: [],
      positionInSeries: null },
    { contentType: 'article',
      url: '/articles/a-drop-in-the-ocean-sarah-carpenter',
      headline: 'A drop in the ocean: Sarah Carpenter',
      description: '<p>Art provides a refuge for Sarah Carpenter allowing her to utilise her energy and keep up the momentum of her recovery.</p>\n',
      thumbnail:
      { type: 'picture',
        contentUrl: 'https://wellcomecollection.files.wordpress.com/2016/12/featured-image-cat-2.jpg',
        width: 1200,
        height: 675 },
      datePublished: new Date('8 December 2016'),
      series: [],
      positionInSeries: null },
    { contentType: 'article',
      url: '/articles/a-drop-in-the-ocean-artist-taxi-driver',
      headline: 'A drop in the ocean: Artist Taxi Driver',
      description: '<p>Recounting his experiences with humour, Artist Taxi Driver takes us on a journey through nostalgia, fear and oppression.</p>\n',
      thumbnail:
      { type: 'picture',
        contentUrl: 'https://wellcomecollection.files.wordpress.com/2016/11/featured-image-3.jpg',
        width: 1272,
        height: 715 },
      datePublished: new Date('13 November 2016'),
      series: [],
      positionInSeries: null },
    { contentType: 'article',
      url: '/articles/a-drop-in-the-ocean-in-the-old-asylums',
      headline: 'A drop in the ocean: In the old asylums',
      description: '<p>David Beales confronts the issue of prejudice against the mentally ill by using informative illustration and captions to raise awareness.</p>\n',
      thumbnail:
      { type: 'picture',
        contentUrl: 'https://wellcomecollection.files.wordpress.com/2016/11/featured-image-2.jpg',
        width: 1200,
        height: 675 },
      datePublished: new Date('24 November 2016'),
      series: [],
      positionInSeries: null },
    { contentType: 'article',
      url: '/articles/a-drop-in-the-ocean-suzanne-morris',
      headline: 'A drop in the ocean: Suzanne Morris',
      description: '<p>Core Arts gave Suzanne Morris the confidence to share her poems with the world, raising awareness of Borderline Personality Disorder.</p>\n',
      thumbnail:
      { type: 'picture',
        contentUrl: 'https://wellcomecollection.files.wordpress.com/2016/11/suzanne-morris-featured-image-2.jpg',
        width: 1646,
        height: 926 },
      datePublished: new Date('16 November 2016'),
      series: [],
      positionInSeries: null },
    { contentType: 'article',
      url: '/articles/a-drop-in-the-ocean-the-first-half-hour',
      headline: 'A drop in the ocean: The first half hour',
      description: '<p>Matthew created a sculptural map of Bethlem Royal Hospital from his own perspective, uncovering hidden objects and remnants of past life.</p>\n',
      thumbnail:
      { type: 'picture',
        contentUrl: 'https://wellcomecollection.files.wordpress.com/2016/10/featured-image2.jpg',
        width: 1184,
        height: 666 },
      datePublished: new Date('20 October 2016'),
      series: [],
      positionInSeries: null },
    { contentType: 'article',
      url: '/articles/a-drop-in-the-ocean-karim-harvey',
      headline: 'A drop in the ocean: Karim Harvey',
      description: '<p>Poet Karim Harvey writes about his mental health and how recovery through the mental health maze can happen.</p>\n',
      thumbnail:
      { type: 'picture',
        contentUrl: 'https://wellcomecollection.files.wordpress.com/2016/10/karim-featured-image1-2.jpg',
        width: 1540,
        height: 866 },
      datePublished: new Date('14 October 2016'),
      series: [],
      positionInSeries: null }])
  }: Series)
]);

