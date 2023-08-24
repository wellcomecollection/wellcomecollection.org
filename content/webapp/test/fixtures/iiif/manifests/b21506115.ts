// This is based on https://iiif.wellcomecollection.org/presentation/v3/b21506115
// Retrieved 4 May 2023
//
// This pre-dates the DLCS image server upgrades in May 2023.
const manifest = {
  '@context': [
    'http://iiif.io/api/search/1/context.json',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  id: 'https://iiif.wellcomecollection.org/presentation/b21506115',
  type: 'Manifest',
  label: {
    en: [
      'Fish and fish entrÃ©es with appropriate sauces / by Florence B. Jack.',
    ],
  },
  thumbnail: [
    {
      id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0005.jp2/full/71,100/0/default.jpg',
      type: 'Image',
      width: 71,
      height: 100,
      service: [
        {
          '@id':
            'https://iiif.wellcomecollection.org/thumbs/b21506115_0005.jp2',
          '@type': 'ImageService2',
          profile: 'http://iiif.io/api/image/2/level0.json',
          width: 725,
          height: 1024,
          sizes: [
            {
              width: 71,
              height: 100,
            },
            {
              width: 142,
              height: 200,
            },
            {
              width: 283,
              height: 400,
            },
            {
              width: 725,
              height: 1024,
            },
          ],
        },
      ],
    },
  ],
  homepage: [
    {
      id: 'https://wellcomecollection.org/works/s7u4mmm7',
      type: 'Text',
      label: {
        en: [
          'Fish and fish entrÃ©es with appropriate sauces / by Florence B. Jack.',
        ],
      },
      format: 'text/html',
      language: ['en'],
    },
  ],
  metadata: [
    {
      label: {
        en: ['Publication/creation'],
      },
      value: {
        none: ['London ; Edinburgh : T.C. & E.C. Jack, 1902.'],
      },
    },
    {
      label: {
        en: ['Physical description'],
      },
      value: {
        en: ['x, 140 pages ; 17 cm.'],
      },
    },
    {
      label: {
        en: ['Contributors'],
      },
      value: {
        none: ['Jack, Florence B.', 'University of Leeds. Library'],
      },
    },
    {
      label: {
        en: ['Notes'],
      },
      value: {
        en: ['Includes index'],
      },
    },
    {
      label: {
        en: ['Type/technique'],
      },
      value: {
        en: ['Electronic books'],
      },
    },
    {
      label: {
        en: ['Subjects'],
      },
      value: {
        en: ['Cooking (Fish)'],
      },
    },
    {
      label: {
        en: ['Attribution and usage'],
      },
      value: {
        en: [
          'This material has been provided by This material has been provided by The University of Leeds Library. The original may be consulted at The University of Leeds Library. where the originals may be consulted.',
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
    {
      id: 'https://library.leeds.ac.uk/special-collections/collection/715#',
      type: 'Agent',
      label: {
        en: ['Leeds University Archive'],
      },
      homepage: [
        {
          id: 'https://library.leeds.ac.uk/special-collections/collection/715',
          type: 'Text',
          label: {
            en: ['Leeds University Archive'],
          },
          format: 'text/html',
        },
      ],
      logo: [
        {
          id: 'https://iiif.wellcomecollection.org/partners/leeds-logo.jpg',
          type: 'Image',
          format: 'image/jpg',
        },
      ],
    },
  ],
  rendering: [
    {
      id: 'https://iiif.wellcomecollection.org/pdf/b21506115',
      type: 'Text',
      label: {
        en: ['View as PDF'],
      },
      format: 'application/pdf',
    },
    {
      id: 'https://api.wellcomecollection.org/text/v1/b21506115',
      type: 'Text',
      label: {
        en: ['View raw text'],
      },
      format: 'text/plain',
    },
  ],
  seeAlso: [
    {
      id: 'https://api.wellcomecollection.org/catalogue/v2/works/s7u4mmm7',
      type: 'Dataset',
      profile: 'https://api.wellcomecollection.org/catalogue/v2/context.json',
      label: {
        en: ['Wellcome Collection Catalogue API'],
      },
      format: 'application/json',
    },
  ],
  service: [
    {
      '@id': 'https://iiif.wellcomecollection.org/search/v1/b21506115',
      '@type': 'SearchService1',
      profile: 'http://iiif.io/api/search/1/search',
      label: 'Search within this manifest',
      service: {
        '@id':
          'https://iiif.wellcomecollection.org/search/autocomplete/v1/b21506115',
        '@type': 'AutoCompleteService1',
        profile: 'http://iiif.io/api/search/1/autocomplete',
        label: 'Autocomplete words in this manifest',
      },
    },
  ],
  behavior: ['paged'],
  services: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115#tracking',
      type: 'Text',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      label: {
        en: [
          'Format: Monograph, Institution: Leeds University Archive, Identifier: b21506115, Digicode: digleeds, Collection code: n/a',
        ],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115#timestamp',
      type: 'Text',
      profile:
        'https://github.com/wellcomecollection/iiif-builder/build-timestamp',
      label: {
        none: ['2021-04-30T03:59:02.6166235Z'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115#accesscontrolhints',
      type: 'Text',
      profile: 'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
      label: {
        en: ['open'],
      },
    },
  ],
  items: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0001.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1651,
      height: 2310,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0001.jp2/full/71,100/0/default.jpg',
          type: 'Image',
          width: 71,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0001.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 732,
              height: 1024,
              sizes: [
                {
                  width: 71,
                  height: 100,
                },
                {
                  width: 143,
                  height: 200,
                },
                {
                  width: 286,
                  height: 400,
                },
                {
                  width: 732,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0001.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0001.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0001.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0001.jp2/full/732,1024/0/default.jpg',
                type: 'Image',
                width: 732,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0001.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1651,
                    height: 2310,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0001.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0001.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0002.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1613,
      height: 2278,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0002.jp2/full/71,100/0/default.jpg',
          type: 'Image',
          width: 71,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0002.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 725,
              height: 1024,
              sizes: [
                {
                  width: 71,
                  height: 100,
                },
                {
                  width: 142,
                  height: 200,
                },
                {
                  width: 283,
                  height: 400,
                },
                {
                  width: 725,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0002.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0002.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0002.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0002.jp2/full/725,1024/0/default.jpg',
                type: 'Image',
                width: 725,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0002.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1613,
                    height: 2278,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0002.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0002.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0003.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1613,
      height: 2278,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0003.jp2/full/71,100/0/default.jpg',
          type: 'Image',
          width: 71,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0003.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 725,
              height: 1024,
              sizes: [
                {
                  width: 71,
                  height: 100,
                },
                {
                  width: 142,
                  height: 200,
                },
                {
                  width: 283,
                  height: 400,
                },
                {
                  width: 725,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0003.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0003.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0003.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0003.jp2/full/725,1024/0/default.jpg',
                type: 'Image',
                width: 725,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0003.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1613,
                    height: 2278,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0003.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0003.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0004.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1613,
      height: 2278,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0004.jp2/full/71,100/0/default.jpg',
          type: 'Image',
          width: 71,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0004.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 725,
              height: 1024,
              sizes: [
                {
                  width: 71,
                  height: 100,
                },
                {
                  width: 142,
                  height: 200,
                },
                {
                  width: 283,
                  height: 400,
                },
                {
                  width: 725,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0004.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0004.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0004.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0004.jp2/full/725,1024/0/default.jpg',
                type: 'Image',
                width: 725,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0004.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1613,
                    height: 2278,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0004.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0004.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0005.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1613,
      height: 2278,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0005.jp2/full/71,100/0/default.jpg',
          type: 'Image',
          width: 71,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0005.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 725,
              height: 1024,
              sizes: [
                {
                  width: 71,
                  height: 100,
                },
                {
                  width: 142,
                  height: 200,
                },
                {
                  width: 283,
                  height: 400,
                },
                {
                  width: 725,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0005.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0005.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0005.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0005.jp2/full/725,1024/0/default.jpg',
                type: 'Image',
                width: 725,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0005.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1613,
                    height: 2278,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0005.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0005.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0006.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0006.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0006.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0006.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0006.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0006.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0006.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0006.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0006.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0006.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0007.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0007.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0007.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0007.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0007.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0007.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0007.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0007.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0007.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0007.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0008.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0008.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0008.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0008.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0008.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0008.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0008.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0008.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0008.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0008.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0009.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0009.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0009.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0009.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0009.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0009.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0009.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0009.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0009.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0009.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0010.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0010.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0010.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0010.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0010.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0010.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0010.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0010.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0010.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0010.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0011.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0011.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0011.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0011.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0011.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0011.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0011.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0011.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0011.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0011.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0012.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0012.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0012.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0012.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0012.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0012.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0012.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0012.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0012.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0012.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0013.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0013.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0013.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0013.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0013.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0013.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0013.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0013.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0013.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0013.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0014.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0014.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0014.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0014.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0014.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0014.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0014.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0014.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0014.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0014.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0015.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0015.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0015.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0015.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0015.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0015.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0015.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0015.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0015.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0015.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0016.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0016.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0016.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0016.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0016.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0016.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0016.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0016.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0016.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0016.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0017.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0017.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0017.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0017.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0017.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0017.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0017.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0017.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0017.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0017.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0018.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0018.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0018.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0018.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0018.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0018.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0018.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0018.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0018.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0018.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0019.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0019.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0019.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0019.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0019.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0019.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0019.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0019.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0019.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0019.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0020.jp2',
      type: 'Canvas',
      label: {
        none: ['3'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0020.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0020.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0020.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0020.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0020.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0020.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0020.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0020.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0020.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page 3'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0021.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0021.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0021.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0021.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0021.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0021.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0021.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0021.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0021.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0021.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0022.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0022.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0022.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0022.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0022.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0022.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0022.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0022.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0022.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0022.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0023.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0023.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0023.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0023.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0023.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0023.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0023.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0023.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0023.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0023.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0024.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0024.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0024.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0024.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0024.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0024.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0024.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0024.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0024.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0024.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0025.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0025.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0025.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0025.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0025.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0025.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0025.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0025.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0025.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0025.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0026.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0026.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0026.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0026.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0026.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0026.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0026.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0026.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0026.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0026.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0027.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0027.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0027.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0027.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0027.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0027.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0027.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0027.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0027.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0027.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0028.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0028.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0028.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0028.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0028.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0028.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0028.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0028.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0028.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0028.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0029.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0029.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0029.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0029.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0029.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0029.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0029.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0029.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0029.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0029.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0030.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0030.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0030.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0030.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0030.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0030.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0030.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0030.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0030.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0030.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0031.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0031.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0031.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0031.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0031.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0031.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0031.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0031.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0031.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0031.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0032.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0032.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0032.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0032.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0032.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0032.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0032.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0032.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0032.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0032.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0033.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0033.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0033.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0033.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0033.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0033.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0033.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0033.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0033.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0033.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0034.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0034.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0034.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0034.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0034.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0034.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0034.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0034.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0034.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0034.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0035.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0035.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0035.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0035.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0035.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0035.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0035.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0035.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0035.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0035.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0036.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0036.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0036.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0036.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0036.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0036.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0036.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0036.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0036.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0036.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0037.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0037.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0037.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0037.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0037.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0037.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0037.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0037.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0037.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0037.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0038.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0038.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0038.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0038.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0038.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0038.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0038.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0038.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0038.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0038.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0039.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0039.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0039.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0039.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0039.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0039.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0039.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0039.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0039.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0039.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0040.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0040.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0040.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0040.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0040.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0040.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0040.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0040.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0040.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0040.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0041.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0041.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0041.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0041.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0041.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0041.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0041.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0041.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0041.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0041.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0042.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0042.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0042.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0042.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0042.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0042.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0042.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0042.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0042.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0042.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0043.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0043.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0043.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0043.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0043.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0043.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0043.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0043.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0043.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0043.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0044.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0044.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0044.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0044.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0044.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0044.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0044.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0044.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0044.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0044.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0045.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0045.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0045.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0045.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0045.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0045.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0045.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0045.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0045.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0045.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0046.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0046.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0046.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0046.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0046.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0046.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0046.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0046.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0046.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0046.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0047.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0047.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0047.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0047.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0047.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0047.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0047.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0047.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0047.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0047.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0048.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0048.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0048.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0048.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0048.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0048.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0048.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0048.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0048.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0048.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0049.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0049.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0049.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0049.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0049.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0049.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0049.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0049.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0049.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0049.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0050.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0050.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0050.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0050.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0050.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0050.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0050.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0050.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0050.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0050.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0051.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0051.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0051.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0051.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0051.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0051.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0051.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0051.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0051.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0051.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0052.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0052.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0052.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0052.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0052.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0052.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0052.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0052.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0052.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0052.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0053.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0053.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0053.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0053.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0053.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0053.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0053.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0053.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0053.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0053.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0054.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0054.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0054.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0054.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0054.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0054.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0054.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0054.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0054.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0054.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0055.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0055.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0055.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0055.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0055.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0055.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0055.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0055.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0055.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0055.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0056.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0056.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0056.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0056.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0056.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0056.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0056.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0056.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0056.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0056.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0057.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0057.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0057.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0057.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0057.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0057.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0057.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0057.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0057.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0057.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0058.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0058.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0058.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0058.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0058.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0058.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0058.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0058.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0058.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0058.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0059.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0059.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0059.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0059.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0059.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0059.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0059.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0059.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0059.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0059.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0060.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0060.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0060.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0060.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0060.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0060.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0060.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0060.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0060.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0060.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0061.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0061.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0061.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0061.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0061.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0061.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0061.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0061.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0061.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0061.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0062.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0062.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0062.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0062.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0062.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0062.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0062.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0062.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0062.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0062.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0063.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0063.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0063.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0063.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0063.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0063.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0063.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0063.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0063.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0063.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0064.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0064.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0064.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0064.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0064.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0064.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0064.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0064.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0064.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0064.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0065.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0065.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0065.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0065.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0065.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0065.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0065.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0065.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0065.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0065.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0066.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0066.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0066.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0066.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0066.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0066.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0066.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0066.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0066.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0066.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0067.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0067.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0067.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0067.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0067.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0067.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0067.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0067.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0067.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0067.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0068.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0068.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0068.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0068.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0068.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0068.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0068.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0068.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0068.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0068.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0069.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0069.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0069.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0069.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0069.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0069.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0069.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0069.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0069.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0069.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0070.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0070.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0070.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0070.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0070.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0070.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0070.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0070.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0070.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0070.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0071.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0071.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0071.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0071.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0071.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0071.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0071.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0071.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0071.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0071.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0072.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0072.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0072.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0072.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0072.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0072.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0072.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0072.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0072.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0072.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0073.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0073.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0073.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0073.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0073.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0073.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0073.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0073.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0073.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0073.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0074.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0074.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0074.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0074.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0074.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0074.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0074.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0074.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0074.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0074.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0075.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0075.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0075.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0075.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0075.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0075.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0075.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0075.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0075.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0075.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0076.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0076.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0076.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0076.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0076.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0076.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0076.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0076.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0076.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0076.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0077.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0077.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0077.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0077.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0077.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0077.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0077.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0077.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0077.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0077.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0078.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0078.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0078.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0078.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0078.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0078.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0078.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0078.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0078.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0078.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0079.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0079.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0079.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0079.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0079.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0079.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0079.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0079.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0079.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0079.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0080.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0080.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0080.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0080.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0080.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0080.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0080.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0080.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0080.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0080.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0081.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0081.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0081.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0081.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0081.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0081.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0081.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0081.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0081.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0081.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0082.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0082.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0082.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0082.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0082.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0082.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0082.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0082.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0082.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0082.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0083.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0083.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0083.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0083.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0083.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0083.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0083.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0083.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0083.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0083.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0084.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0084.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0084.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0084.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0084.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0084.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0084.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0084.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0084.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0084.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0085.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0085.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0085.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0085.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0085.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0085.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0085.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0085.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0085.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0085.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0086.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0086.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0086.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0086.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0086.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0086.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0086.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0086.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0086.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0086.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0087.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0087.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0087.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0087.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0087.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0087.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0087.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0087.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0087.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0087.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0088.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0088.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0088.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0088.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0088.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0088.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0088.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0088.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0088.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0088.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0089.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0089.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0089.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0089.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0089.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0089.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0089.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0089.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0089.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0089.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0090.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0090.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0090.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0090.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0090.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0090.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0090.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0090.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0090.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0090.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0091.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0091.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0091.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0091.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0091.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0091.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0091.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0091.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0091.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0091.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0092.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0092.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0092.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0092.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0092.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0092.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0092.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0092.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0092.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0092.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0093.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0093.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0093.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0093.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0093.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0093.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0093.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0093.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0093.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0093.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0094.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0094.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0094.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0094.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0094.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0094.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0094.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0094.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0094.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0094.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0095.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0095.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0095.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0095.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0095.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0095.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0095.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0095.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0095.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0095.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0096.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0096.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0096.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0096.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0096.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0096.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0096.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0096.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0096.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0096.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0097.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0097.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0097.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0097.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0097.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0097.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0097.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0097.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0097.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0097.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0098.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0098.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0098.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0098.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0098.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0098.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0098.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0098.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0098.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0098.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0099.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0099.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0099.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0099.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0099.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0099.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0099.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0099.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0099.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0099.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0100.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0100.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0100.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0100.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0100.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0100.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0100.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0100.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0100.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0100.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0101.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0101.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0101.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0101.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0101.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0101.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0101.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0101.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0101.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0101.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0102.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0102.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0102.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0102.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0102.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0102.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0102.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0102.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0102.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0102.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0103.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0103.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0103.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0103.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0103.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0103.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0103.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0103.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0103.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0103.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0104.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0104.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0104.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0104.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0104.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0104.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0104.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0104.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0104.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0104.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0105.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0105.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0105.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0105.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0105.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0105.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0105.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0105.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0105.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0105.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0106.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0106.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0106.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0106.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0106.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0106.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0106.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0106.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0106.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0106.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0107.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0107.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0107.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0107.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0107.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0107.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0107.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0107.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0107.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0107.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0108.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0108.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0108.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0108.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0108.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0108.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0108.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0108.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0108.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0108.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0109.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0109.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0109.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0109.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0109.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0109.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0109.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0109.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0109.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0109.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0110.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0110.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0110.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0110.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0110.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0110.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0110.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0110.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0110.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0110.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0111.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0111.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0111.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0111.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0111.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0111.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0111.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0111.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0111.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0111.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0112.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0112.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0112.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0112.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0112.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0112.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0112.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0112.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0112.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0112.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0113.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0113.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0113.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0113.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0113.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0113.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0113.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0113.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0113.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0113.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0114.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0114.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0114.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0114.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0114.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0114.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0114.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0114.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0114.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0114.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0115.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0115.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0115.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0115.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0115.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0115.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0115.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0115.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0115.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0115.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0116.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0116.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0116.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0116.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0116.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0116.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0116.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0116.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0116.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0116.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0117.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0117.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0117.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0117.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0117.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0117.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0117.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0117.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0117.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0117.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0118.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0118.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0118.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0118.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0118.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0118.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0118.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0118.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0118.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0118.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0119.jp2',
      type: 'Canvas',
      label: {
        none: ['140'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0119.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0119.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0119.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0119.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0119.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0119.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0119.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0119.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0119.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page 140'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0120.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0120.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0120.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0120.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0120.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0120.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0120.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0120.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0120.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0120.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0121.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0121.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0121.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0121.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0121.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0121.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0121.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0121.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0121.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0121.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0122.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0122.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0122.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0122.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0122.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0122.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0122.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0122.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0122.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0122.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0123.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0123.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0123.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0123.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0123.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0123.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0123.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0123.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0123.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0123.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0124.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0124.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0124.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0124.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0124.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0124.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0124.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0124.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0124.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0124.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0125.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0125.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0125.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0125.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0125.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0125.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0125.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0125.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0125.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0125.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0126.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0126.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0126.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0126.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0126.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0126.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0126.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0126.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0126.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0126.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0127.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0127.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0127.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0127.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0127.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0127.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0127.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0127.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0127.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0127.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0128.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0128.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0128.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0128.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0128.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0128.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0128.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0128.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0128.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0128.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0129.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0129.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0129.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0129.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0129.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0129.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0129.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0129.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0129.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0129.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0130.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1530,
      height: 2099,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0130.jp2/full/73,100/0/default.jpg',
          type: 'Image',
          width: 73,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0130.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 746,
              height: 1024,
              sizes: [
                {
                  width: 73,
                  height: 100,
                },
                {
                  width: 146,
                  height: 200,
                },
                {
                  width: 292,
                  height: 400,
                },
                {
                  width: 746,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0130.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0130.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0130.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0130.jp2/full/746,1024/0/default.jpg',
                type: 'Image',
                width: 746,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0130.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1530,
                    height: 2099,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0130.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0130.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0131.jp2',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1875,
      height: 2353,
      thumbnail: [
        {
          id: 'https://iiif.wellcomecollection.org/thumbs/b21506115_0131.jp2/full/80,100/0/default.jpg',
          type: 'Image',
          width: 80,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21506115_0131.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 816,
              height: 1024,
              sizes: [
                {
                  width: 80,
                  height: 100,
                },
                {
                  width: 159,
                  height: 200,
                },
                {
                  width: 319,
                  height: 400,
                },
                {
                  width: 816,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
      seeAlso: [
        {
          id: 'https://api.wellcomecollection.org/text/alto/b21506115/b21506115_0131.jp2',
          type: 'Dataset',
          profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
          label: {
            none: ['METS-ALTO XML'],
          },
          format: 'text/xml',
        },
      ],
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0131.jp2/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0131.jp2/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif.wellcomecollection.org/image/b21506115_0131.jp2/full/816,1024/0/default.jpg',
                type: 'Image',
                width: 816,
                height: 1024,
                format: 'image/jpeg',
                service: [
                  {
                    '@id':
                      'https://iiif.wellcomecollection.org/image/b21506115_0131.jp2',
                    '@type': 'ImageService2',
                    profile: 'http://iiif.io/api/image/2/level1.json',
                    width: 1875,
                    height: 2353,
                  },
                ],
              },
              target:
                'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0131.jp2',
            },
          ],
        },
      ],
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/b21506115_0131.jp2/line',
          type: 'AnnotationPage',
          label: {
            en: ['Text of page  -'],
          },
        },
      ],
    },
  ],
  structures: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/ranges/LOG_0001',
      type: 'Range',
      label: {
        none: ['Cover'],
      },
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0001.jp2',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/ranges/LOG_0002',
      type: 'Range',
      label: {
        none: ['Title Page'],
      },
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0005.jp2',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/ranges/LOG_0003',
      type: 'Range',
      label: {
        none: ['Table of Contents'],
      },
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0007.jp2',
          type: 'Canvas',
        },
      ],
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b21506115/ranges/LOG_0004',
      type: 'Range',
      label: {
        none: ['Cover'],
      },
      items: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b21506115/canvases/b21506115_0130.jp2',
          type: 'Canvas',
        },
      ],
    },
  ],
  annotations: [
    {
      id: 'https://iiif.wellcomecollection.org/annotations/v3/b21506115/images',
      type: 'AnnotationPage',
      label: {
        en: ['OCR-identified images and figures for b21506115'],
      },
    },
  ],
  partOf: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/ntscr3hd',
      type: 'Collection',
      label: {
        en: ['Contributor: Jack, Florence B.'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/qu7wk6cj',
      type: 'Collection',
      label: {
        en: ['Contributor: University of Leeds. Library'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/kmpjbauk',
      type: 'Collection',
      label: {
        en: ['Subject: Cooking (Fish)'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/genres/Electronic_books',
      type: 'Collection',
      label: {
        en: ['Genre: Electronic books'],
      },
    },
  ],
};

export default manifest;
