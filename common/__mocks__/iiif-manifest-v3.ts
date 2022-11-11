export const authService = {
  '@id': 'https://iiif.wellcomecollection.org/auth/clickthrough',
  '@type': 'AuthCookieService1',
  profile: 'http://iiif.io/api/auth/1/clickthrough',
  label: 'Content advisory',
  description:
    '<p>This digitised material is free to access, but contains information or visuals that may:</p><ul><li>include personal details of living individuals</li><li>be upsetting or distressing</li><li>be explicit or graphic</li><li>include objects and images of objects decontextualised in a way that is offensive to the originating culture.</li></ul>By viewing this material, we ask that you use the content lawfully, ethically and responsibly under the conditions set out in our <a href="https://wellcomecollection.cdn.prismic.io/wellcomecollection/d4817da5-c71a-4151-81c4-83e39ad4f5b3_Wellcome+Collection_Access+Policy_Aug+2020.pdf">Access Policy</a>.',
  service: [
    {
      '@id': 'https://iiif.wellcomecollection.org/auth/token',
      '@type': 'AuthTokenService1',
      profile: 'http://iiif.io/api/auth/1/token',
    },
    {
      '@id': 'https://iiif.wellcomecollection.org/auth/clickthrough/logout',
      '@type': 'AuthLogoutService1',
      profile: 'http://iiif.io/api/auth/1/logout',
      label: 'Log out of Wellcome Collection',
    },
  ],
  confirmLabel: 'Accept Terms and Open',
  header: 'Content advisory',
  failureHeader: 'Terms not accepted',
  failureDescription: 'You must accept the terms to view the content.',
};

export const services = [
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b29214397#tracking',
    type: 'Text',
    profile: 'http://universalviewer.io/tracking-extensions-profile',
    label: {
      en: [
        'Format: Video, Institution: n/a, Identifier: b29214397, Digicode: digfilm, Collection code: n/a',
      ],
    },
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b29214397#timestamp',
    type: 'Text',
    profile:
      'https://github.com/wellcomecollection/iiif-builder/build-timestamp',
    label: {
      none: ['2022-06-21T11:18:19.6201561Z'],
    },
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b29214397#accesscontrolhints',
    type: 'Text',
    profile: 'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
    label: {
      en: ['clickthrough'],
    },
  },
  { ...authService },
];

export const manifestWithTranscript = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://iiif.wellcomecollection.org/presentation/b2248887x',
  type: 'Manifest',
  label: {
    en: ['Mat Fraser: interview 1'],
  },
  summary: {
    en: [
      'Ruth Blue interviewing Mat Fraser on the 12th of November at his home in London for Thalidomide: An Oral History.',
    ],
  },
  homepage: [
    {
      id: 'https://wellcomecollection.org/works/b4tj49m4',
      type: 'Text',
      label: {
        en: ['Mat Fraser: interview 1'],
      },
      format: 'text/html',
      language: ['en'],
    },
  ],
  metadata: [
    {
      label: {
        en: ['Description'],
      },
      value: {
        en: [
          'Ruth Blue interviewing Mat Fraser on the 12th of November at his home in London for Thalidomide: An Oral History.',
        ],
      },
    },
    {
      label: {
        en: ['Reference'],
      },
      value: {
        none: ['OH1/E/1'],
      },
    },
    {
      label: {
        en: ['Publication/creation'],
      },
      value: {
        none: ['12 November 2012'],
      },
    },
    {
      label: {
        en: ['Physical description'],
      },
      value: {
        en: ['6 encoded audio files 2.4 MB (2542803 bytes) 6 WAV files'],
      },
    },
    {
      label: {
        en: ['Copyright note'],
      },
      value: {
        en: [
          'This recording has been licensed by the Wellcome Trust for public use under Creative Commons Attribution-non commercial-Share Alike 3.00 UK. This means that anyone based in the UK can share and remix the material, as long as it is for non-commercial purposes. Credits, where given, should be to Wellcome Library, London. (c) Wellcome Trust.',
        ],
      },
    },
    {
      label: {
        en: ['Attribution and usage'],
      },
      value: {
        en: [
          'Wellcome Collection',
          '<span>You have permission to make copies of this work under a <a target="_top" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons, Attribution, Non-commercial license</a>.<br/><br/>Non-commercial use includes private study, academic research, teaching, and other activities that are not primarily intended for, or directed towards, commercial advantage or private monetary compensation. See the <a target="_top" href="http://creativecommons.org/licenses/by-nc/4.0/legalcode">Legal Code</a> for further information.<br/><br/>Image source should be attributed as specified in the full catalogue record. If no source is given the image should be attributed to Wellcome Collection.</span>',
        ],
      },
    },
  ],
  rights: 'http://creativecommons.org/licenses/by-nc/4.0/',
  provider: [
    {
      id: 'https://wellcomecollection.org',
      type: 'Agent',
      label: {
        en: [
          'Wellcome Collection',
          '183 Euston Road',
          'London NW1 2BE UK',
          'T +44 (0)20 7611 8722',
          'E library@wellcomecollection.org',
          'https://wellcomecollection.org',
        ],
      },
      homepage: [
        {
          id: 'https://wellcomecollection.org/works',
          type: 'Text',
          label: {
            en: ['Explore our collections'],
          },
          format: 'text/html',
        },
      ],
      logo: [
        {
          id: 'https://iiif.wellcomecollection.org/logos/wellcome-collection-black.png',
          type: 'Image',
          format: 'image/png',
        },
      ],
    },
  ],
  rendering: [
    {
      id: 'https://iiif.wellcomecollection.org/file/b2248887x_0001.pdf',
      type: 'Text',
      label: {
        en: ['PDF Transcript'],
      },
      format: 'application/pdf',
    },
  ],
  seeAlso: [
    {
      id: 'https://api.wellcomecollection.org/catalogue/v2/works/b4tj49m4',
      type: 'Dataset',
      profile: 'https://api.wellcomecollection.org/catalogue/v2/context.json',
      label: {
        en: ['Wellcome Collection Catalogue API'],
      },
      format: 'application/json',
    },
  ],
  services: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2248887x#tracking',
      type: 'Text',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      label: {
        en: [
          'Format: Audio, Institution: n/a, Identifier: b2248887x, Digicode: n/a, Collection code: OH1/E/1',
        ],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2248887x#timestamp',
      type: 'Text',
      profile:
        'https://github.com/wellcomecollection/iiif-builder/build-timestamp',
      label: {
        none: ['2021-10-07T12:05:16.5432526Z'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2248887x#accesscontrolhints',
      type: 'Text',
      profile: 'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
      label: {
        en: ['open'],
      },
    },
  ],
  placeholderCanvas: {
    id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/poster-b2248887x_0006.wav',
    type: 'Canvas',
    label: {
      en: ['Poster Image Canvas'],
    },
    width: 600,
    height: 400,
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/poster-b2248887x_0006.wav/painting',
        type: 'AnnotationPage',
        items: [
          {
            id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/poster-b2248887x_0006.wav/painting/anno',
            type: 'Annotation',
            motivation: 'painting',
            body: {
              id: 'https://iiif.wellcomecollection.org/thumb/b2248887x',
              type: 'Image',
              label: {
                en: ['Poster Image'],
              },
              format: 'image/jpeg',
            },
            target:
              'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/poster-b2248887x_0006.wav/painting',
          },
        ],
      },
    ],
  },
  items: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0001.wav',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      duration: 1800.006836,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0001.wav/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0001.wav/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                duration: 1800.006836,
                id: 'https://iiif.wellcomecollection.org/av/b2248887x_0001.wav/full/max/default.mp3',
                type: 'Sound',
                label: {
                  en: ['MP3'],
                },
                format: 'audio/mp3',
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0001.wav',
            },
          ],
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0002.wav',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      duration: 1800.006836,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0002.wav/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0002.wav/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                duration: 1800.006836,
                id: 'https://iiif.wellcomecollection.org/av/b2248887x_0002.wav/full/max/default.mp3',
                type: 'Sound',
                label: {
                  en: ['MP3'],
                },
                format: 'audio/mp3',
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0002.wav',
            },
          ],
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0003.wav',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      duration: 1044.223389,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0003.wav/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0003.wav/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                duration: 1044.223389,
                id: 'https://iiif.wellcomecollection.org/av/b2248887x_0003.wav/full/max/default.mp3',
                type: 'Sound',
                label: {
                  en: ['MP3'],
                },
                format: 'audio/mp3',
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0003.wav',
            },
          ],
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0004.wav',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      duration: 1800.006836,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0004.wav/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0004.wav/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                duration: 1800.006836,
                id: 'https://iiif.wellcomecollection.org/av/b2248887x_0004.wav/full/max/default.mp3',
                type: 'Sound',
                label: {
                  en: ['MP3'],
                },
                format: 'audio/mp3',
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0004.wav',
            },
          ],
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0005.wav',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      duration: 1800.006836,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0005.wav/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0005.wav/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                duration: 1800.006836,
                id: 'https://iiif.wellcomecollection.org/av/b2248887x_0005.wav/full/max/default.mp3',
                type: 'Sound',
                label: {
                  en: ['MP3'],
                },
                format: 'audio/mp3',
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0005.wav',
            },
          ],
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0006.wav',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      duration: 797.890076,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0006.wav/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0006.wav/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                duration: 797.890076,
                id: 'https://iiif.wellcomecollection.org/av/b2248887x_0006.wav/full/max/default.mp3',
                type: 'Sound',
                label: {
                  en: ['MP3'],
                },
                format: 'audio/mp3',
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b2248887x/canvases/b2248887x_0006.wav',
            },
          ],
        },
      ],
    },
  ],
  partOf: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/archives/OH1/E',
      type: 'Collection',
      label: {
        en: ['Mat Fraser'],
      },
      partOf: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/collections/archives/OH1',
          type: 'Collection',
          label: {
            en: ['Thalidomide: An Oral History'],
          },
        },
      ],
    },
  ],
};

export const manifestWithAudioTitles = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://iiif.wellcomecollection.org/presentation/b3250200x',
  type: 'Manifest',
  label: {
    en: ['Audio recording'],
  },
  summary: {
    en: [
      'Digitised audio recording of SA/PHY/T/1/9/1 (4 MP3 files). See SA/PHY/T/1/9/2 & 3 for transcript and other materials.',
    ],
  },
  homepage: [
    {
      id: 'https://wellcomecollection.org/works/ja8kpws9',
      type: 'Text',
      label: {
        en: ['Audio recording'],
      },
      format: 'text/html',
      language: ['en'],
    },
  ],
  metadata: [
    {
      label: {
        en: ['Description'],
      },
      value: {
        en: [
          'Digitised audio recording of SA/PHY/T/1/9/1 (4 MP3 files). See SA/PHY/T/1/9/2 & 3 for transcript and other materials.',
        ],
      },
    },
    {
      label: {
        en: ['Reference'],
      },
      value: {
        none: ['SA/PHY/T/1/9/1a'],
      },
    },
    {
      label: {
        en: ['Publication/creation'],
      },
      value: {
        none: ['28 August 1997'],
      },
    },
    {
      label: {
        en: ['Physical description'],
      },
      value: {
        en: ['4 encoded audio files'],
      },
    },
    {
      label: {
        en: ['Attribution and usage'],
      },
      value: {
        en: [
          'Wellcome Collection',
          '<span>Conditions of use: it is possible this item is protected by copyright and/or related rights. You are free to use this item in any way that is permitted by the copyright and related rights legislation that applies to your use. For other uses you need to obtain permission from the rights-holder(s).</span>',
        ],
      },
    },
  ],
  provider: [
    {
      id: 'https://wellcomecollection.org',
      type: 'Agent',
      label: {
        en: [
          'Wellcome Collection',
          '183 Euston Road',
          'London NW1 2BE UK',
          'T +44 (0)20 7611 8722',
          'E library@wellcomecollection.org',
          'https://wellcomecollection.org',
        ],
      },
      homepage: [
        {
          id: 'https://wellcomecollection.org/works',
          type: 'Text',
          label: {
            en: ['Explore our collections'],
          },
          format: 'text/html',
        },
      ],
      logo: [
        {
          id: 'https://iiif.wellcomecollection.org/logos/wellcome-collection-black.png',
          type: 'Image',
          format: 'image/png',
        },
      ],
    },
  ],
  seeAlso: [
    {
      id: 'https://api.wellcomecollection.org/catalogue/v2/works/ja8kpws9',
      type: 'Dataset',
      profile: 'https://api.wellcomecollection.org/catalogue/v2/context.json',
      label: {
        en: ['Wellcome Collection Catalogue API'],
      },
      format: 'application/json',
    },
  ],
  services: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b3250200x#tracking',
      type: 'Text',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      label: {
        en: [
          'Format: Audio, Institution: n/a, Identifier: b3250200x, Digicode: n/a, Collection code: SA/PHY/T/1/9/1a',
        ],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b3250200x#timestamp',
      type: 'Text',
      profile:
        'https://github.com/wellcomecollection/iiif-builder/build-timestamp',
      label: {
        none: ['2022-02-23T11:17:33.4917260Z'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b3250200x#accesscontrolhints',
      type: 'Text',
      profile: 'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
      label: {
        en: ['open'],
      },
    },
  ],
  placeholderCanvas: {
    id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/poster-b3250200x_0004.wav',
    type: 'Canvas',
    label: {
      en: ['Poster Image Canvas'],
    },
    width: 600,
    height: 400,
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/poster-b3250200x_0004.wav/painting',
        type: 'AnnotationPage',
        items: [
          {
            id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/poster-b3250200x_0004.wav/painting/anno',
            type: 'Annotation',
            motivation: 'painting',
            body: {
              id: 'https://iiif.wellcomecollection.org/thumb/b3250200x',
              type: 'Image',
              label: {
                en: ['Poster Image'],
              },
              format: 'image/jpeg',
            },
            target:
              'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/poster-b3250200x_0004.wav/painting',
          },
        ],
      },
    ],
  },
  items: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0001.wav',
      type: 'Canvas',
      label: {
        en: ['Tape 1, Side 1'],
      },
      duration: 2936.543213,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0001.wav/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0001.wav/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                duration: 2936.543213,
                id: 'https://iiif.wellcomecollection.org/av/b3250200x_0001.wav/full/max/default.mp3',
                type: 'Sound',
                label: {
                  en: ['MP3'],
                },
                format: 'audio/mp3',
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0001.wav',
            },
          ],
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0002.wav',
      type: 'Canvas',
      label: {
        en: ['Tape 1, Side 2'],
      },
      duration: 2922.277832,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0002.wav/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0002.wav/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                duration: 2922.277832,
                id: 'https://iiif.wellcomecollection.org/av/b3250200x_0002.wav/full/max/default.mp3',
                type: 'Sound',
                label: {
                  en: ['MP3'],
                },
                format: 'audio/mp3',
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0002.wav',
            },
          ],
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0003.wav',
      type: 'Canvas',
      label: {
        en: ['Tape 2, Side 1'],
      },
      duration: 2914.011475,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0003.wav/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0003.wav/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                duration: 2914.011475,
                id: 'https://iiif.wellcomecollection.org/av/b3250200x_0003.wav/full/max/default.mp3',
                type: 'Sound',
                label: {
                  en: ['MP3'],
                },
                format: 'audio/mp3',
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0003.wav',
            },
          ],
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0004.wav',
      type: 'Canvas',
      label: {
        en: ['Tape 2, Side 2'],
      },
      duration: 1234.256836,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0004.wav/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0004.wav/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                duration: 1234.256836,
                id: 'https://iiif.wellcomecollection.org/av/b3250200x_0004.wav/full/max/default.mp3',
                type: 'Sound',
                label: {
                  en: ['MP3'],
                },
                format: 'audio/mp3',
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0004.wav',
            },
          ],
        },
      ],
    },
  ],
  structures: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/ranges/LOG_0001',
      type: 'Range',
      label: {
        none: ['Tape 1'],
      },
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0001.wav',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/ranges/LOG_0002',
      type: 'Range',
      label: {
        none: ['Tape 1'],
      },
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0002.wav',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/ranges/LOG_0003',
      type: 'Range',
      label: {
        none: ['Tape 2'],
      },
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0003.wav',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/ranges/LOG_0004',
      type: 'Range',
      label: {
        none: ['Tape 2'],
      },
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b3250200x/canvases/b3250200x_0004.wav',
          type: 'Canvas',
        },
      ],
    },
  ],
  partOf: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/archives/SA/PHY/T/1/9',
      type: 'Collection',
      label: {
        en: ['John Gray'],
      },
      partOf: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/collections/archives/SA/PHY/T/1',
          type: 'Collection',
          label: {
            en: ['Oral history project'],
          },
          partOf: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/collections/archives/SA/PHY/T',
              type: 'Collection',
              label: {
                en: ["The Physiological Society's Audio Visual Collection"],
              },
              partOf: [
                {
                  id: 'https://iiif.wellcomecollection.org/presentation/collections/archives/SA/PHY',
                  type: 'Collection',
                  label: {
                    en: ['The Physiological Society'],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const manifestWithVideo = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://iiif.wellcomecollection.org/presentation/b29214397',
  type: 'Manifest',
  label: {
    en: ['Mechanism of the brain.'],
  },
  summary: {
    en: [
      '<p>This is a black and white, silent film, that explores the role the brain and nervous system play in behaviour.  In doing so it also attempts to show the difference between conditioned and unconditioned responses in animals and humans.  It begins by briefly examining behaviour in humans and animals, exploring how as humans develop their behaviour becomes more complex thus separating them from animals. Using annotated diagrams the film explains how behaviour is the result of the activity of the nervous system in which nervous tissue receives and transmits irritation.  Footage of frogs being tested with irritants is used to demonstrate this.  Absolute reflexes are then examined and attention is paid on absolute food reflex in dogs with footage of experiments observing mastication and secretion of saliva. This is then compared with conditioned reflexes. Diagrams are used to show how if two brain centres are stimulated simultaneously then a connection between the two is built and "an irritation of one centre causes that of the other".  We are shown how the unconditioned production of saliva at the sight or smell of food can be conditioned to appear at the sound of a metronome. This is used to illustrate "the basis of the nervous activities of animals is the inborn relation of the animal to its environment". This idea is developed and the film shows how reflex actions can be produced when a stimulus (irritant) is removed. Relationship of animals and men to their environment is explored through more elaborate tests with footage of a monkey reacting to variations of the same stimuli, including different coloured discs and a metronome set at different tempos. This illustrates "a more finely adjusted accommodation to living conditions".  The brains governance on behaviour and the role of different areas of the brain are then demonstrated through the behaviour of dogs and monkeys who have had parts of their brains removed.  We see tests on children by Prof. Krasnogorski, indicating that "absolute reflexes, as well as conditioned reflexes, form the basis of the behaviour not only of animals but of men". Material of humans with underdeveloped or damaged brains is shown to illustrate the affect the brain has on human behaviour. The film concludes with the assertion that "absolute and conditioned reflexes form the basis of the behaviour of men and animals" and examples of behaviour in different stages of human development are used to show the development of human behaviour.</p>',
    ],
  },
  homepage: [
    {
      id: 'https://wellcomecollection.org/works/d2mach47',
      type: 'Text',
      label: {
        en: ['Mechanism of the brain.'],
      },
      format: 'text/html',
      language: ['en'],
    },
  ],
  metadata: [
    {
      label: {
        en: ['Description'],
      },
      value: {
        en: [
          '<p>This is a black and white, silent film, that explores the role the brain and nervous system play in behaviour.  In doing so it also attempts to show the difference between conditioned and unconditioned responses in animals and humans.  It begins by briefly examining behaviour in humans and animals, exploring how as humans develop their behaviour becomes more complex thus separating them from animals. Using annotated diagrams the film explains how behaviour is the result of the activity of the nervous system in which nervous tissue receives and transmits irritation.  Footage of frogs being tested with irritants is used to demonstrate this.  Absolute reflexes are then examined and attention is paid on absolute food reflex in dogs with footage of experiments observing mastication and secretion of saliva. This is then compared with conditioned reflexes. Diagrams are used to show how if two brain centres are stimulated simultaneously then a connection between the two is built and "an irritation of one centre causes that of the other".  We are shown how the unconditioned production of saliva at the sight or smell of food can be conditioned to appear at the sound of a metronome. This is used to illustrate "the basis of the nervous activities of animals is the inborn relation of the animal to its environment". This idea is developed and the film shows how reflex actions can be produced when a stimulus (irritant) is removed. Relationship of animals and men to their environment is explored through more elaborate tests with footage of a monkey reacting to variations of the same stimuli, including different coloured discs and a metronome set at different tempos. This illustrates "a more finely adjusted accommodation to living conditions".  The brains governance on behaviour and the role of different areas of the brain are then demonstrated through the behaviour of dogs and monkeys who have had parts of their brains removed.  We see tests on children by Prof. Krasnogorski, indicating that "absolute reflexes, as well as conditioned reflexes, form the basis of the behaviour not only of animals but of men". Material of humans with underdeveloped or damaged brains is shown to illustrate the affect the brain has on human behaviour. The film concludes with the assertion that "absolute and conditioned reflexes form the basis of the behaviour of men and animals" and examples of behaviour in different stages of human development are used to show the development of human behaviour.</p>',
        ],
      },
    },
    {
      label: {
        en: ['Publication/creation'],
      },
      value: {
        none: ['c.1925.'],
      },
    },
    {
      label: {
        en: ['Physical description'],
      },
      value: {
        en: [
          '1 encoded moving image (01:33:43 mins.) : sound, black and white',
        ],
      },
    },
    {
      label: {
        en: ['Contributors'],
      },
      value: {
        none: [
          'Fursikov, D. S.',
          'Danilov, I. M.',
          'Krasnogorskiĭ, Nikolaĭ Ivanovich, 1883-',
          'Durnovo, A. S.',
          'Tcherkess, D.',
          'Merkulov, V. L. (Vasiliĭ Lavrentʹevich)',
          'Golovnia, A. D.',
          'Mejrabpom-Russ',
          'Pudovkin, Vsevolod Illarionovich, 1893-1953. Akter v filʹme.',
          'Vano, I.',
        ],
      },
    },
    {
      label: {
        en: ['Copyright note'],
      },
      value: {
        en: ['Not known'],
      },
    },
    {
      label: {
        en: ['Notes'],
      },
      value: {
        en: [
          'This was originally a Russian film but the Russian intertitles have been replaced with English ones, although the captions in the medical animations are still in Russian.',
        ],
      },
    },
    {
      label: {
        en: ['Creator/production credits'],
      },
      value: {
        en: [
          'Physiological experiments and operations, Professor D. S. Fursikov.  Animal Life Direction, I.M Danilov.  Conditioned reflex experiments on children, Professor N. I. Krasnogorski.  Child life direction, Professor A. S. Durnovo.  Diagrams, I. Vano, D. Tcherkess, V. Merkulov.  Photography A. D. Golovnia.  Production, Mejrabpom-Russ. (Directed by Vsevolod Pudovkin who is uncredited on this version.)',
        ],
      },
    },
    {
      label: {
        en: ['Subjects'],
      },
      value: {
        en: [
          'Behavior',
          'Nervous System',
          'Conditioning (Psychology)',
          'Instinct',
          'Salivary Glands',
          'Brain',
          'Neurology',
          'Psychology',
          'Animal Experimentation',
          'Krasnogorskiĭ, Nikolaĭ Ivanovich, 1883-',
        ],
      },
    },
    {
      label: {
        en: ['Attribution and usage'],
      },
      value: {
        en: [
          'Wellcome Collection',
          '<span>You have permission to make copies of this work under a <a target="_top" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons, Attribution, Non-commercial, No-derivatives license</a>. <br/><br/> Non-commercial use includes private study, academic research, teaching, and other activities that are not primarily intended for, or directed towards, commercial advantage or private monetary compensation. See the <a target="_top" href="http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode">Legal Code</a> for further information.<br/><br/>Image source should be attributed as specified in the full catalogue record. If no source is given the image should be attributed to Wellcome Collection.<br/><br/> Altering, adapting, modifying or translating the work is prohibited.</span>',
        ],
      },
    },
  ],
  rights: 'http://creativecommons.org/licenses/by-nc-nd/4.0/',
  provider: [
    {
      id: 'https://wellcomecollection.org',
      type: 'Agent',
      label: {
        en: [
          'Wellcome Collection',
          '183 Euston Road',
          'London NW1 2BE UK',
          'T +44 (0)20 7611 8722',
          'E library@wellcomecollection.org',
          'https://wellcomecollection.org',
        ],
      },
      homepage: [
        {
          id: 'https://wellcomecollection.org/works',
          type: 'Text',
          label: {
            en: ['Explore our collections'],
          },
          format: 'text/html',
        },
      ],
      logo: [
        {
          id: 'https://iiif.wellcomecollection.org/logos/wellcome-collection-black.png',
          type: 'Image',
          format: 'image/png',
        },
      ],
    },
  ],
  seeAlso: [
    {
      id: 'https://api.wellcomecollection.org/catalogue/v2/works/d2mach47',
      type: 'Dataset',
      profile: 'https://api.wellcomecollection.org/catalogue/v2/context.json',
      label: {
        en: ['Wellcome Collection Catalogue API'],
      },
      format: 'application/json',
    },
  ],
  services,
  placeholderCanvas: {
    id: 'https://iiif.wellcomecollection.org/presentation/b29214397/canvases/poster-b29214397_0001.mpg',
    type: 'Canvas',
    label: {
      en: ['Poster Image Canvas'],
    },
    width: 600,
    height: 400,
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b29214397/canvases/poster-b29214397_0001.mpg/painting',
        type: 'AnnotationPage',
        items: [
          {
            id: 'https://iiif.wellcomecollection.org/presentation/b29214397/canvases/poster-b29214397_0001.mpg/painting/anno',
            type: 'Annotation',
            motivation: 'painting',
            body: {
              id: 'https://iiif.wellcomecollection.org/thumb/b29214397',
              type: 'Image',
              label: {
                en: ['Poster Image'],
              },
              format: 'image/jpeg',
            },
            target:
              'https://iiif.wellcomecollection.org/presentation/b29214397/canvases/poster-b29214397_0001.mpg/painting',
          },
        ],
      },
    ],
  },
  items: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b29214397/canvases/b29214397_0001.mpg',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 720,
      height: 576,
      duration: 5623.704,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b29214397/canvases/b29214397_0001.mpg/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b29214397/canvases/b29214397_0001.mpg/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                type: 'Choice',
                items: [
                  {
                    width: 720,
                    height: 576,
                    duration: 5623.704,
                    id: 'https://iiif.wellcomecollection.org/av/b29214397_0001.mpg/full/full/max/max/0/default.mp4',
                    type: 'Video',
                    label: {
                      en: ['MP4'],
                    },
                    format: 'video/mp4',
                    service: [
                      {
                        '@id':
                          'https://iiif.wellcomecollection.org/auth/clickthrough',
                        '@type': 'AuthCookieService1',
                      },
                    ],
                  },
                  {
                    width: 720,
                    height: 576,
                    duration: 5623.704,
                    id: 'https://iiif.wellcomecollection.org/av/b29214397_0001.mpg/full/full/max/max/0/default.webm',
                    type: 'Video',
                    label: {
                      en: ['WebM'],
                    },
                    format: 'video/webm',
                    service: [
                      {
                        '@id':
                          'https://iiif.wellcomecollection.org/auth/clickthrough',
                        '@type': 'AuthCookieService1',
                      },
                    ],
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b29214397/canvases/b29214397_0001.mpg',
            },
          ],
        },
      ],
    },
  ],
  partOf: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/f3ducu6h',
      type: 'Collection',
      label: {
        en: ['Subject: Animal Experimentation'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/m7ea26np',
      type: 'Collection',
      label: {
        en: ['Subject: Behavior'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/rk4zgpfw',
      type: 'Collection',
      label: {
        en: ['Subject: Nervous System'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/rj46sc3f',
      type: 'Collection',
      label: {
        en: ['Subject: Conditioning (Psychology)'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/epmgv5fj',
      type: 'Collection',
      label: {
        en: ['Subject: Instinct'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/ktgj38yw',
      type: 'Collection',
      label: {
        en: ['Subject: Salivary Glands'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/jbk6wdga',
      type: 'Collection',
      label: {
        en: ['Subject: Brain'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/qwy6e4zb',
      type: 'Collection',
      label: {
        en: ['Subject: Neurology'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/dfkkhssp',
      type: 'Collection',
      label: {
        en: ['Subject: Psychology'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/ntw54nkc',
      type: 'Collection',
      label: {
        en: ['Subject: Krasnogorskiĭ, Nikolaĭ Ivanovich, 1883-'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/Danilov,_I._M.',
      type: 'Collection',
      label: {
        en: ['Contributor: Danilov, I. M.'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/jdnqqvb8',
      type: 'Collection',
      label: {
        en: ['Contributor: Krasnogorskiĭ, Nikolaĭ Ivanovich, 1883-'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/Durnovo,_A._S.',
      type: 'Collection',
      label: {
        en: ['Contributor: Durnovo, A. S.'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/Tcherkess,_D.',
      type: 'Collection',
      label: {
        en: ['Contributor: Tcherkess, D.'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/arszbw23',
      type: 'Collection',
      label: {
        en: ['Contributor: Merkulov, V. L. (Vasiliĭ Lavrentʹevich)'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/Golovnia,_A._D.',
      type: 'Collection',
      label: {
        en: ['Contributor: Golovnia, A. D.'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/Mejrabpom-Russ',
      type: 'Collection',
      label: {
        en: ['Contributor: Mejrabpom-Russ'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/Pudovkin,_Vsevolod_Illarionovich,_1893-1953._Akter_v_filʹme.',
      type: 'Collection',
      label: {
        en: [
          'Contributor: Pudovkin, Vsevolod Illarionovich, 1893-1953. Akter v filʹme.',
        ],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/sk2zkz3h',
      type: 'Collection',
      label: {
        en: ['Contributor: Vano, I.'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/Fursikov,_D._S.',
      type: 'Collection',
      label: {
        en: ['Contributor: Fursikov, D. S.'],
      },
    },
  ],
};
