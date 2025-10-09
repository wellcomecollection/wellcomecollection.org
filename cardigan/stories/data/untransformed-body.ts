import * as prismic from '@prismicio/client';

import { PagesDocumentDataBodySlice } from '@weco/common/prismicio-types';

import { darkCloudImageUrl, florenceWinterfloodImageUrl } from './images';

const untransformedbody: prismic.SliceZone<PagesDocumentDataBodySlice> = [
  {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      text: [
        {
          type: 'paragraph',
          text: 'I was raised in East London by a Rastafarian mother who nurtured the importance of community in my life from a young age. When I was a child, she took me to Rastafarian gatherings, often held in community halls and centres. They were spaces of love and deep connection, full of wonderful memories. ',
          spans: [
            {
              start: 33,
              end: 44,
              type: 'hyperlink',
              data: {
                link_type: 'Web',
                url: 'https://www.bbc.co.uk/religion/religions/rastafari/customs/customs_1.shtml',
              },
            },
          ],
        },
        {
          type: 'paragraph',
          text: 'The need to connect and belong can be powerful and unspoken. A particular Genna (Ethiopian Christmas, celebrated on 7 January) event, when I was about ten, remains etched in my mind as a case in point. ',
          spans: [
            {
              start: 74,
              end: 79,
              type: 'hyperlink',
              data: {
                link_type: 'Web',
                url: 'https://www.elmitourethiopia.com/index.php/genna-ethiopian-christmas',
              },
            },
          ],
        },
      ],
    },
    id: 'text$d17bc68e-9b8f-4247-bcb5-914fb8a90279',
    slice_type: 'text',
    slice_label: null,
  },
  {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      text: [
        {
          type: 'heading2',
          text: 'The only Black woman in genetics',
          spans: [],
        },
      ],
    },
    id: 'text$1a312e97-47ec-4099-b222-b04ab3f56d87',
    slice_type: 'text',
    slice_label: null,
  },
  {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      image: {
        dimensions: {
          width: 4000,
          height: 3000,
        },
        alt: 'An illustration of two young black girls looking at each other while holding hands. Both are wearing head scarves and skirts with patterns of biological cells and structures. In the background are representations of DNA strands and chromosomes.',
        copyright:
          'Equality in Genetics | | | | | Tinuke Fagborun for Wellcome Collection |',
        url: florenceWinterfloodImageUrl('3200x3200'),
        id: 'ZcISLRAAAPpnKr1h',
        edit: {
          x: 0,
          y: 0,
          zoom: 1,
          background: '#fff',
        },
        '32:15': {
          dimensions: {
            width: 3200,
            height: 1500,
          },
          alt: 'An illustration of two young black girls looking at each other while holding hands. Both are wearing head scarves and skirts with patterns of biological cells and structures. In the background are representations of DNA strands and chromosomes.',
          copyright:
            'Equality in Genetics | | | | | Tinuke Fagborun for Wellcome Collection |',
          url: florenceWinterfloodImageUrl('3200x1500'),
          id: 'ZcISLRAAAPpnKr1h',
          edit: {
            x: 0,
            y: -450,
            zoom: 0.8,
            background: '#fff',
          },
        },
        '16:9': {
          dimensions: {
            width: 3200,
            height: 1800,
          },
          alt: 'An illustration of two young black girls looking at each other while holding hands. Both are wearing head scarves and skirts with patterns of biological cells and structures. In the background are representations of DNA strands and chromosomes.',
          copyright:
            'Equality in Genetics | | | | | Tinuke Fagborun for Wellcome Collection |',
          url: florenceWinterfloodImageUrl('3200x1800'),
          id: 'ZcISLRAAAPpnKr1h',
          edit: {
            x: 0,
            y: -300,
            zoom: 0.8,
            background: '#fff',
          },
        },
        square: {
          dimensions: {
            width: 3200,
            height: 3200,
          },
          alt: 'An illustration of two young black girls looking at each other while holding hands. Both are wearing head scarves and skirts with patterns of biological cells and structures. In the background are representations of DNA strands and chromosomes.',
          copyright:
            'Equality in Genetics | | | | | Tinuke Fagborun for Wellcome Collection |',
          url: florenceWinterfloodImageUrl('3200x3200'),
          id: 'ZcISLRAAAPpnKr1h',
          edit: {
            x: -533,
            y: 0,
            zoom: 1.0666666666666667,
            background: '#fff',
          },
        },
      },
      caption: [
        {
          type: 'paragraph',
          text: '“Without consulting each other, my sister and I removed the handkerchiefs from our shirts and wrapped them around our heads, to match the many around us who dressed this way.”',
          spans: [],
        },
      ],
      hasRoundedCorners: false,
    },
    id: 'editorialImage$faf454c2-fccb-44d0-808a-aaa2059870b6',
    slice_type: 'editorialImage',
    slice_label: null,
  },
  {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      text: [
        {
          type: 'paragraph',
          text: 'I have seen patients who couldn’t afford the journey to a genetic clinic, people who have been incorrectly told genetic testing was not for them based on ethnicity, and people who have received information about their healthcare in a language they could not understand.',
          spans: [],
        },
      ],
    },
    id: 'text$96b2369f-a6f5-4709-8098-70f69799b90e',
    slice_type: 'text',
    slice_label: null,
  },
  {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      text: [
        {
          type: 'heading2',
          text: 'The turning point',
          spans: [],
        },
      ],
    },
    id: 'text$02619a30-ad88-4dc1-bd62-475230f7c1a7',
    slice_type: 'text',
    slice_label: null,
  },
  {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      text: [
        {
          type: 'paragraph',
          text: 'I felt alone and frustrated that my responsibility to address issues that affected those like me was not even acknowledged. ',
          spans: [],
        },
      ],
    },
    id: 'text$775ea87b-d892-481e-a4d1-09c6566ec25c',
    slice_type: 'text',
    slice_label: null,
  },
  {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      text: [
        {
          type: 'paragraph',
          text: 'My feelings of isolation in the field intensified during the Covid-19 lockdowns and the murder of George Floyd – but these events also galvanised me into action. For the first time in many years I joined the thousands who took to the streets in protest. There was comfort in that moment of solidarity and connection, a glimmer of hope that the value of Black lives was at the forefront of discussions. ',
          spans: [
            {
              start: 84,
              end: 110,
              type: 'hyperlink',
              data: {
                link_type: 'Web',
                url: 'https://blacklivesmatter.uk/georgefloyd',
              },
            },
          ],
        },
      ],
    },
    id: 'text$825ccf87-d448-4625-8a28-245b2a642e50',
    slice_type: 'text',
    slice_label: null,
  },
  {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      text: [
        {
          type: 'paragraph',
          text: "“Everybody fighting to reach the top\n How far is it from the bottom\n I don't want no peace\n I want equal rights and justice” ",
          spans: [],
        },
      ],
      citation: [
        {
          type: 'paragraph',
          text: '‘Equal Rights’, Peter Tosh',
          spans: [],
        },
      ],
      isPullOrReview: false,
    },
    id: 'quote$4c032577-05d5-4dc9-9818-4fd2d7661669',
    slice_type: 'quote',
    slice_label: null,
  },
  {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      text: [
        {
          type: 'heading2',
          text: 'Support systems',
          spans: [],
        },
      ],
    },
    id: 'text$52891476-3428-4e12-bd9d-79d5b1a78d71',
    slice_type: 'text',
    slice_label: null,
  },
  {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      text: [
        {
          type: 'paragraph',
          text: 'Once I found myself in a community of others passionate about addressing the inequality in genetics, some of that frustration from those earlier days in genetics could be channelled into action. ',
          spans: [],
        },
      ],
    },
    id: 'text$adff5625-0280-44b6-bd43-90e28aa960d5',
    slice_type: 'text',
    slice_label: null,
  },
  {
    variation: 'default',
    version: 'initial',
    items: [],
    primary: {
      image: {
        dimensions: {
          width: 4000,
          height: 3000,
        },
        alt: 'An illustration of a therapy session in progress. A Therapist sit’s in a chair across from a couple having a discussion. In the room are large plants and in the background a strand of DNA is depicted. ',
        copyright:
          'Equality in Genetics | | | | | Tinuke Fagborun for Wellcome Collection |',
        url: darkCloudImageUrl('3200x3200'),
        id: 'ZcISNBAAACAAKr1u',
        edit: {
          x: 0,
          y: 0,
          zoom: 1,
          background: '#fff',
        },
        '32:15': {
          dimensions: {
            width: 3200,
            height: 1500,
          },
          alt: 'An illustration of a therapy session in progress. A Therapist sit’s in a chair across from a couple having a discussion. In the room are large plants and in the background a strand of DNA is depicted. ',
          copyright:
            'Equality in Genetics | | | | | Tinuke Fagborun for Wellcome Collection |',
          url: darkCloudImageUrl('3200x1500'),
          id: 'ZcISNBAAACAAKr1u',
          edit: {
            x: 0,
            y: -450,
            zoom: 0.8,
            background: '#fff',
          },
        },
        '16:9': {
          dimensions: {
            width: 3200,
            height: 1800,
          },
          alt: 'An illustration of a therapy session in progress. A Therapist sit’s in a chair across from a couple having a discussion. In the room are large plants and in the background a strand of DNA is depicted. ',
          copyright:
            'Equality in Genetics | | | | | Tinuke Fagborun for Wellcome Collection |',
          url: darkCloudImageUrl('3200x1800'),
          id: 'ZcISNBAAACAAKr1u',
          edit: {
            x: 0,
            y: -300,
            zoom: 0.8,
            background: '#fff',
          },
        },
        square: {
          dimensions: {
            width: 3200,
            height: 3200,
          },
          alt: 'An illustration of a therapy session in progress. A Therapist sit’s in a chair across from a couple having a discussion. In the room are large plants and in the background a strand of DNA is depicted. ',
          copyright:
            'Equality in Genetics | | | | | Tinuke Fagborun for Wellcome Collection |',
          url: darkCloudImageUrl('3200x3200'),
          id: 'ZcISNBAAACAAKr1u',
          edit: {
            x: -533,
            y: 0,
            zoom: 1.0666666666666667,
            background: '#fff',
          },
        },
      },
      caption: [
        {
          type: 'paragraph',
          text: '“I have seen patients who couldn’t afford the journey to a genetic clinic, people who have been incorrectly told genetic testing was not for them based on ethnicity, and people who have received information about their healthcare in a language they could not understand.”',
          spans: [],
        },
      ],
      hasRoundedCorners: false,
    },
    id: 'editorialImage$78a0c681-d014-4bec-9109-77e2b7998946',
    slice_type: 'editorialImage',
    slice_label: null,
  },
  // Needed for the hasLandingPageFormat version
  {
    variation: 'default',
    version: 'initial',
    items: [
      {
        content: {
          id: 'Wuw2MSIAACtd3Ssg',
          type: 'pages',
          tags: ['get-involved'],
          lang: 'en-gb',
          slug: 'young-people',
          uid: 'young-people',
          data: {
            promo: [
              {
                primary: {
                  caption: [
                    {
                      type: 'paragraph',
                      text: 'We have a range of free activities for you to try if you’re aged 14 to 19 years old. ',
                      spans: [],
                    },
                  ],
                  image: {
                    dimensions: { width: 4000, height: 2250 },
                    alt: 'Photograph of a young man and woman using an iPad in the Medicine Man gallery to film each other talking to camera.',
                    copyright:
                      'Saturday Studio video journalism | Benjamin Gilbert | Wellcome Collection | | CC-BY-NC | |',
                    url: 'https://images.prismic.io/wellcomecollection%2F8ea8bf8a-4a9f-4c04-9926-de4b978848dc_btg180517200023.jpg?auto=format,compress',
                    id: 'WypmzyYAAIxc07Hn',
                    edit: { x: 0, y: 0, zoom: 1, background: '#fff' },
                    '32:15': {
                      dimensions: { width: 3200, height: 1500 },
                      alt: 'Photograph of a young man and woman using an iPad in the Medicine Man gallery to film each other talking to camera.',
                      copyright:
                        'Saturday Studio video journalism | Benjamin Gilbert | Wellcome Collection | | CC-BY-NC | |',
                      url: 'https://images.prismic.io/wellcomecollection%2F8ea8bf8a-4a9f-4c04-9926-de4b978848dc_btg180517200023.jpg?auto=format,compress',
                      id: 'WypmzyYAAIxc07Hn',
                      edit: { x: 0, y: -150, zoom: 0.8, background: '#fff' },
                    },
                    '16:9': {
                      dimensions: { width: 3200, height: 1800 },
                      alt: 'Photograph of a young man and woman using an iPad in the Medicine Man gallery to film each other talking to camera.',
                      copyright:
                        'Saturday Studio video journalism | Benjamin Gilbert | Wellcome Collection | | CC-BY-NC | |',
                      url: 'https://images.prismic.io/wellcomecollection%2F8ea8bf8a-4a9f-4c04-9926-de4b978848dc_btg180517200023.jpg?auto=format,compress',
                      id: 'WypmzyYAAIxc07Hn',
                      edit: { x: 0, y: 0, zoom: 0.8, background: '#fff' },
                    },
                    square: {
                      dimensions: { width: 3200, height: 3200 },
                      alt: 'Photograph of a young man and woman using an iPad in the Medicine Man gallery to film each other talking to camera.',
                      copyright:
                        'Saturday Studio video journalism | Benjamin Gilbert | Wellcome Collection | | CC-BY-NC | |',
                      url: 'https://images.prismic.io/wellcomecollection%2F8ea8bf8a-4a9f-4c04-9926-de4b978848dc_btg180517200023.jpg?auto=format,compress',
                      id: 'WypmzyYAAIxc07Hn',
                      edit: {
                        x: -1244,
                        y: 0,
                        zoom: 1.4222222222222223,
                        background: '#fff',
                      },
                    },
                  },
                },
                items: [],
                id: 'editorialImage$45d64a1d-b928-4274-afd1-9f92804dc227',
                slice_type: 'editorialImage',
              },
            ],
            title: [{ type: 'heading1', text: 'Young people', spans: [] }],
          },
          link_type: 'Document',
          isBroken: false,
        },
      },
      {
        content: {
          id: 'Wuw2MSIAACtd3StS',
          type: 'pages',
          tags: ['from_drupal', 'get-involved'],
          lang: 'en-gb',
          slug: 'schools',
          uid: 'schools',
          data: {
            promo: [
              {
                primary: {
                  caption: [
                    {
                      type: 'paragraph',
                      text: 'We’ve got a range of things on offer to support teachers, from free study days at Wellcome Collection to downloadable resources for your 14 to 19-year-old students.',
                      spans: [],
                    },
                  ],
                  image: {
                    dimensions: { width: 4000, height: 2250 },
                    alt: 'Photograph of young students examining a skeleton as part of a Wellcome Collection school study day.',
                    copyright:
                      'School study day at Wellcome Collection  | Benjamin Gilbert | Wellcome Collection | | CC-BY-NC | |',
                    url: 'https://images.prismic.io/wellcomecollection%2F104acf6e-b667-4989-88e5-cf00985863af_c0093071.jpg?auto=format,compress',
                    id: 'W1s5-CYAACUAvgbP',
                    edit: { x: 0, y: 0, zoom: 1, background: '#fff' },
                    '32:15': {
                      dimensions: { width: 3200, height: 1500 },
                      alt: 'Photograph of young students examining a skeleton as part of a Wellcome Collection school study day.',
                      copyright:
                        'School study day at Wellcome Collection  | Benjamin Gilbert | Wellcome Collection | | CC-BY-NC | |',
                      url: 'https://images.prismic.io/wellcomecollection%2F104acf6e-b667-4989-88e5-cf00985863af_c0093071.jpg?auto=format,compress',
                      id: 'W1s5-CYAACUAvgbP',
                      edit: { x: 0, y: -150, zoom: 0.8, background: '#fff' },
                    },
                    '16:9': {
                      dimensions: { width: 3200, height: 1800 },
                      alt: 'Photograph of young students examining a skeleton as part of a Wellcome Collection school study day.',
                      copyright:
                        'School study day at Wellcome Collection  | Benjamin Gilbert | Wellcome Collection | | CC-BY-NC | |',
                      url: 'https://images.prismic.io/wellcomecollection%2F104acf6e-b667-4989-88e5-cf00985863af_c0093071.jpg?auto=format,compress',
                      id: 'W1s5-CYAACUAvgbP',
                      edit: { x: 0, y: 0, zoom: 0.8, background: '#fff' },
                    },
                    square: {
                      dimensions: { width: 3200, height: 3200 },
                      alt: 'Photograph of young students examining a skeleton as part of a Wellcome Collection school study day.',
                      copyright:
                        'School study day at Wellcome Collection  | Benjamin Gilbert | Wellcome Collection | | CC-BY-NC | |',
                      url: 'https://images.prismic.io/wellcomecollection%2F104acf6e-b667-4989-88e5-cf00985863af_c0093071.jpg?auto=format,compress',
                      id: 'W1s5-CYAACUAvgbP',
                      edit: {
                        x: -1244,
                        y: 0,
                        zoom: 1.4222222222222223,
                        background: '#fff',
                      },
                    },
                  },
                },
                items: [],
                id: 'editorialImage$e3d81d54-e008-4dfd-b609-159ac8b1900f',
                slice_type: 'editorialImage',
              },
            ],
            title: [{ type: 'heading1', text: 'Schools', spans: [] }],
          },
          link_type: 'Document',
          isBroken: false,
        },
      },
    ],
    primary: {
      title: [],
    },
    id: 'contentList$c56d982f-d747-4b03-89ee-2b684445fe2c',
    slice_type: 'contentList',
    slice_label: null,
  },
];

export default untransformedbody;
