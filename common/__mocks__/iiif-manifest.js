const manifest = {
  '@context': 'http://iiif.io/api/presentation/2/context.json',
  '@id': 'https://wellcomelibrary.org/iiif/b21538906/manifest',
  '@type': 'sc:Manifest',
  label: 'Egg cookery : how to cook eggs in 150 ways, English and foreign',
  metadata: [
    {
      label: 'Title',
      value: 'Egg cookery :',
    },
    {
      label: 'Author(s)',
      value: 'Davidson, J. E; University of Leeds',
    },
    {
      label: 'Publication date',
      value: '1899.',
    },
    {
      label: 'Repository',
      value:
        "<img src='https://wellcomelibrary.org/biblio/b21538906/repositoryLogo' alt='The University of Leeds Library' /><br/><br/>This material has been provided by The University of Leeds Library where the originals may be consulted.",
    },
    {
      label: '',
      value:
        "<a href='https://search.wellcomelibrary.org/iii/encore/record/C__Rb2153890'>View full catalogue record</a>",
    },
    {
      label: 'Full conditions of use',
      value:
        'This work has been identified as being free of known restrictions under copyright law, including all related and neighbouring rights and is being made available under the <a target="_top" href="http://creativecommons.org/publicdomain/mark/1.0/">Creative Commons, Public Domain Mark</a>.<br/><br/>You can copy, modify, distribute and perform the work, even for commercial purposes, without asking permission.',
    },
  ],
  license: 'https://creativecommons.org/publicdomain/mark/1.0/',
  logo: 'https://wellcomelibrary.org/assets/img/squarelogo64.png',
  related: {
    '@id': 'https://wellcomelibrary.org/item/b21538906',
    format: 'text/html',
  },
  seeAlso: [
    {
      '@id': 'https://wellcomelibrary.org/data/b21538906.json',
      format: 'application/json',
      profile: 'http://wellcomelibrary.org/profiles/res',
    },
    {
      '@id': 'https://wellcomelibrary.org/resource/schemaorg/b21538906',
      format: 'application/ld+json',
      profile: 'http://iiif.io/community/profiles/discovery/schema',
    },
    {
      '@id': 'https://wellcomelibrary.org/resource/dublincore/b21538906',
      format: 'application/ld+json',
      profile: 'http://iiif.io/community/profiles/discovery/dc',
    },
  ],
  service: [
    {
      '@context': 'http://wellcomelibrary.org/ld/iiif-ext/0/context.json',
      '@id':
        'https://wellcomelibrary.org/iiif/b21538906-0/access-control-hints-service',
      profile: 'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
      accessHint: 'open',
    },
    {
      '@context': 'http://iiif.io/api/search/0/context.json',
      '@id': 'https://wellcomelibrary.org/annoservices/search/b21538906',
      profile: 'http://iiif.io/api/search/0/search',
      label: 'Search within this manifest',
      service: {
        '@id':
          'https://wellcomelibrary.org/annoservices/autocomplete/b21538906',
        profile: 'http://iiif.io/api/search/0/autocomplete',
        label: 'Get suggested words in this manifest',
      },
    },
    {
      '@context': 'http://universalviewer.io/context.json',
      '@id': 'http://wellcomelibrary.org/service/trackingLabels/b21538906',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      trackingLabel:
        'Format: monograph, Institution: The University of Leeds Library, Identifier: b21538906, Digicode: digleeds, Collection code: n/a',
    },
  ],
  sequences: [
    {
      '@id': 'https://wellcomelibrary.org/iiif/b21538906/sequence/s0',
      '@type': 'sc:Sequence',
      label: 'Sequence s0',
      rendering: [
        {
          '@id': 'https://dlcs.io/pdf/wellcome/pdf-item/b21538906/0',
          format: 'application/pdf',
          label: 'Download as PDF',
        },
        {
          '@id':
            'https://wellcomelibrary.org/service/fulltext/b21538906/0?raw=true',
          format: 'text/plain',
          label: 'Download raw text',
        },
      ],
      viewingHint: 'paged',
      canvases: [
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c0',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0001.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0001.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=0',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3506,
          width: 2244,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0001.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0001.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0001.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c0',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/0',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c1',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0002.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0002.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 658,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 129,
                  height: 200,
                },
                {
                  width: 257,
                  height: 400,
                },
                {
                  width: 658,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=1',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3441,
          width: 2212,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0002.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0002.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 658,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0002.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c1',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/1',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c2',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0003.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0003.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 658,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 129,
                  height: 200,
                },
                {
                  width: 257,
                  height: 400,
                },
                {
                  width: 658,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=2',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3441,
          width: 2212,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0003.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0003.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 658,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0003.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/2',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c3',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0004.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0004.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=3',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0004.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0004.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0004.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c3',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/3',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c4',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0005.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0005.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=4',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0005.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0005.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0005.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c4',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/4',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c5',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0006.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0006.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=5',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0006.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0006.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0006.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c5',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/5',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c6',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0007.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0007.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=6',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0007.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0007.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0007.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c6',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/6',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c7',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0008.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0008.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=7',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0008.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0008.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0008.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c7',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/7',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c8',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0009.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0009.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=8',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0009.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0009.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0009.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c8',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/8',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c9',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0010.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0010.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=9',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0010.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0010.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0010.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c9',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/9',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c10',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0011.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0011.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=10',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0011.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0011.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0011.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c10',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/10',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c11',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0012.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0012.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=11',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0012.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0012.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0012.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c11',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/11',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c12',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0013.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0013.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=12',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0013.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0013.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0013.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c12',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/12',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c13',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0014.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0014.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=13',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0014.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0014.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0014.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c13',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/13',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c14',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0015.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0015.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=14',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0015.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0015.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0015.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c14',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/14',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c15',
          '@type': 'sc:Canvas',
          label: '12',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0016.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0016.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=15',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0016.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0016.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0016.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c15',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/15',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c16',
          '@type': 'sc:Canvas',
          label: '13',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0017.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0017.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=16',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0017.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0017.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0017.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c16',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/16',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c17',
          '@type': 'sc:Canvas',
          label: '14',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0018.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0018.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=17',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0018.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0018.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0018.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c17',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/17',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c18',
          '@type': 'sc:Canvas',
          label: '15',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0019.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0019.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=18',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0019.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0019.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0019.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c18',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/18',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c19',
          '@type': 'sc:Canvas',
          label: '16',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0020.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0020.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=19',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0020.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0020.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0020.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c19',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/19',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c20',
          '@type': 'sc:Canvas',
          label: '17',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0021.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0021.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 649,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 127,
                  height: 200,
                },
                {
                  width: 253,
                  height: 400,
                },
                {
                  width: 649,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=20',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0021.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0021.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0021.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c20',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/20',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c21',
          '@type': 'sc:Canvas',
          label: '18',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0022.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0022.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=21',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0022.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0022.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0022.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c21',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/21',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c22',
          '@type': 'sc:Canvas',
          label: '19',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0023.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0023.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=22',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0023.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0023.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0023.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c22',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/22',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c23',
          '@type': 'sc:Canvas',
          label: '20',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0024.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0024.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=23',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0024.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0024.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0024.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c23',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/23',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c24',
          '@type': 'sc:Canvas',
          label: '21',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0025.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0025.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=24',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0025.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0025.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0025.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c24',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/24',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c25',
          '@type': 'sc:Canvas',
          label: '22',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0026.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0026.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=25',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0026.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0026.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0026.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c25',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/25',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c26',
          '@type': 'sc:Canvas',
          label: '23',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0027.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0027.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=26',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0027.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0027.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0027.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c26',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/26',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c27',
          '@type': 'sc:Canvas',
          label: '24',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0028.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0028.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=27',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0028.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0028.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0028.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c27',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/27',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c28',
          '@type': 'sc:Canvas',
          label: '25',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0029.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0029.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=28',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0029.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0029.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0029.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c28',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/28',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c29',
          '@type': 'sc:Canvas',
          label: '26',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0030.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0030.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=29',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0030.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0030.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0030.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c29',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/29',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c30',
          '@type': 'sc:Canvas',
          label: '27',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0031.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0031.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=30',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0031.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0031.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0031.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c30',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/30',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c31',
          '@type': 'sc:Canvas',
          label: '28',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0032.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0032.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=31',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0032.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0032.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0032.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c31',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/31',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c32',
          '@type': 'sc:Canvas',
          label: '29',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0033.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0033.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=32',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0033.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0033.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0033.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c32',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/32',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c33',
          '@type': 'sc:Canvas',
          label: '30',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0034.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0034.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=33',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0034.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0034.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0034.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c33',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/33',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c34',
          '@type': 'sc:Canvas',
          label: '31',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0035.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0035.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=34',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0035.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0035.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0035.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c34',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/34',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c35',
          '@type': 'sc:Canvas',
          label: '32',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0036.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0036.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=35',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0036.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0036.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0036.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c35',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/35',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c36',
          '@type': 'sc:Canvas',
          label: '33',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0037.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0037.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=36',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0037.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0037.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0037.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c36',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/36',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c37',
          '@type': 'sc:Canvas',
          label: '34',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0038.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0038.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=37',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0038.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0038.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0038.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c37',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/37',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c38',
          '@type': 'sc:Canvas',
          label: '35',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0039.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0039.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=38',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0039.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0039.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0039.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c38',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/38',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c39',
          '@type': 'sc:Canvas',
          label: '36',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0040.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0040.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=39',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0040.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0040.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0040.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c39',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/39',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c40',
          '@type': 'sc:Canvas',
          label: '37',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0041.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0041.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=40',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0041.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0041.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0041.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c40',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/40',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c41',
          '@type': 'sc:Canvas',
          label: '38',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0042.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0042.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=41',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0042.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0042.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0042.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c41',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/41',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c42',
          '@type': 'sc:Canvas',
          label: '39',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0043.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0043.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=42',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0043.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0043.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0043.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c42',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/42',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c43',
          '@type': 'sc:Canvas',
          label: '40',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0044.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0044.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=43',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0044.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0044.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0044.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c43',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/43',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c44',
          '@type': 'sc:Canvas',
          label: '41',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0045.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0045.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=44',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0045.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0045.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0045.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c44',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/44',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c45',
          '@type': 'sc:Canvas',
          label: '42',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0046.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0046.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=45',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0046.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0046.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0046.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c45',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/45',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c46',
          '@type': 'sc:Canvas',
          label: '43',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0047.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0047.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=46',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0047.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0047.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0047.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c46',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/46',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c47',
          '@type': 'sc:Canvas',
          label: '44',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0048.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0048.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=47',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0048.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0048.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0048.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c47',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/47',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c48',
          '@type': 'sc:Canvas',
          label: '45',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0049.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0049.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=48',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0049.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0049.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0049.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c48',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/48',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c49',
          '@type': 'sc:Canvas',
          label: '46',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0050.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0050.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=49',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0050.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0050.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0050.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c49',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/49',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c50',
          '@type': 'sc:Canvas',
          label: '47',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0051.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0051.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=50',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0051.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0051.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0051.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c50',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/50',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c51',
          '@type': 'sc:Canvas',
          label: '48',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0052.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0052.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=51',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0052.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0052.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0052.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c51',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/51',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c52',
          '@type': 'sc:Canvas',
          label: '49',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0053.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0053.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=52',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0053.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0053.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0053.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c52',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/52',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c53',
          '@type': 'sc:Canvas',
          label: '50',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0054.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0054.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=53',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0054.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0054.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0054.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c53',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/53',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c54',
          '@type': 'sc:Canvas',
          label: '51',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0055.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0055.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=54',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0055.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0055.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0055.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c54',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/54',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c55',
          '@type': 'sc:Canvas',
          label: '52',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0056.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0056.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=55',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0056.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0056.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0056.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c55',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/55',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c56',
          '@type': 'sc:Canvas',
          label: '53',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0057.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0057.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=56',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0057.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0057.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0057.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c56',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/56',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c57',
          '@type': 'sc:Canvas',
          label: '54',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0058.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0058.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=57',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0058.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0058.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0058.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c57',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/57',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c58',
          '@type': 'sc:Canvas',
          label: '55',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0059.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0059.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=58',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0059.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0059.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0059.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c58',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/58',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c59',
          '@type': 'sc:Canvas',
          label: '56',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0060.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0060.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=59',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0060.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0060.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0060.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c59',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/59',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c60',
          '@type': 'sc:Canvas',
          label: '57',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0061.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0061.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=60',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0061.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0061.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0061.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c60',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/60',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c61',
          '@type': 'sc:Canvas',
          label: '58',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0062.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0062.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=61',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0062.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0062.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0062.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c61',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/61',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c62',
          '@type': 'sc:Canvas',
          label: '59',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0063.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0063.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=62',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0063.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0063.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0063.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c62',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/62',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c63',
          '@type': 'sc:Canvas',
          label: '60',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0064.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0064.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=63',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0064.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0064.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0064.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c63',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/63',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c64',
          '@type': 'sc:Canvas',
          label: '61',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0065.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0065.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=64',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0065.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0065.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0065.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c64',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/64',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c65',
          '@type': 'sc:Canvas',
          label: '62',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0066.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0066.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=65',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0066.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0066.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0066.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c65',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/65',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c66',
          '@type': 'sc:Canvas',
          label: '63',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0067.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0067.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=66',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0067.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0067.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0067.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c66',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/66',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c67',
          '@type': 'sc:Canvas',
          label: '64',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0068.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0068.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=67',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0068.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0068.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0068.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c67',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/67',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c68',
          '@type': 'sc:Canvas',
          label: '65',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0069.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0069.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=68',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0069.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0069.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0069.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c68',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/68',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c69',
          '@type': 'sc:Canvas',
          label: '66',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0070.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0070.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=69',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0070.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0070.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0070.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c69',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/69',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c70',
          '@type': 'sc:Canvas',
          label: '67',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0071.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0071.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=70',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0071.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0071.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0071.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c70',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/70',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c71',
          '@type': 'sc:Canvas',
          label: '68',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0072.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0072.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=71',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0072.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0072.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0072.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c71',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/71',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c72',
          '@type': 'sc:Canvas',
          label: '69',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0073.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0073.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=72',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0073.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0073.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0073.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c72',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/72',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c73',
          '@type': 'sc:Canvas',
          label: '70',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0074.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0074.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=73',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0074.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0074.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0074.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c73',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/73',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c74',
          '@type': 'sc:Canvas',
          label: '71',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0075.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0075.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=74',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0075.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0075.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0075.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c74',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/74',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c75',
          '@type': 'sc:Canvas',
          label: '72',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0076.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0076.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=75',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0076.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0076.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0076.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c75',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/75',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c76',
          '@type': 'sc:Canvas',
          label: '73',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0077.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0077.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=76',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0077.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0077.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0077.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c76',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/76',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c77',
          '@type': 'sc:Canvas',
          label: '74',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0078.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0078.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=77',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0078.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0078.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0078.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c77',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/77',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c78',
          '@type': 'sc:Canvas',
          label: '75',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0079.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0079.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=78',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0079.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0079.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0079.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c78',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/78',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c79',
          '@type': 'sc:Canvas',
          label: '76',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0080.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0080.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=79',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0080.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0080.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0080.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c79',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/79',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c80',
          '@type': 'sc:Canvas',
          label: '77',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0081.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0081.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=80',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0081.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0081.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0081.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c80',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/80',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c81',
          '@type': 'sc:Canvas',
          label: '78',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0082.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0082.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=81',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0082.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0082.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0082.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c81',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/81',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c82',
          '@type': 'sc:Canvas',
          label: '79',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0083.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0083.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=82',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0083.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0083.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0083.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c82',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/82',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c83',
          '@type': 'sc:Canvas',
          label: '80',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0084.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0084.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=83',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0084.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0084.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0084.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c83',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/83',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c84',
          '@type': 'sc:Canvas',
          label: '81',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0085.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0085.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=84',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0085.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0085.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0085.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c84',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/84',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c85',
          '@type': 'sc:Canvas',
          label: '82',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0086.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0086.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=85',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0086.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0086.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0086.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c85',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/85',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c86',
          '@type': 'sc:Canvas',
          label: '83',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0087.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0087.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=86',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0087.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0087.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0087.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c86',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/86',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c87',
          '@type': 'sc:Canvas',
          label: '84',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0088.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0088.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=87',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0088.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0088.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0088.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c87',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/87',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c88',
          '@type': 'sc:Canvas',
          label: '85',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0089.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0089.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=88',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0089.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0089.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0089.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c88',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/88',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c89',
          '@type': 'sc:Canvas',
          label: '86',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0090.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0090.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=89',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0090.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0090.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0090.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c89',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/89',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c90',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0091.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0091.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=90',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0091.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0091.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0091.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c90',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/90',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c91',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0092.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0092.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=91',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0092.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0092.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0092.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c91',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/91',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c92',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0093.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0093.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=92',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0093.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0093.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0093.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c92',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/92',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c93',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0094.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0094.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=93',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0094.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0094.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0094.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c93',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/93',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c94',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0095.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0095.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 655,
              sizes: [
                {
                  width: 64,
                  height: 100,
                },
                {
                  width: 128,
                  height: 200,
                },
                {
                  width: 256,
                  height: 400,
                },
                {
                  width: 655,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=94',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0095.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0095.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0095.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c94',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/94',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b21538906/canvas/c95',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/5/b21538906_0096.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id': 'https://dlcs.io/thumbs/wellcome/5/b21538906_0096.jp2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 646,
              sizes: [
                {
                  width: 63,
                  height: 100,
                },
                {
                  width: 126,
                  height: 200,
                },
                {
                  width: 252,
                  height: 400,
                },
                {
                  width: 646,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b21538906/0?image=95',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3561,
          width: 2245,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b21538906_0096.jp2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/5/b21538906_0096.jp2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 646,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/5/b21538906_0096.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b21538906/canvas/c95',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b21538906/contentAsText/95',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
      ],
    },
  ],
  structures: [
    {
      '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-0',
      '@type': 'sc:Range',
      label: 'Cover',
      canvases: ['https://wellcomelibrary.org/iiif/b21538906/canvas/c0'],
    },
    {
      '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-1',
      '@type': 'sc:Range',
      label: 'Title Page',
      canvases: ['https://wellcomelibrary.org/iiif/b21538906/canvas/c6'],
    },
    {
      '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-2',
      '@type': 'sc:Range',
      label: 'Cover',
      canvases: ['https://wellcomelibrary.org/iiif/b21538906/canvas/c95'],
    },
  ],
  otherContent: [
    {
      '@id': 'https://wellcomelibrary.org/iiif/b21538906/images',
      '@type': 'sc:AnnotationList',
      label: 'OCR-identified images and figures for b21538906',
    },
    {
      '@id': 'https://wellcomelibrary.org/iiif/b21538906/allcontent',
      '@type': 'sc:AnnotationList',
      label: 'All OCR-derived annotations for b21538906',
    },
  ],
};
export default manifest;
