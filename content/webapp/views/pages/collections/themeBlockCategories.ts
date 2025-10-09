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
      concepts: ['s7d7wjf3', 'gyh3qjn3', 'kd6svu9u', 'uxms5dmz'],
    },
    {
      label: 'Subjects',
      concepts: [
        'zbus63qt',
        'cqm7r9pj',
        'g6f9sn7t',
        'ec77rqzq',
        'pvayfq93',
        'euehm7ng',
        'd4r983x6',
        'bun3pg62',
        'dujvfptt',
        'u33bzxsb',
      ],
    },
    {
      label: 'Types',
      concepts: [
        'zbus63qt',
        'ce7rratv',
        'rasp7aye',
        'byqnbpfc',
        'qj5kj8rz',
        'e8kur96g',
        'a4wyrvq2',
        'ky24m9en',
        'pestkwqm',
      ],
    },
    {
      label: 'People',
      concepts: [
        'usgkq8dj',
        'q7c2xvdk',
        'gk2eca5r',
        'up98mqb8',
        'c24wmx3e',
        'umqzyxwk',
        'rtwg3paj',
        'w7yp9m3v',
      ],
    },
    {
      label: 'Places',
      concepts: [
        'nb2nvbwj',
        'zwu7frtk',
        'a7gmt7ff',
        'h8fuyw3g',
        'khvwwfrk',
        'u4y59z2p',
        'vcqcqced',
        'd5ghwutb',
      ],
    },
  ],
};
