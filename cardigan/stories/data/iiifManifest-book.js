const bookManifest = {
  '@context': 'http://iiif.io/api/presentation/2/context.json',
  '@id': 'https://wellcomelibrary.org/iiif/b28043534/manifest',
  '@type': 'sc:Manifest',
  label: 'Principles of scientific botany, or, Botany as an inductive science',
  metadata: [
    {
      label: 'Title',
      value:
        'Principles of scientific botany, or, Botany as an inductive science',
    },
    {
      label: 'Author(s)',
      value:
        'Lankester, E. Ray; Schleiden, M. J; Royal College of Physicians of Edinburgh',
    },
    {
      label: 'Publication date',
      value: '1849.',
    },
    {
      label: 'Repository',
      value:
        "<img src='https://wellcomelibrary.org/biblio/b28043534/repositoryLogo' alt='Royal College of Physicians of Edinburgh' /><br/><br/>This material has been provided by Royal College of Physicians of Edinburgh where the originals may be consulted.",
    },
    {
      label: '',
      value:
        "<a href='https://search.wellcomelibrary.org/iii/encore/record/C__Rb2804353'>View full catalogue record</a>",
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
    '@id': 'https://wellcomelibrary.org/item/b28043534',
    format: 'text/html',
  },
  seeAlso: [
    {
      '@id': 'https://wellcomelibrary.org/data/b28043534.json',
      format: 'application/json',
      profile: 'http://wellcomelibrary.org/profiles/res',
    },
    {
      '@id': 'https://wellcomelibrary.org/resource/schemaorg/b28043534',
      format: 'application/ld+json',
      profile: 'http://iiif.io/community/profiles/discovery/schema',
    },
    {
      '@id': 'https://wellcomelibrary.org/resource/dublincore/b28043534',
      format: 'application/ld+json',
      profile: 'http://iiif.io/community/profiles/discovery/dc',
    },
  ],
  service: [
    {
      '@context': 'http://wellcomelibrary.org/ld/iiif-ext/0/context.json',
      '@id':
        'https://wellcomelibrary.org/iiif/b28043534-0/access-control-hints-service',
      profile: 'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
      accessHint: 'open',
    },
    {
      '@context': 'http://iiif.io/api/search/0/context.json',
      '@id': 'https://wellcomelibrary.org/annoservices/search/b28043534',
      profile: 'http://iiif.io/api/search/0/search',
      label: 'Search within this manifest',
      service: {
        '@id':
          'https://wellcomelibrary.org/annoservices/autocomplete/b28043534',
        profile: 'http://iiif.io/api/search/0/autocomplete',
        label: 'Get suggested words in this manifest',
      },
    },
    {
      '@context': 'http://universalviewer.io/context.json',
      '@id': 'http://wellcomelibrary.org/service/trackingLabels/b28043534',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      trackingLabel:
        'Format: monograph, Institution: Royal College of Physicians of Edinburgh, Identifier: b28043534, Digicode: digRCPE, Collection code: n/a',
    },
  ],
  sequences: [
    {
      '@id': 'https://wellcomelibrary.org/iiif/b28043534/sequence/s0',
      '@type': 'sc:Sequence',
      label: 'Sequence s0',
      rendering: [
        {
          '@id': 'https://dlcs.io/pdf/wellcome/pdf-item/b28043534/0',
          format: 'application/pdf',
          label: 'Download as PDF',
        },
        {
          '@id':
            'https://wellcomelibrary.org/service/fulltext/b28043534/0?raw=true',
          format: 'text/plain',
          label: 'Download raw text',
        },
      ],
      viewingHint: 'paged',
      canvases: [
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c0',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/2820033f-85b4-4d48-aa4b-1951ac470e7b/full/61,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/2820033f-85b4-4d48-aa4b-1951ac470e7b',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 626,
              sizes: [
                {
                  width: 61,
                  height: 100,
                },
                {
                  width: 122,
                  height: 200,
                },
                {
                  width: 244,
                  height: 400,
                },
                {
                  width: 626,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=0',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3473,
          width: 2122,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/2820033f-85b4-4d48-aa4b-1951ac470e7b',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/2820033f-85b4-4d48-aa4b-1951ac470e7b/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 626,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/2820033f-85b4-4d48-aa4b-1951ac470e7b',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c0',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/0',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c1',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/3d8b8a36-1ba1-401c-81cf-5daf891bcbbc/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/3d8b8a36-1ba1-401c-81cf-5daf891bcbbc',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=1',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/3d8b8a36-1ba1-401c-81cf-5daf891bcbbc',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/3d8b8a36-1ba1-401c-81cf-5daf891bcbbc/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/3d8b8a36-1ba1-401c-81cf-5daf891bcbbc',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c1',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/1',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c2',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/3ce60b7b-ad86-4efe-8fa1-829a94984a5f/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/3ce60b7b-ad86-4efe-8fa1-829a94984a5f',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=2',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/3ce60b7b-ad86-4efe-8fa1-829a94984a5f',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/3ce60b7b-ad86-4efe-8fa1-829a94984a5f/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/3ce60b7b-ad86-4efe-8fa1-829a94984a5f',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/2',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c3',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/dfe61eb7-6599-4459-a619-c23f496c1c8e/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/dfe61eb7-6599-4459-a619-c23f496c1c8e',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=3',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/dfe61eb7-6599-4459-a619-c23f496c1c8e',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/dfe61eb7-6599-4459-a619-c23f496c1c8e/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/dfe61eb7-6599-4459-a619-c23f496c1c8e',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c3',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/3',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c4',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/924b514a-f952-4831-a06c-3c2b7633816f/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/924b514a-f952-4831-a06c-3c2b7633816f',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=4',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/924b514a-f952-4831-a06c-3c2b7633816f',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/924b514a-f952-4831-a06c-3c2b7633816f/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/924b514a-f952-4831-a06c-3c2b7633816f',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c4',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/4',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c5',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/117f8248-f758-4590-ad4a-062bb7d1b43d/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/117f8248-f758-4590-ad4a-062bb7d1b43d',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=5',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/117f8248-f758-4590-ad4a-062bb7d1b43d',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/117f8248-f758-4590-ad4a-062bb7d1b43d/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/117f8248-f758-4590-ad4a-062bb7d1b43d',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c5',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/5',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c6',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/e29c70cf-31fe-475a-a703-a0b02dd293f6/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/e29c70cf-31fe-475a-a703-a0b02dd293f6',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=6',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/e29c70cf-31fe-475a-a703-a0b02dd293f6',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/e29c70cf-31fe-475a-a703-a0b02dd293f6/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/e29c70cf-31fe-475a-a703-a0b02dd293f6',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c6',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/6',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c7',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/bcf93016-50bc-40c5-9ca3-7e319c15f9aa/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/bcf93016-50bc-40c5-9ca3-7e319c15f9aa',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=7',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/bcf93016-50bc-40c5-9ca3-7e319c15f9aa',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/bcf93016-50bc-40c5-9ca3-7e319c15f9aa/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/bcf93016-50bc-40c5-9ca3-7e319c15f9aa',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c7',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/7',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c8',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/e9338b94-ab1a-4605-b13e-4c2e27c4a531/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/e9338b94-ab1a-4605-b13e-4c2e27c4a531',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=8',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/e9338b94-ab1a-4605-b13e-4c2e27c4a531',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/e9338b94-ab1a-4605-b13e-4c2e27c4a531/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/e9338b94-ab1a-4605-b13e-4c2e27c4a531',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c8',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/8',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c9',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/7359f32c-5a69-4489-8a6a-8392285af4f5/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/7359f32c-5a69-4489-8a6a-8392285af4f5',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=9',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/7359f32c-5a69-4489-8a6a-8392285af4f5',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/7359f32c-5a69-4489-8a6a-8392285af4f5/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/7359f32c-5a69-4489-8a6a-8392285af4f5',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c9',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/9',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c10',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/4035873f-4655-4c30-8c6a-b24c2689c2c2/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/4035873f-4655-4c30-8c6a-b24c2689c2c2',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=10',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/4035873f-4655-4c30-8c6a-b24c2689c2c2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/4035873f-4655-4c30-8c6a-b24c2689c2c2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/4035873f-4655-4c30-8c6a-b24c2689c2c2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c10',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/10',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c11',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/3de57e53-a6ef-4b29-8a62-180ca9e91c4e/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/3de57e53-a6ef-4b29-8a62-180ca9e91c4e',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=11',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/3de57e53-a6ef-4b29-8a62-180ca9e91c4e',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/3de57e53-a6ef-4b29-8a62-180ca9e91c4e/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/3de57e53-a6ef-4b29-8a62-180ca9e91c4e',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c11',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/11',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c12',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/60ef9ae9-2ace-4c62-9605-89ed66a79873/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/60ef9ae9-2ace-4c62-9605-89ed66a79873',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=12',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/60ef9ae9-2ace-4c62-9605-89ed66a79873',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/60ef9ae9-2ace-4c62-9605-89ed66a79873/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/60ef9ae9-2ace-4c62-9605-89ed66a79873',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c12',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/12',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c13',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/bcb5b69f-2fca-4113-9624-5866e866bd70/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/bcb5b69f-2fca-4113-9624-5866e866bd70',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=13',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/bcb5b69f-2fca-4113-9624-5866e866bd70',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/bcb5b69f-2fca-4113-9624-5866e866bd70/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/bcb5b69f-2fca-4113-9624-5866e866bd70',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c13',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/13',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c14',
          '@type': 'sc:Canvas',
          label: '1',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/2fa60542-f0dc-4a82-b0a2-fbebbe7d9009/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/2fa60542-f0dc-4a82-b0a2-fbebbe7d9009',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=14',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/2fa60542-f0dc-4a82-b0a2-fbebbe7d9009',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/2fa60542-f0dc-4a82-b0a2-fbebbe7d9009/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/2fa60542-f0dc-4a82-b0a2-fbebbe7d9009',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c14',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/14',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c15',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/ef2c375e-a748-4aa1-a4ae-42b74dccb12b/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/ef2c375e-a748-4aa1-a4ae-42b74dccb12b',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=15',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/ef2c375e-a748-4aa1-a4ae-42b74dccb12b',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/ef2c375e-a748-4aa1-a4ae-42b74dccb12b/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/ef2c375e-a748-4aa1-a4ae-42b74dccb12b',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c15',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/15',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c16',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/21c6ab92-b73e-410f-8e30-d6ef265ca40f/full/57,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/21c6ab92-b73e-410f-8e30-d6ef265ca40f',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 586,
              sizes: [
                {
                  width: 57,
                  height: 100,
                },
                {
                  width: 114,
                  height: 200,
                },
                {
                  width: 229,
                  height: 400,
                },
                {
                  width: 586,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=16',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3379,
          width: 1933,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/21c6ab92-b73e-410f-8e30-d6ef265ca40f',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/21c6ab92-b73e-410f-8e30-d6ef265ca40f/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 586,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/21c6ab92-b73e-410f-8e30-d6ef265ca40f',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c16',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/16',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c17',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/eeb8e69c-a669-4d11-a3d8-4bba65b5f718/full/56,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/eeb8e69c-a669-4d11-a3d8-4bba65b5f718',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 578,
              sizes: [
                {
                  width: 56,
                  height: 100,
                },
                {
                  width: 113,
                  height: 200,
                },
                {
                  width: 226,
                  height: 400,
                },
                {
                  width: 578,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=17',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3466,
          width: 1955,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/eeb8e69c-a669-4d11-a3d8-4bba65b5f718',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/eeb8e69c-a669-4d11-a3d8-4bba65b5f718/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 578,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/eeb8e69c-a669-4d11-a3d8-4bba65b5f718',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c17',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/17',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c641',
          '@type': 'sc:Canvas',
          label: '616',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/92ee4eae-9376-4f7d-bcd8-0e86c2bfc858/full/58,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/92ee4eae-9376-4f7d-bcd8-0e86c2bfc858',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 599,
              sizes: [
                {
                  width: 58,
                  height: 100,
                },
                {
                  width: 117,
                  height: 200,
                },
                {
                  width: 234,
                  height: 400,
                },
                {
                  width: 599,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=641',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3466,
          width: 2027,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/92ee4eae-9376-4f7d-bcd8-0e86c2bfc858',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/92ee4eae-9376-4f7d-bcd8-0e86c2bfc858/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 599,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/92ee4eae-9376-4f7d-bcd8-0e86c2bfc858',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c641',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/641',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c642',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/098537d7-0481-4a16-a2c9-190031fe25ac/full/58,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/098537d7-0481-4a16-a2c9-190031fe25ac',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 589,
              sizes: [
                {
                  width: 58,
                  height: 100,
                },
                {
                  width: 115,
                  height: 200,
                },
                {
                  width: 230,
                  height: 400,
                },
                {
                  width: 589,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=642',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3437,
          width: 1977,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/098537d7-0481-4a16-a2c9-190031fe25ac',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/098537d7-0481-4a16-a2c9-190031fe25ac/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 589,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/098537d7-0481-4a16-a2c9-190031fe25ac',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c642',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/642',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c643',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/f8ab1c45-1328-4fc9-8c9d-36b3654de8de/full/58,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/f8ab1c45-1328-4fc9-8c9d-36b3654de8de',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 599,
              sizes: [
                {
                  width: 58,
                  height: 100,
                },
                {
                  width: 117,
                  height: 200,
                },
                {
                  width: 234,
                  height: 400,
                },
                {
                  width: 599,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=643',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3466,
          width: 2027,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/f8ab1c45-1328-4fc9-8c9d-36b3654de8de',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/f8ab1c45-1328-4fc9-8c9d-36b3654de8de/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 599,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/f8ab1c45-1328-4fc9-8c9d-36b3654de8de',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c643',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/643',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c644',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/23ab6d94-c108-4df2-ac87-6bca5014187f/full/58,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/23ab6d94-c108-4df2-ac87-6bca5014187f',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 589,
              sizes: [
                {
                  width: 58,
                  height: 100,
                },
                {
                  width: 115,
                  height: 200,
                },
                {
                  width: 230,
                  height: 400,
                },
                {
                  width: 589,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=644',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3437,
          width: 1977,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/23ab6d94-c108-4df2-ac87-6bca5014187f',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/23ab6d94-c108-4df2-ac87-6bca5014187f/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 589,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/23ab6d94-c108-4df2-ac87-6bca5014187f',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c644',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/644',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b28043534/canvas/c645',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/14920202-eb91-4c63-99fd-b74c38fde35f/full/61,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/14920202-eb91-4c63-99fd-b74c38fde35f',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 621,
              sizes: [
                {
                  width: 61,
                  height: 100,
                },
                {
                  width: 121,
                  height: 200,
                },
                {
                  width: 243,
                  height: 400,
                },
                {
                  width: 621,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b28043534/0?image=645',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 3473,
          width: 2107,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/imageanno/14920202-eb91-4c63-99fd-b74c38fde35f',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/14920202-eb91-4c63-99fd-b74c38fde35f/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 621,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/14920202-eb91-4c63-99fd-b74c38fde35f',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b28043534/canvas/c645',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b28043534/contentAsText/645',
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
      '@id': 'https://wellcomelibrary.org/iiif/b28043534/range/r-0',
      '@type': 'sc:Range',
      label: 'Cover',
      canvases: ['https://wellcomelibrary.org/iiif/b28043534/canvas/c0'],
    },
    {
      '@id': 'https://wellcomelibrary.org/iiif/b28043534/range/r-1',
      '@type': 'sc:Range',
      label: 'Title Page',
      canvases: ['https://wellcomelibrary.org/iiif/b28043534/canvas/c6'],
    },
    {
      '@id': 'https://wellcomelibrary.org/iiif/b28043534/range/r-2',
      '@type': 'sc:Range',
      label: 'Table of Contents',
      canvases: ['https://wellcomelibrary.org/iiif/b28043534/canvas/c10'],
    },
    {
      '@id': 'https://wellcomelibrary.org/iiif/b28043534/range/r-3',
      '@type': 'sc:Range',
      label: 'Cover',
      canvases: ['https://wellcomelibrary.org/iiif/b28043534/canvas/c645'],
    },
  ],
  otherContent: [
    {
      '@id': 'https://wellcomelibrary.org/iiif/b28043534/images',
      '@type': 'sc:AnnotationList',
      label: 'OCR-identified images and figures for b28043534',
    },
    {
      '@id': 'https://wellcomelibrary.org/iiif/b28043534/allcontent',
      '@type': 'sc:AnnotationList',
      label: 'All OCR-derived annotations for b28043534',
    },
  ],
};

export default bookManifest;
