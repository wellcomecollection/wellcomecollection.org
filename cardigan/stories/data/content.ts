import { Article } from '@weco/content/types/articles';
import { Event } from '@weco/content/types/events';
import { faker } from '@faker-js/faker';
import { Season } from '@weco/content/types/seasons';
import { darkCloudImageUrl, florenceWinterfloodImageUrl } from './images';
import { smallText } from './text';
import { Props as QuoteProps } from '@weco/content/components/Quote/Quote';

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

faker.seed(123);

export const id = randomNumber(1000, 2000);
export const url = faker.internet.url();

const sameAs = [
  { link: 'https://twitter.com/mbannisy', title: '@mbannisy' },
  { link: 'http://things.com', title: 'things.com' },
  { link: 'https://google.com', title: 'This is it!' },
];

export const interpretations = [
  {
    interpretationType: {
      id: 'id',
      title: 'British sign language interpreted',
      description: '',
      primaryDescription: '',
    },
    isPrimary: false,
  },
  {
    interpretationType: {
      id: 'id',
      title: 'Audio described',
      description: '',
      primaryDescription: '',
    },
    isPrimary: false,
  },
  {
    interpretationType: {
      id: 'id',
      title: 'Speech-to-Text',
      description: '',
      primaryDescription: '',
    },
    isPrimary: true,
  },
  {
    interpretationType: {
      id: 'id',
      title: 'Hearing loop',
      description: '',
      primaryDescription: '',
    },
    isPrimary: false,
  },
];

export const bannerCardItem: Season = {
  type: 'seasons',
  id: 'bannerCardItem',
  body: [],
  untransformedBody: [],
  labels: [],
  title: 'What does it mean to be human, now?',
  start: new Date('2021-01-05T00:00:00.000Z'),
  end: new Date('2021-01-26T00:00:00.000Z'),
  promo: {
    caption:
      'Our new season explores the intertwined connections between the individual, societal and global health.',
    image: {
      contentUrl: florenceWinterfloodImageUrl('3200x1800'),
      width: 3200,
      height: 1800,
      alt: 'An image with an alt text.',
      tasl: {
        title: "Alzheimer's disease",
        author: 'Florence Winterflood',
        sourceName: 'Wellcome Collection',
        sourceLink: 'CC-BY-NC',
        license: undefined,
        copyrightHolder: undefined,
        copyrightLink: undefined,
      },
    },
    link: null,
  },
  image: {
    contentUrl: florenceWinterfloodImageUrl('1600x900'),
    width: 1600,
    height: 900,
    alt: 'An artwork featuring a large painted human hand, surrounded by fragments of maps.',
    tasl: {
      title: "Alzheimer's disease",
      author: 'Florence Winterflood',
      sourceName: 'Wellcome Collection',
      sourceLink: 'CC-BY-NC',
      license: undefined,
      copyrightHolder: undefined,
      copyrightLink: undefined,
    },
    simpleCrops: {
      '32:15': {
        contentUrl: florenceWinterfloodImageUrl('3200x1500'),
        width: 3200,
        height: 1500,
      },
      '16:9': {
        contentUrl: florenceWinterfloodImageUrl('3200x1800'),
        width: 3200,
        height: 1800,
      },
      square: {
        contentUrl: florenceWinterfloodImageUrl('3200x3200'),
        width: 3200,
        height: 3200,
      },
    },
  },
};

export const videoEmbed = {
  embedUrl: 'https://www.youtube.com/embed/l0A8-DmX0Z0?feature=oembed',
};

export const event: Event = {
  type: 'events',
  id: 'x123',
  title: 'Event title',
  audiences: [],
  availableOnline: true,
  body: [],
  untransformedBody: [],
  bookingInformation: null,
  bookingType: 'First come, first served',
  contributors: [],
  cost: null,
  eventbriteId: '',
  format: { id: 'WlYVBiQAACcAWcu9', title: 'Seminar', description: null },
  hasEarlyRegistration: false,
  image: {
    contentUrl: darkCloudImageUrl('1600x900'),
    width: 1600,
    height: 900,
    alt: 'A cartoon figure has a dark cloud wrapped around them. Both have a solemn look on their face.',
    tasl: {
      title: 'Weewaaz',
    },
    simpleCrops: {
      '32:15': {
        contentUrl: darkCloudImageUrl('3200x1500'),
        width: 3200,
        height: 1500,
      },
      '16:9': {
        contentUrl: darkCloudImageUrl('3200x1800'),
        width: 3200,
        height: 1800,
      },
      square: {
        contentUrl: darkCloudImageUrl('3200x3200'),
        width: 3200,
        height: 3200,
      },
    },
  },
  interpretations: [],
  isCompletelySoldOut: false,
  isPast: false,
  isOnline: true,
  labels: [],
  locations: [
    {
      id: 'WoLtUioAACkANrUM',
      title: 'Viewing Room',
      body: [],
      untransformedBody: [],
      labels: [],
      level: 2,
      capacity: 20,
      information: [
        {
          type: 'paragraph',
          text: 'We’ll be in the Viewing Room. It’s next to the Library entrance on level 2, which you can reach by taking the lift or the stairs.',
          spans: [],
        },
      ],
    },
  ],
  onlineHasEarlyRegistration: false,
  onlinePolicies: [],
  policies: [
    {
      id: 'W3RLAikAACcAF2oO',
      title: 'Limited spaces available',
      description: [
        {
          type: 'paragraph',
          text: 'You can claim your place for this event 15 minutes before it starts. Spaces are first come, first served and may run out if we are busy.',
          spans: [],
        },
      ],
    },
  ],
  primaryLabels: [{ text: 'Seminar' }],
  promo: {
    caption: 'Do you have any dark clouds following you?',
    image: {
      contentUrl: darkCloudImageUrl('3200x1800'),
      width: 3200,
      height: 1800,
      alt: 'A cartoon figure has a dark cloud wrapped around them. Both have a solemn look on their face.',
      tasl: {
        title: 'Weewaaz',
      },
    },
    link: null,
  },
  ticketSalesStart: null,
  times: [
    {
      range: {
        startDateTime: new Date('2018-10-23T17:00:00.000Z'),
        endDateTime: new Date('2018-10-23T18:30:00.000Z'),
      },
      isFullyBooked: { inVenue: false, online: false },
    },
  ],
  seasons: [],
  schedule: [],
  secondaryLabels: [],
  series: [],
};

export const quote: QuoteProps = {
  text: [
    {
      type: 'paragraph',
      text: `Said Hamlet to Ophelia,\nI'll draw a sketch of thee,\nWhat kind of pencil shall I use?\n2B or not 2B?`,
      spans: [],
    },
  ],
  citation: [
    {
      type: 'paragraph',
      text: 'Spike Milligan – A Silly Poem',
      spans: [
        {
          type: 'hyperlink',
          start: 0,
          end: 29,
          data: {
            link_type: 'Web',
            url: 'https://www.poemhunter.com/poem/a-silly-poem/',
          },
        },
      ],
    },
  ],
  isPullOrReview: false,
};

export function person() {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    description: smallText(),
    image: {
      contentUrl: faker.image.avatar(),
      width: 120,
      height: 120,
      alt: 'Avatar',
      tasl: {
        title: 'Avatar',
      },
    },
    sameAs,
  };
}

export function organisation() {
  return {
    id: faker.datatype.uuid(),
    name: faker.company.name(),
    description: smallText(),
    url: 'https://wellcomecollection.org',
    image: {
      contentUrl:
        'https://vignette.wikia.nocookie.net/logopedia/images/4/42/BBC_Worldwide_1995.svg/revision/latest?cb=20180114133014',
      width: 3200,
      height: 3200,
      alt: 'Weewaaz',
      tasl: {
        title: 'Weewaaz',
      },
    },
    sameAs: [],
  };
}

export const article: Article = {
  type: 'articles',
  id: 'YLoCLhAAACEAfyuO',
  title: 'A dark cloud',
  contributors: [
    {
      role: {
        id: 'XVQa_xMAACMAqbwo',
        title: 'Illustrator',
        describedBy: 'artwork',
      },
      contributor: {
        type: 'people',
        id: 'YJ5GbRAAACMA_XnW',
        name: 'Weewaaz',
        image: {
          contentUrl: darkCloudImageUrl('3200x3200'),
          width: 3200,
          height: 3200,
          alt: 'Weewaaz',
          tasl: {
            title: 'Weewaaz',
          },
        },
        description: [
          {
            type: 'paragraph',
            text: 'Nikolina Sika (aka Weewaaz) is a 26 year old non-binary artist and visual designer from Brisbane, Australia. You can find them working mostly digitally but often painting, embroidering and sculpting. Creating fun, funky and hopefully uplifting work for you.',
            spans: [],
          },
        ],
        sameAs: [
          {
            link: 'https://www.instagram.com/weewaaz/',
            title: 'Weewaaz on Instagram',
          },
        ],
      },
      description: null,
    },
  ],
  body: [
    {
      type: 'imageGallery',
      weight: 'standalone',
      value: {
        title: '',
        isStandalone: false,
        isFrames: false,
        items: [
          {
            image: {
              contentUrl: darkCloudImageUrl('1600x900'),
              width: 1600,
              height: 900,
              alt: 'A cartoon figure has a dark cloud wrapped around them. Both have a solemn look on their face.',
              tasl: {
                title: 'Weewaaz',
              },
              simpleCrops: {
                '32:15': {
                  contentUrl: darkCloudImageUrl('3200x1500'),
                  width: 3200,
                  height: 1500,
                },
                '16:9': {
                  contentUrl: darkCloudImageUrl('3200x1800'),
                  width: 3200,
                  height: 1800,
                },
                square: {
                  contentUrl: darkCloudImageUrl('3200x3200'),
                  width: 3200,
                  height: 3200,
                },
              },
            },
            hasRoundedCorners: false,
            caption: [],
          },
        ],
      },
    },
  ],
  untransformedBody: [],
  promo: {
    caption: 'Do you have any dark clouds following you?',
    image: {
      contentUrl: darkCloudImageUrl('3200x1800'),
      width: 3200,
      height: 1800,
      alt: 'A cartoon figure has a dark cloud wrapped around them. Both have a solemn look on their face.',
      tasl: {
        title: 'Weewaaz',
      },
    },
    link: null,
  },
  image: {
    contentUrl: darkCloudImageUrl('1600x900'),
    width: 1600,
    height: 900,
    alt: 'A cartoon figure has a dark cloud wrapped around them. Both have a solemn look on their face.',
    tasl: {
      title: 'Weewaaz',
    },
    simpleCrops: {
      '32:15': {
        contentUrl: darkCloudImageUrl('3200x1500'),
        width: 3200,
        height: 1500,
      },
      '16:9': {
        contentUrl: darkCloudImageUrl('3200x1800'),
        width: 3200,
        height: 1800,
      },
      square: {
        contentUrl: darkCloudImageUrl('3200x3200'),
        width: 3200,
        height: 3200,
      },
    },
  },
  metadataDescription: '',
  labels: [
    {
      text: 'Comic',
    },
  ],
  format: {
    id: 'W7d_ghAAALWY3Ujc',
    title: 'Comic',
  },
  datePublished: new Date(2021, 5, 3, 10, 15, 49),
  series: [
    {
      id: 'YJ5KTBAAACEA_Yrk',
      title: 'Weewaaz',
      contributors: [
        {
          role: {
            id: 'XVQa_xMAACMAqbwo',
            title: 'Illustrator',
            describedBy: 'artwork',
          },
          contributor: {
            type: 'people',
            id: 'YJ5GbRAAACMA_XnW',
            name: 'Weewaaz',
            image: {
              contentUrl: darkCloudImageUrl('3200x3200'),
              width: 3200,
              height: 3200,
              alt: 'Weewaaz',
              tasl: {
                title: 'Weewaaz',
              },
            },
            description: [
              {
                type: 'paragraph',
                text: 'Nikolina Sika (aka Weewaaz) is a 26 year old non-binary artist and visual designer from Brisbane, Australia. You can find them working mostly digitally but often painting, embroidering and sculpting. Creating fun, funky and hopefully uplifting work for you.',
                spans: [],
              },
            ],
            sameAs: [
              {
                link: 'https://www.instagram.com/weewaaz/',
                title: 'Weewaaz on Instagram',
              },
            ],
          },
          description: null,
        },
      ],
      body: [],
      untransformedBody: [],
      standfirst: null,
      promo: {
        caption: '',
        image: {
          contentUrl: darkCloudImageUrl('3200x1800'),
          width: 3200,
          height: 1800,
          alt: 'Person holding a large red love heart, smiling.',
          tasl: {
            title: 'Weewaaz',
          },
        },
        link: null,
      },
      image: {
        contentUrl: darkCloudImageUrl('1600x900'),
        width: 1600,
        height: 900,
        alt: 'Person holding a large red love heart, smiling.',
        tasl: {
          title: 'Weewaaz',
        },
        simpleCrops: {
          '32:15': {
            contentUrl: darkCloudImageUrl('3200x1500'),
            width: 3200,
            height: 1500,
          },
          '16:9': {
            contentUrl: darkCloudImageUrl('3200x1800'),
            width: 3200,
            height: 1800,
          },
          square: {
            contentUrl: darkCloudImageUrl('3200x3200'),
            width: 3200,
            height: 3200,
          },
        },
      },
      labels: [
        {
          text: 'Series',
        },
      ],
      type: 'series',
      schedule: [],
      color: 'accent.green',
      items: [],
      seasons: [],
    },
  ],
  seasons: [],
};

export const articleBasic = {
  type: 'articles',
  id: 'article-basic',
  promo: article.promo,
  series: [],
  title: article.title,
  datePublished: article.datePublished,
  labels: [],
};
