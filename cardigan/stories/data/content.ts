import { faker } from '@faker-js/faker';

import untransformedBody from '@weco/cardigan/stories/data/untransformed-body';
import { Props as QuoteProps } from '@weco/content/components/Quote';
import { Article } from '@weco/content/services/wellcome/content/types/api';
import {
  ArticleBasic,
  Article as TransformedPrismicArticle,
} from '@weco/content/types/articles';
import {
  Organisation as OrganisationType,
  Person as PersonType,
} from '@weco/content/types/contributors';
import { Event } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Season } from '@weco/content/types/seasons';

import {
  contentAPIImage,
  darkCloudImageUrl,
  florenceWinterfloodImageUrl,
  image,
} from './images';
import { smallText } from './text';

faker.seed(123);

export const bannerCardItem: Season = {
  type: 'seasons',
  id: 'bannerCardItem',
  uid: 'what-does-it-mean',
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
  uid: 'event-title',
  title: 'Event title',
  audiences: [],
  availableOnline: true,
  untransformedBody: [],
  bookingType: 'First come, first served',
  contributors: [],
  eventbriteId: '',
  format: { id: 'WlYVBiQAACcAWcu9', title: 'Seminar' },
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
  },
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

export const person: PersonType = {
  type: 'people',
  id: faker.string.uuid(),
  name: faker.person.fullName(),
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
  sameAs: [
    { link: 'https://twitter.com/mbannisy', title: '@mbannisy' },
    { link: 'http://things.com', title: 'things.com' },
    { link: 'https://google.com', title: 'This is it!' },
  ],
};

export const organisation: OrganisationType = {
  type: 'organisations',
  id: faker.string.uuid(),
  name: faker.company.name(),
  description: smallText(),
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

export const article: TransformedPrismicArticle = {
  type: 'articles',
  id: 'YLoCLhAAACEAfyuO',
  uid: 'a-dark-cloud',
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
    },
  ],
  untransformedBody,
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
      uid: 'weewaz',
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
        },
      ],
      untransformedBody: [],
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

export const articleBasic: ArticleBasic = {
  type: 'articles',
  id: 'article-basic',
  uid: 'article-basic',
  promo: article.promo,
  series: [],
  title: article.title,
  datePublished: article.datePublished,
  labels: [],
};

export const exhibitionBasic: ExhibitionBasic = {
  type: 'exhibitions',
  id: 'exhibition-basic',
  uid: 'exhibition-basic',
  title: 'What does it mean to be human now? Four views by CYP x CALLY',
  promo: {
    image: image(florenceWinterfloodImageUrl('3200x1800'), 3200, 1800),
    caption:
      'This installation featured five short films exploring the question of being human during Covid-19 through poetry and monologues. Watch the films online, together with participants. ',
  },
  start: new Date('2021-05-17T23:00:00+0000'),
  end: new Date('2021-09-29T23:00:00+0000'),
  isPermanent: false,
  contributors: [],
  labels: [{ text: 'Exhibition' }],
};

export const contentAPIArticle: Article = {
  type: 'Article',
  id: 'Zz2g4BAAAB8AAs0L',
  uid: 'the-personal-cost-of-mental-illness',
  title: 'The personal cost of mental illness',
  caption:
    'Laura Grace Simpkins is tired of hearing how much her mental ill health costs the country. What about how much it costs her?',
  format: {
    type: 'ArticleFormat',
    id: 'W7TfJRAAAJ1D0eLK',
    label: 'Article',
  },
  publicationDate: '2024-12-11T10:00:07+0000',
  contributors: [
    {
      type: 'Contributor',
      contributor: {
        type: 'Person',
        id: 'YRpIOREAANdN3wpG',
        label: 'Laura Grace Simpkins',
      },
      role: {
        type: 'EditorialContributorRole',
        id: 'WcUWeCgAAFws-nGh',
        label: 'Author',
      },
    },
    {
      type: 'Contributor',
      contributor: {
        type: 'Person',
        id: 'Yw8WwhAAADhyTh92',
        label: 'Tanya Cooper',
      },
      role: {
        type: 'EditorialContributorRole',
        id: 'YEu7zhAAACMAX7IG',
        label: 'Artist',
      },
    },
  ],
  image: contentAPIImage,
};
