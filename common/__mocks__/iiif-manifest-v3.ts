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
  id: 'https://iiif.wellcomecollection.org/presentation/b16763506',
  type: 'Manifest',
  label: {
    en: ["Hygiene. Kate's party."],
  },
  summary: {
    en: [
      "<p>An animated cartoon aimed at children. A 'hy-genie' visits Kate's birthday party and explains to the children what germs are and how they are spread. </p>",
    ],
  },
  homepage: [
    {
      id: 'https://wellcomecollection.org/works/be6gwe5a',
      type: 'Text',
      label: {
        en: ["Hygiene. Kate's party."],
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
          "<p>An animated cartoon aimed at children. A 'hy-genie' visits Kate's birthday party and explains to the children what germs are and how they are spread. </p>",
        ],
      },
    },
    {
      label: {
        en: ['Publication/creation'],
      },
      value: {
        none: ['UK : Central Office of Information, 1990.'],
      },
    },
    {
      label: {
        en: ['Physical description'],
      },
      value: {
        en: ['1 encoded moving image (5.28 min.) : sound, color'],
      },
    },
    {
      label: {
        en: ['Copyright note'],
      },
      value: {
        en: ['Crown copyright, managed by BFI.'],
      },
    },
    {
      label: {
        en: ['Notes'],
      },
      value: {
        en: [
          'This video was made from material preserved by the BFI National Archive.',
        ],
      },
    },
    {
      label: {
        en: ['Creator/production credits'],
      },
      value: {
        en: [
          'Produced for the Department of Health and the Ministry of Agriculture, Fisheries and Food by the Central Office of Information.',
        ],
      },
    },
    {
      label: {
        en: ['Type/technique'],
      },
      value: {
        en: ['Encoded moving images'],
      },
    },
    {
      label: {
        en: ['Subjects'],
      },
      value: {
        en: [
          'Hygiene',
          'Bacteria',
          'Public Health',
          'Food Contamination',
          'Great Britain',
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
  seeAlso: [
    {
      id: 'https://api.wellcomecollection.org/catalogue/v2/works/be6gwe5a',
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
      id: 'https://iiif.wellcomecollection.org/presentation/b16763506_0001#tracking',
      type: 'Text',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      label: {
        en: [
          'Format: Video, Institution: n/a, Identifier: b16763506, Digicode: digfilm, Collection code: n/a',
        ],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b16763506_0001#timestamp',
      type: 'Text',
      profile:
        'https://github.com/wellcomecollection/iiif-builder/build-timestamp',
      label: {
        none: ['2021-04-29T05:56:36.6842381Z'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b16763506_0001#accesscontrolhints',
      type: 'Text',
      profile: 'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
      label: {
        en: ['open'],
      },
    },
  ],
  placeholderCanvas: {
    id: 'https://iiif.wellcomecollection.org/presentation/b16763506/canvases/poster-b16763506_0055-0000-4219-0000-0-0000-0000-0.mpg',
    type: 'Canvas',
    label: {
      en: ['Poster Image Canvas'],
    },
    width: 600,
    height: 400,
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b16763506/canvases/poster-b16763506_0055-0000-4219-0000-0-0000-0000-0.mpg/painting',
        type: 'AnnotationPage',
        items: [
          {
            id: 'https://iiif.wellcomecollection.org/presentation/b16763506/canvases/poster-b16763506_0055-0000-4219-0000-0-0000-0000-0.mpg/painting/anno',
            type: 'Annotation',
            motivation: 'painting',
            body: {
              id: 'https://iiif.wellcomecollection.org/thumb/b16763506',
              type: 'Image',
              label: {
                en: ['Poster Image'],
              },
              format: 'image/jpeg',
            },
            target:
              'https://iiif.wellcomecollection.org/presentation/b16763506/canvases/poster-b16763506_0055-0000-4219-0000-0-0000-0000-0.mpg/painting',
          },
        ],
      },
    ],
  },
  items: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b16763506/canvases/b16763506_0055-0000-4219-0000-0-0000-0000-0.mpg',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 999,
      height: 999,
      duration: 328,
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b16763506/canvases/b16763506_0055-0000-4219-0000-0-0000-0000-0.mpg/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b16763506/canvases/b16763506_0055-0000-4219-0000-0-0000-0000-0.mpg/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                type: 'Choice',
                items: [
                  {
                    width: 720,
                    height: 720,
                    duration: 328,
                    id: 'https://iiif.wellcomecollection.org/av/b16763506_0055-0000-4219-0000-0-0000-0000-0.mpg/full/full/max/max/0/default.mp4',
                    type: 'Video',
                    label: {
                      en: ['MP4'],
                    },
                    format: 'video/mp4',
                  },
                  {
                    width: 720,
                    height: 720,
                    duration: 328,
                    id: 'https://iiif.wellcomecollection.org/av/b16763506_0055-0000-4219-0000-0-0000-0000-0.mpg/full/full/max/max/0/default.webm',
                    type: 'Video',
                    label: {
                      en: ['WebM'],
                    },
                    format: 'video/webm',
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b16763506/canvases/b16763506_0055-0000-4219-0000-0-0000-0000-0.mpg',
            },
          ],
        },
      ],
    },
  ],
  partOf: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/bfz4xhd2',
      type: 'Collection',
      label: {
        en: ['Subject: Hygiene'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/pz9t8xuu',
      type: 'Collection',
      label: {
        en: ['Subject: Bacteria'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/tva37rme',
      type: 'Collection',
      label: {
        en: ['Subject: Public Health'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/mysc265e',
      type: 'Collection',
      label: {
        en: ['Subject: Food Contamination'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/n4fvtc49',
      type: 'Collection',
      label: {
        en: ['Subject: Great Britain'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/genres/Encoded_moving_images',
      type: 'Collection',
      label: {
        en: ['Genre: Encoded moving images'],
      },
    },
  ],
};
