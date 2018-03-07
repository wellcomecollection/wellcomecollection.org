import {List} from 'immutable';

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
      })
    ])
  }),
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
      }),
      ({
        contentType: 'article',
        headline: 'The tradesman who confronted the pestilence',
        // url: 'outsiders-the-tradesman',
        url: '',
        description: '',
        datePublished: new Date('2017-06-22')
      }),
      ({
        contentType: 'article',
        headline: 'The cook who became a pariah',
        // url: 'outsiders-the-cook',
        url: '',
        description: '',
        datePublished: new Date('2017-06-29')
      }),
      ({
        contentType: 'article',
        headline: 'The colonist who faced the blue terror',
        // url: 'outsiders-the-colonist',
        url: '',
        description: '',
        datePublished: new Date('2017-07-06')
      }),
      ({
        contentType: 'article',
        headline: 'The child whose town rejected vaccines',
        // url: 'outsiders-the-child',
        url: '',
        description: '',
        datePublished: new Date('2017-07-13')
      }),
      ({
        contentType: 'article',
        headline: 'The prostitute whose pox inspired feminists',
        // url: 'outsiders-the-prostitute',
        url: '',
        description: '',
        datePublished: new Date('2017-07-20')
      })
    ])
  }),
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
      }),
      ({
        contentType: 'article',
        headline: 'Eels and feels',
        // url: 'eels-and-feels',
        url: '',
        description: '',
        datePublished: new Date('6 April 2017')
      }),
      ({
        contentType: 'article',
        headline: 'Charged bodies',
        // url: 'charged-bodies',
        url: '',
        description: '',
        datePublished: new Date('13 April 2017')
      }),
      ({
        contentType: 'article',
        headline: 'The current that kills',
        // url: 'the-current-that-kills',
        url: '',
        description: '',
        datePublished: new Date('20 April 2017')
      }),
      ({
        contentType: 'article',
        headline: 'Dazzling luxury',
        // url: 'dazzling-luxury',
        url: '',
        description: '',
        datePublished: new Date('27 April 2017')
      }),
      ({
        contentType: 'article',
        headline: 'Titans in the landscape',
        // url: 'titans-in-the-landscape',
        url: '',
        description: '',
        datePublished: new Date('4 May 2017')
      })
    ])
  })
]);

export const collectorsPromo = {
  modifiers: ['standalone'],
  url: 'http://digitalstories.wellcomecollection.org/pathways/2-the-collectors/',
  title: 'The Collectors',
  description: 'Searchers, secrets and the power of curiosity.',
  image: {
    contentUrl: 'https://wellcomecollection.files.wordpress.com/2017/03/the-collectors-promo.jpg',
    width: 1600,
    height: 900
  },
  positionInSeries: 1,
  series: [{
    color: 'turquoise',
    commissionedLength: 1,
    items: {
      size: 1
    }
  }]
};
