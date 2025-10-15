// Theme block categories config for collections landing page
// TODO need the real concept ids to use

export type ThemeCategory = {
  label: string;
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
        'cqm7r9pj',
        'nns7bsba',
        'q7c2xvdk',
        'pestkwqm',
        'up98mqb8',
        'ec77rqzq',
        'rtwg3paj',
        'a4qzxn69',
        'bun3pg62',
        'a2fnh453',
      ],
    },
    {
      label: 'People and organisations',
      concepts: [
        'gk2eca5r',
        'up98mqb8',
        'usgkq8dj',
        'c24wmx3e',
        'umqzyxwk',
        'q7c2xvdk',
        'w7yp9m3v',
        'rtwg3paj',
      ],
    },
    {
      label: 'Types and techniques',
      concepts: [
        'ce7rratv',
        'a4wyrvq2',
        'ky24m9en',
        'hv3ueb5k',
        'qj5kj8rz',
        'rasp7aye',
        'byqnbpfc',
        'pestkwqm',
        'nns7bsba',
        'e8kur96g',
      ],
    },
    {
      label: 'Subjects',
      concepts: [
        'zbus63qt',
        'dujvfptt',
        'u33bzxsb',
        'euehm7ng',
        'ec77rqzq',
        'g6f9sn7t',
        'bun3pg62',
        'cqm7r9pj',
        'd4r983x6',
      ],
    },
    {
      label: 'Places',
      concepts: [
        'd5ghwutb',
        'a7gmt7ff',
        'caew98cx',
        'h8fuyw3g',
        'vcqcqced',
        'u4y59z2p',
        'zwu7frtk',
        'nb2nvbwj',
        'khvwwfrk',
      ],
    },
  ],
};
