// Theme block categories config for collections landing page
// TODO need the real concept ids to use

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';

export type ThemeCategory = {
  label: string;
  url?: string;
  concepts: string[];
};

export type ThemeConfig = {
  categories: ThemeCategory[];
};

export const themeBlockCategories: ThemeConfig = {
  categories: [
    {
      label: 'Featured',
      concepts: [
        'bun3pg62',
        'gk2eca5r',
        'e8kur96g',
        'usgkq8dj',
        'ce7rratv',
        'u33bzxsb',
        'zwu7frtk',
        'dujvfptt',
        'khvwwfrk',
      ],
    },
    {
      label: 'People and organisations',
      url: `${prismicPageIds.collections}/people-and-organisations`,
      concepts: [
        'w7yp9m3v',
        'umqzyxwk',
        'up98mqb8',
        'rtwg3paj',
        'q7c2xvdk',
        'gk2eca5r',
        'c24wmx3e',
        'usgkq8dj',
      ],
    },
    {
      label: 'Types and techniques',
      url: `${prismicPageIds.collections}/types-and-techniques`,
      concepts: [
        'pestkwqm',
        'byqnbpfc',
        'ky24m9en',
        'hv3ueb5k',
        'rasp7aye',
        'nns7bsba',
        'qj5kj8rz',
        'a4wyrvq2',
        'ce7rratv',
        'e8kur96g',
      ],
    },
    {
      label: 'Subjects',
      url: `${prismicPageIds.collections}/subjects`,
      concepts: [
        'ec77rqzq',
        'euehm7ng',
        'g6f9sn7t',
        'zbus63qt',
        'u33bzxsb',
        'dujvfptt',
        'bun3pg62',
        'cqm7r9pj',
        'd4r983x6',
      ],
    },
    {
      label: 'Places',
      url: `${prismicPageIds.collections}/places`,
      concepts: [
        'vcqcqced',
        'h8fuyw3g',
        'a7gmt7ff',
        'u4y59z2p',
        'caew98cx',
        'zwu7frtk',
        'nb2nvbwj',
        'khvwwfrk',
        'd5ghwutb',
      ],
    },
  ],
};
