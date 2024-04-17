import { LicenseType } from '@weco/common/model/license';
import { Article } from '@weco/content/types/articles';
import { Event } from '@weco/content/types/events';
import { faker } from '@faker-js/faker';
import { RichTextField as PrismicRichTextField } from '@prismicio/client';
import { Season } from '@weco/content/types/seasons';

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

faker.seed(123);

export const id = randomNumber(1000, 2000);

export const imagesBaseUrl = `${window.location.origin}/images`;

export const florenceWinterfloodImage = `${imagesBaseUrl}/florence-winterflood`;
export const darkCloudImage = `${imagesBaseUrl}/darkcloud-promo`;

export const image = (
  contentUrl = `${imagesBaseUrl}/reading-room-3200x1800.jpg`,
  width = 640,
  height = 360
) => {
  return {
    contentUrl,
    width,
    height,
    alt: 'an image with some alt text',
    tasl: {
      contentUrl,
      title: 'The title of the image',
      author: 'The author',
      sourceName: 'Wellcome Collection',
      sourceLink: 'https://wellcomecollection.org/works',
      license: 'CC-BY-NC' as LicenseType,
    },
  };
};

export const squareImage = (
  contentUrl = `${imagesBaseUrl}/reading-room-clock-3200x3200.jpg`,
  width = 300,
  height = 300
) => {
  return {
    contentUrl,
    width,
    height,
    alt: '',
    tasl: {
      contentUrl,
      title: 'The title of the image',
      author: 'The author',
      sourceName: 'Wellcome Collection',
      sourceLink: 'https://wellcomecollection.org/works',
      license: 'CC-BY-NC' as LicenseType,
    },
  };
};

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

export const url = faker.internet.url();

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
      contentUrl: `${florenceWinterfloodImage}-3200x1800.jpg`,
      width: 3200,
      height: 1800,
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
    },
    link: null,
  },
  image: {
    contentUrl: `${florenceWinterfloodImage}-1600x900.jpg`,
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
        contentUrl: `${florenceWinterfloodImage}-3200x1500.jpg`,
        width: 3200,
        height: 1500,
      },
      '16:9': {
        contentUrl: `${florenceWinterfloodImage}-3200x1800.jpg`,
        width: 3200,
        height: 1800,
      },
      square: {
        contentUrl: `${florenceWinterfloodImage}-3200x3200.jpg`,
        width: 3200,
        height: 3200,
      },
    },
  },
};

export const editorialSeries = [
  {
    name: 'Searching for Genius',
    description: [
      {
        type: 'paragraph',
        text: 'This five-part series is great. ',
        spans: [],
      },
    ],
    color: 'accent.blue',
    schedule: [
      {
        title: [{ type: 'heading1', text: 'First heading', spans: [] }],
        publishDate: '2018-04-18T23: 00: 00+0000',
      },
      {
        title: [{ type: 'heading1', text: 'Second heading', spans: [] }],
        publishDate: '2018-04-25T23: 00: 00+0000',
      },
      {
        title: [{ type: 'heading1', text: 'Third heading', spans: [] }],
        publishDate: '2018-05-02T23: 00: 00+0000',
      },
      {
        title: [{ type: 'heading1', text: 'Fourth heading', spans: [] }],
        publishDate: '2018-05-09T23: 00: 00+0000',
      },
      {
        title: [{ type: 'heading1', text: 'Fifth heading', spans: [] }],
        publishDate: '2018-05-16T23: 00: 00+0000',
      },
    ],
    promo: [],
  },
];

export const eventSeries = [
  {
    id: 'Wn28GCoAACkAIYol',
    title: 'The Evidence:  Civilisations and Health',
    description: [
      {
        type: 'paragraph',
        text: 'The BBC World Service is joining forces with Wellcome Collection for this series of events and radio programmes exploring health in the context of society and civilisation. ',
        spans: [],
      },
    ],
  },
];

export const eventSchedule = [
  {
    event: {
      id: 'Wo1c-CoAACoAZG2p',
      type: 'events',
      tags: ['delist'],
      slug: 'creative-activities',
      lang: 'en-gb',
      link_type: 'Document',
      isBroken: false,
    },
    hideLink: null,
  },
  {
    event: {
      id: 'Wo1ZxioAAMLuZF_Q',
      type: 'events',
      tags: ['delist'],
      slug: 'shakti-and-seva-gender-and-health-in-south-asia',
      lang: 'en-gb',
      link_type: 'Document',
      isBroken: false,
    },
    hideLink: null,
  },
  {
    event: {
      id: 'Wo1bOSoAAHW6ZGYC',
      type: 'events',
      tags: ['delist'],
      slug: 'music-from-club-kali',
      lang: 'en-gb',
      link_type: 'Document',
      isBroken: false,
    },
    hideLink: null,
  },
];

export const captionedImage = () => ({
  image: image(),

  caption: [
    {
      type: 'paragraph',
      text: faker.random.words(10),
      spans: [],
    },
  ],
});

export const singleLineOfText = () => faker.random.words(7);

export const prismicRichTextMultiline = [
  {
    type: 'heading2',
    text: 'In consectetur urna turpis, eu egestas elit ultricies ac. ',
    spans: [],
  },
  {
    type: 'paragraph',
    text: 'Sed feugiat diam non mattis dignissim. Morbi vel pharetra dolor. Suspendisse viverra hendrerit leo a viverra. Vestibulum pharetra, tellus eu vestibulum hendrerit, ex justo condimentum nunc, eget varius lectus ante non erat. Etiam ac erat interdum, ultricies purus ac, malesuada nisi.',
    spans: [],
  },
  {
    type: 'heading3',
    text: 'Sed feugiat diam non mattis dignissim.',
    spans: [],
  },
  {
    type: 'paragraph',
    text: 'In consectetur urna turpis, eu egestas elit ultricies ac. Curabitur a urna velit. Maecenas vel pellentesque risus. Morbi ex sem, vestibulum id accumsan luctus, vehicula quis ipsum. Fusce nec felis mauris. Duis ornare odio interdum, consectetur nisi quis, blandit urna. Vestibulum imperdiet eu neque non tincidunt. Donec facilisis semper pulvinar.',
    spans: [],
  },
  {
    type: 'paragraph',
    text: 'Sed feugiat diam non mattis dignissim. Morbi vel pharetra dolor. Suspendisse viverra hendrerit leo a viverra. Vestibulum pharetra, tellus eu vestibulum hendrerit, ex justo condimentum nunc, eget varius lectus ante non erat. Etiam ac erat interdum, ultricies purus ac, malesuada nisi.',
    spans: [],
  },
  {
    type: 'paragraph',
    text: 'Sed feugiat diam non mattis dignissim. Morbi vel pharetra dolor. Suspendisse viverra hendrerit leo a viverra. Vestibulum pharetra, tellus eu vestibulum hendrerit, ex justo condimentum nunc, eget varius lectus ante non erat. Etiam ac erat interdum, ultricies purus ac, malesuada nisi.',
    spans: [],
  },
] as PrismicRichTextField;

export const text = () =>
  Array(2).fill({
    type: 'paragraph',
    text: `${faker.random.words(30)}`,
    spans: [],
  });

export const smallText = () => [
  {
    type: 'paragraph',
    text: `${faker.random.words(20)}`,
    spans: [],
  },
];

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
    contentUrl: `${darkCloudImage}-1600x900.png`,
    width: 1600,
    height: 900,
    alt: 'A cartoon figure has a dark cloud wrapped around them. Both have a solemn look on their face.',
    tasl: {
      title: 'Weewaaz',
    },
    simpleCrops: {
      '32:15': {
        contentUrl: `${darkCloudImage}-3200x1500.png`,
        width: 3200,
        height: 1500,
      },
      '16:9': {
        contentUrl: `${darkCloudImage}-3200x1800.png`,
        width: 3200,
        height: 1800,
      },
      square: {
        contentUrl: `${darkCloudImage}-3200x3200.png`,
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
      contentUrl: `${darkCloudImage}-3200x1800.png`,
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

export const imageGallery = () => {
  const items = Array(4).fill(captionedImage());
  return {
    id: '123',
    title: singleLineOfText(),
    items,
  };
};

export const quote = () => ({
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
});

const sameAs = [
  { link: 'https://twitter.com/mbannisy', title: '@mbannisy' },
  { link: 'http://things.com', title: 'things.com' },
  { link: 'https://google.com', title: 'This is it!' },
];

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
          contentUrl: `${darkCloudImage}-3200x3200.png`,
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
              contentUrl: `${darkCloudImage}-1600x900.png`,
              width: 1600,
              height: 900,
              alt: 'A cartoon figure has a dark cloud wrapped around them. Both have a solemn look on their face.',
              tasl: {
                title: 'Weewaaz',
              },
              simpleCrops: {
                '32:15': {
                  contentUrl: `${darkCloudImage}-3200x1500.png`,
                  width: 3200,
                  height: 1500,
                },
                '16:9': {
                  contentUrl: `${darkCloudImage}-3200x1800.png`,
                  width: 3200,
                  height: 1800,
                },
                square: {
                  contentUrl: `${darkCloudImage}-3200x3200.png`,
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
      contentUrl: `${darkCloudImage}-3200x1800.png`,
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
    contentUrl: `${darkCloudImage}-1600x900.png`,
    width: 1600,
    height: 900,
    alt: 'A cartoon figure has a dark cloud wrapped around them. Both have a solemn look on their face.',
    tasl: {
      title: 'Weewaaz',
    },
    simpleCrops: {
      '32:15': {
        contentUrl: `${darkCloudImage}-3200x1500.png`,
        width: 3200,
        height: 1500,
      },
      '16:9': {
        contentUrl: `${darkCloudImage}-3200x1800.png`,
        width: 3200,
        height: 1800,
      },
      square: {
        contentUrl: `${darkCloudImage}-3200x3200.png`,
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
              contentUrl: `${darkCloudImage}-3200x3200.png`,
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
          contentUrl: `${darkCloudImage}-3200x1800.png`,
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
        contentUrl: `${darkCloudImage}-1600x900.png`,
        width: 1600,
        height: 900,
        alt: 'Person holding a large red love heart, smiling.',
        tasl: {
          title: 'Weewaaz',
        },
        simpleCrops: {
          '32:15': {
            contentUrl: `${darkCloudImage}-3200x1500.png`,
            width: 3200,
            height: 1500,
          },
          '16:9': {
            contentUrl: `${darkCloudImage}-3200x1800.png`,
            width: 3200,
            height: 1800,
          },
          square: {
            contentUrl: `${darkCloudImage}-3200x3200.png`,
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
