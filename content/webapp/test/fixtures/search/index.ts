import { ImageResults, WorkTypes } from '@weco/content/pages/search';
import {
  Addressable,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';

export const clientSideWorkTypesResults: WorkTypes = {
  workTypeBuckets: [
    {
      data: { id: 'a', label: 'Books' },
      count: 3066,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'h', label: 'Archives and manuscripts' },
      count: 2566,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'g', label: 'Videos' },
      count: 584,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'v', label: 'E-books' },
      count: 426,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'k', label: 'Pictures' },
      count: 358,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'l', label: 'Ephemera' },
      count: 347,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'q', label: 'Digital Images' },
      count: 183,
      type: 'AggregationBucket',
    },
    { data: { id: 'n', label: 'Film' }, count: 107, type: 'AggregationBucket' },
    { data: { id: 'i', label: 'Audio' }, count: 95, type: 'AggregationBucket' },
    {
      data: { id: 'j', label: 'E-journals' },
      count: 16,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'd', label: 'Journals' },
      count: 15,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'hdig', label: 'Born-digital archives' },
      count: 13,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'r', label: '3-D Objects' },
      count: 2,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'm', label: 'CD-Roms' },
      count: 2,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'b', label: 'Manuscripts' },
      count: 2,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'p', label: 'Mixed materials' },
      count: 1,
      type: 'AggregationBucket',
    },
    {
      data: { id: 'w', label: 'Student dissertations' },
      count: 1,
      type: 'AggregationBucket',
    },
  ],
  totalResults: 7784,
  requestUrl:
    'https://api.wellcomecollection.org/catalogue/v2/works?query=test&aggregations=workType&include=production%2Ccontributors%2CpartOf&pageSize=1',
};

export const clientSideImagesResults: ImageResults = {
  totalResults: 1251,
  results: [
    {
      locations: [
        {
          url: 'https://iiif.wellcomecollection.org/image/b28666112_0001.jp2/info.json',
          license: {
            id: 'inc',
            label: 'In copyright',
            url: 'http://rightsstatements.org/vocab/InC/1.0/',
            type: 'License',
          },
          accessConditions: [
            {
              method: {
                id: 'view-online',
                label: 'View online',
                type: 'AccessMethod',
              },
              status: { id: 'open', label: 'Open', type: 'AccessStatus' },
              type: 'AccessCondition',
            },
          ],
          locationType: {
            id: 'iiif-image',
            label: 'IIIF Image API',
            type: 'LocationType',
          },
          type: 'DigitalLocation',
        },
        {
          url: 'https://iiif.wellcomecollection.org/presentation/v2/b28666112',
          license: {
            id: 'inc',
            label: 'In copyright',
            url: 'http://rightsstatements.org/vocab/InC/1.0/',
            type: 'License',
          },
          accessConditions: [
            {
              method: {
                id: 'view-online',
                label: 'View online',
                type: 'AccessMethod',
              },
              status: { id: 'open', label: 'Open', type: 'AccessStatus' },
              type: 'AccessCondition',
            },
          ],
          locationType: {
            id: 'iiif-presentation',
            label: 'IIIF Presentation API',
            type: 'LocationType',
          },
          type: 'DigitalLocation',
        },
      ],
      source: {
        id: 'vmwda9zv',
        title: 'AIDS and HIV : HIV antibody : to test or not to test?.',
        type: 'Work',
      },
      aspectRatio: 1.3745705,
      thumbnail: {
        url: 'https://iiif.wellcomecollection.org/image/b28666112_0001.jp2/info.json',
        license: {
          id: 'inc',
          label: 'In copyright',
          url: 'http://rightsstatements.org/vocab/InC/1.0/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: { id: 'open', label: 'Open', type: 'AccessStatus' },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
      averageColor: '#c58c86',
      id: 'grcmx3xd',
      type: 'Image',
      src: 'https://iiif.wellcomecollection.org/image/b28666112_0001.jp2/info.json',
      width: 137.45704999999998,
      height: 100,
    },
    {
      locations: [
        {
          url: 'https://iiif.wellcomecollection.org/image/b28666112_0002.jp2/info.json',
          license: {
            id: 'inc',
            label: 'In copyright',
            url: 'http://rightsstatements.org/vocab/InC/1.0/',
            type: 'License',
          },
          accessConditions: [
            {
              method: {
                id: 'view-online',
                label: 'View online',
                type: 'AccessMethod',
              },
              status: { id: 'open', label: 'Open', type: 'AccessStatus' },
              type: 'AccessCondition',
            },
          ],
          locationType: {
            id: 'iiif-image',
            label: 'IIIF Image API',
            type: 'LocationType',
          },
          type: 'DigitalLocation',
        },
        {
          url: 'https://iiif.wellcomecollection.org/presentation/v2/b28666112',
          license: {
            id: 'inc',
            label: 'In copyright',
            url: 'http://rightsstatements.org/vocab/InC/1.0/',
            type: 'License',
          },
          accessConditions: [
            {
              method: {
                id: 'view-online',
                label: 'View online',
                type: 'AccessMethod',
              },
              status: { id: 'open', label: 'Open', type: 'AccessStatus' },
              type: 'AccessCondition',
            },
          ],
          locationType: {
            id: 'iiif-presentation',
            label: 'IIIF Presentation API',
            type: 'LocationType',
          },
          type: 'DigitalLocation',
        },
      ],
      source: {
        id: 'vmwda9zv',
        title: 'AIDS and HIV : HIV antibody : to test or not to test?.',
        type: 'Work',
      },
      aspectRatio: 1.3745705,
      thumbnail: {
        url: 'https://iiif.wellcomecollection.org/image/b28666112_0002.jp2/info.json',
        license: {
          id: 'inc',
          label: 'In copyright',
          url: 'http://rightsstatements.org/vocab/InC/1.0/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: { id: 'open', label: 'Open', type: 'AccessStatus' },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
      averageColor: '#c1bdb7',
      id: 'r4tvvn2f',
      type: 'Image',
      src: 'https://iiif.wellcomecollection.org/image/b28666112_0002.jp2/info.json',
      width: 137.45704999999998,
      height: 100,
    },
    {
      locations: [
        {
          url: 'https://iiif.wellcomecollection.org/image/A0000755/info.json',
          credit: 'Royal Veterinary College',
          license: {
            id: 'cc-by-nc',
            label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
            url: 'https://creativecommons.org/licenses/by-nc/4.0/',
            type: 'License',
          },
          accessConditions: [
            {
              method: {
                id: 'view-online',
                label: 'View online',
                type: 'AccessMethod',
              },
              status: { id: 'open', label: 'Open', type: 'AccessStatus' },
              type: 'AccessCondition',
            },
          ],
          locationType: {
            id: 'iiif-image',
            label: 'IIIF Image API',
            type: 'LocationType',
          },
          type: 'DigitalLocation',
        },
      ],
      source: {
        id: 'xje9d9m9',
        title: 'Examining horses: wedge test',
        type: 'Work',
      },
      aspectRatio: 1.5209125,
      id: 'b6sn765d',
      type: 'Image',
      src: 'https://iiif.wellcomecollection.org/image/A0000755/info.json',
      width: 152.09125,
      height: 100,
    },
    {
      locations: [
        {
          url: 'https://iiif.wellcomecollection.org/image/A0000754/info.json',
          credit: 'Royal Veterinary College',
          license: {
            id: 'cc-by-nc',
            label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
            url: 'https://creativecommons.org/licenses/by-nc/4.0/',
            type: 'License',
          },
          accessConditions: [
            {
              method: {
                id: 'view-online',
                label: 'View online',
                type: 'AccessMethod',
              },
              status: { id: 'open', label: 'Open', type: 'AccessStatus' },
              type: 'AccessCondition',
            },
          ],
          locationType: {
            id: 'iiif-image',
            label: 'IIIF Image API',
            type: 'LocationType',
          },
          type: 'DigitalLocation',
        },
      ],
      source: {
        id: 'fxdjhxzk',
        title: 'Examining horses: wedge test',
        type: 'Work',
      },
      aspectRatio: 1.5151515,
      averageColor: '#aa9c87',
      id: 'paw99kme',
      type: 'Image',
      src: 'https://iiif.wellcomecollection.org/image/A0000754/info.json',
      width: 151.51515,
      height: 100,
    },
    {
      locations: [
        {
          url: 'https://iiif.wellcomecollection.org/image/A0000295/info.json',
          credit: 'Royal Veterinary College',
          license: {
            id: 'cc-by-nc',
            label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
            url: 'https://creativecommons.org/licenses/by-nc/4.0/',
            type: 'License',
          },
          accessConditions: [
            {
              method: {
                id: 'view-online',
                label: 'View online',
                type: 'AccessMethod',
              },
              status: { id: 'open', label: 'Open', type: 'AccessStatus' },
              type: 'AccessCondition',
            },
          ],
          locationType: {
            id: 'iiif-image',
            label: 'IIIF Image API',
            type: 'LocationType',
          },
          type: 'DigitalLocation',
        },
      ],
      source: {
        id: 'zh5tztk2',
        title: 'Toxoplasmosis: antibody test (ewe)',
        type: 'Work',
      },
      aspectRatio: 1.5267175,
      averageColor: '#0a2107',
      id: 'n46cztsm',
      type: 'Image',
      src: 'https://iiif.wellcomecollection.org/image/A0000295/info.json',
      width: 152.67175,
      height: 100,
    },
    {
      locations: [
        {
          url: 'https://iiif.wellcomecollection.org/image/W0049928/info.json',
          credit: 'H Kuper',
          license: {
            id: 'cc-by-nc',
            label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
            url: 'https://creativecommons.org/licenses/by-nc/4.0/',
            type: 'License',
          },
          accessConditions: [
            {
              method: {
                id: 'view-online',
                label: 'View online',
                type: 'AccessMethod',
              },
              status: { id: 'open', label: 'Open', type: 'AccessStatus' },
              type: 'AccessCondition',
            },
          ],
          locationType: {
            id: 'iiif-image',
            label: 'IIIF Image API',
            type: 'LocationType',
          },
          type: 'DigitalLocation',
        },
      ],
      source: {
        id: 'hzyjwfpq',
        title: 'Trachoma: visual acuity test',
        type: 'Work',
      },
      aspectRatio: 0.69,
      averageColor: '#858081',
      id: 'r8mw6gem',
      type: 'Image',
      src: 'https://iiif.wellcomecollection.org/image/W0049928/info.json',
      width: 69,
      height: 100,
    },
    {
      locations: [
        {
          url: 'https://iiif.wellcomecollection.org/image/W0049935/info.json',
          credit: 'H Kuper',
          license: {
            id: 'cc-by-nc',
            label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
            url: 'https://creativecommons.org/licenses/by-nc/4.0/',
            type: 'License',
          },
          accessConditions: [
            {
              method: {
                id: 'view-online',
                label: 'View online',
                type: 'AccessMethod',
              },
              status: { id: 'open', label: 'Open', type: 'AccessStatus' },
              type: 'AccessCondition',
            },
          ],
          locationType: {
            id: 'iiif-image',
            label: 'IIIF Image API',
            type: 'LocationType',
          },
          type: 'DigitalLocation',
        },
      ],
      source: {
        id: 'mfmh5ezs',
        title: 'Trahcoma: visual acuity test',
        type: 'Work',
      },
      aspectRatio: 1.4545455,
      averageColor: '#787576',
      id: 'tcrsnf9g',
      type: 'Image',
      src: 'https://iiif.wellcomecollection.org/image/W0049935/info.json',
      width: 145.45455,
      height: 100,
    },
  ],
  requestUrl:
    'https://api.wellcomecollection.org/catalogue/v2/images?query=test&pageSize=7',
};

export const clientSideWorkTypesNoResults: WorkTypes = {
  workTypeBuckets: [],
  totalResults: 0,
  requestUrl:
    'https://api.wellcomecollection.org/catalogue/v2/works?query=bananana&aggregations=workType&include=production%2Ccontributors%2CpartOf&pageSize=1',
};

export const clientSideImagesNoResults: ImageResults = {
  results: [],
  totalResults: 0,
  requestUrl:
    'https://api.wellcomecollection.org/catalogue/v2/works?query=bananana&aggregations=workType&include=production%2Ccontributors%2CpartOf&pageSize=1',
};

export const addressablesResults: ContentResultsList<Addressable> = {
  type: 'ResultList' as const,
  results: [
    {
      type: 'Page',
      id: 'Wv69viAAAOpR9noI',
      uid: 'exhibition-highlights-from-teeth',
      title: 'Exhibition highlights from Teeth',
      tags: [],
    },
    {
      type: 'Page',
      id: 'Z1gbgxAAAB8AU7rD',
      uid: 'wellcome-collection-2025-programme-press-release',
      title: 'Wellcome Collection 2025 programme highlights',
      description:
        'In 2025, Wellcome Collection will present two major exhibitions around the themes of sign language and freshwater, as well a BSL themed film installation and a display based on our zines collection.',
      tags: ['press'],
    },
    {
      type: 'Page',
      id: 'YV66phIAACEASdL_',
      uid: 'wellcome-collection-2022-exhibition-highlights',
      title: 'Wellcome Collection 2022 Exhibition Highlights',
      description:
        "As part of the season 'On Happiness', Wellcome Collection are pleased to announce a new five-part podcast series, 'Hello Happiness', exploring the meaning of positive emotions.",
      tags: ['press'],
    },
    {
      type: 'Exhibition highlight tour',
      id: 'ZthrZRIAACQALvCC',
      uid: 'jason-and-the-adventure-of-254',
      description:
        'Showcasing Jason Wilsher-Mills’ largest and most personal commission to date, this exhibition is a joyful exploration of the body, drawing on the artist’s experience of becoming disabled as a child.',
      highlightTourType: 'audio',
      title: 'Jason and the Adventure of 254 audio highlight tour',
    },
    {
      type: 'Exhibition highlight tour',
      id: 'ZsdFlRIAACIAqKGB',
      uid: 'hard-graft',
      description:
        'Explore the profound impact of physical work on health and the enduring fight for workers’ rights through our new major exhibition.',
      highlightTourType: 'audio',
      title: 'Hard Graft: Work, Health and Rights audio highlight tour',
    },
    {
      type: 'Page',
      id: 'Zmq95BEAACMAGTxS',
      uid: 'hard-graft--work--health-and-rights',
      title: 'Hard Graft: Work, Health and Rights',
      description:
        'In September 2024, Wellcome Collection will present ‘Hard Graft’ a free major exhibition exploring experiences of physical work and its impacts on health and the body.',
      tags: ['press'],
    },
    {
      type: 'Page',
      id: 'Wuw2MSIAACtd3Stm',
      uid: 'rawminds-summer-2017-filmmaking-project',
      title: 'RawMinds Summer 2017 Filmmaking Project',
      description: 'See the highlights from this outdoor filmmaking project.',
      tags: ['what-we-do', 'from_drupal'],
    },
    {
      type: 'Event',
      id: 'Xhyc0xAAACUAWYsj',
      uid: 'bsl-tour-of-play-well',
      title: 'BSL Tour of Play Well',
      description:
        'Enjoy highlights from the ‘Play Well’ exhibition accompanied by British Sign Language (BSL) guide Nadia Nadarajah.',
      format: 'Gallery tour',
      times: {
        start: '2020-02-27T18:00:00.000Z',
        end: '2020-02-27T18:45:00.000Z',
      },
    },
    {
      type: 'Event',
      id: 'XUl7DBEAACIAzkwj',
      uid: 'bsl-tour-of-misbehaving-bodies',
      title: 'BSL Tour of Misbehaving Bodies',
      description:
        'Enjoy highlights from the ‘Misbehaving Bodies’ exhibition accompanied by British Sign Language (BSL) guide Golda Dahan.',
      format: 'Gallery tour',
      times: {
        start: '2019-10-17T17:00:00.000Z',
        end: '2019-10-17T17:45:00.000Z',
      },
    },
    {
      type: 'Event',
      id: 'WvWoACIAAAvIBvMH',
      uid: 'british-sign-language-tour-of-teeth',
      title: 'British Sign Language tour of Teeth',
      description:
        "In this access tour, you'll see highlights from the Teeth exhibition accompanied by a British Sign Language (BSL) guide.",
      format: 'Gallery tour',
      times: {
        start: '2018-07-19T17:00:00.000Z',
        end: '2018-07-19T17:45:00.000Z',
      },
    },
  ],
  pageSize: 10,
  totalPages: 12,
  totalResults: 120,
  nextPage:
    'https://api.wellcomecollection.org/content/v0/all?query=highlight&page=2',
  prevPage: null,
  _requestUrl: '',
};

export const addressablesNoResults = {
  type: 'ResultList' as const,
  results: [],
  totalResults: 0,
  pageSize: 10,
  totalPages: 0,
  nextPage: null,
  prevPage: null,
  _requestUrl: '',
};
