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
              'https://dlcs.io/thumbs/wellcome/1/71fa97b2-04b9-4b05-9a14-328b2505edc8/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/71fa97b2-04b9-4b05-9a14-328b2505edc8',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/71fa97b2-04b9-4b05-9a14-328b2505edc8',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/71fa97b2-04b9-4b05-9a14-328b2505edc8/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/71fa97b2-04b9-4b05-9a14-328b2505edc8',
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
              'https://dlcs.io/thumbs/wellcome/1/3a234408-2a77-42b3-a27a-25eeebd481c3/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/3a234408-2a77-42b3-a27a-25eeebd481c3',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/3a234408-2a77-42b3-a27a-25eeebd481c3',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/3a234408-2a77-42b3-a27a-25eeebd481c3/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 658,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/3a234408-2a77-42b3-a27a-25eeebd481c3',
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
              'https://dlcs.io/thumbs/wellcome/1/0795ab04-7dd6-4f02-81f2-9293d4cf8f63/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/0795ab04-7dd6-4f02-81f2-9293d4cf8f63',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/0795ab04-7dd6-4f02-81f2-9293d4cf8f63',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/0795ab04-7dd6-4f02-81f2-9293d4cf8f63/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 658,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/0795ab04-7dd6-4f02-81f2-9293d4cf8f63',
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
              'https://dlcs.io/thumbs/wellcome/1/58a5b293-9707-4860-abad-683eeaa164ae/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/58a5b293-9707-4860-abad-683eeaa164ae',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/58a5b293-9707-4860-abad-683eeaa164ae',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/58a5b293-9707-4860-abad-683eeaa164ae/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/58a5b293-9707-4860-abad-683eeaa164ae',
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
              'https://dlcs.io/thumbs/wellcome/1/e5067dad-1119-4228-8566-3827701e6c65/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/e5067dad-1119-4228-8566-3827701e6c65',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/e5067dad-1119-4228-8566-3827701e6c65',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/e5067dad-1119-4228-8566-3827701e6c65/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/e5067dad-1119-4228-8566-3827701e6c65',
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
              'https://dlcs.io/thumbs/wellcome/1/61b9d696-4fe1-45bc-9276-c06ebef347f8/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/61b9d696-4fe1-45bc-9276-c06ebef347f8',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/61b9d696-4fe1-45bc-9276-c06ebef347f8',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/61b9d696-4fe1-45bc-9276-c06ebef347f8/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/61b9d696-4fe1-45bc-9276-c06ebef347f8',
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
              'https://dlcs.io/thumbs/wellcome/1/c82d4d1f-58e5-4924-8b90-b7e504d0cf72/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/c82d4d1f-58e5-4924-8b90-b7e504d0cf72',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/c82d4d1f-58e5-4924-8b90-b7e504d0cf72',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/c82d4d1f-58e5-4924-8b90-b7e504d0cf72/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/c82d4d1f-58e5-4924-8b90-b7e504d0cf72',
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
              'https://dlcs.io/thumbs/wellcome/1/7e308856-29b6-40d3-a1a8-2c19a0688e4c/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/7e308856-29b6-40d3-a1a8-2c19a0688e4c',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/7e308856-29b6-40d3-a1a8-2c19a0688e4c',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/7e308856-29b6-40d3-a1a8-2c19a0688e4c/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/7e308856-29b6-40d3-a1a8-2c19a0688e4c',
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
              'https://dlcs.io/thumbs/wellcome/1/8e8a6f5e-235c-4764-af06-ecbc384f6840/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/8e8a6f5e-235c-4764-af06-ecbc384f6840',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/8e8a6f5e-235c-4764-af06-ecbc384f6840',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/8e8a6f5e-235c-4764-af06-ecbc384f6840/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/8e8a6f5e-235c-4764-af06-ecbc384f6840',
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
              'https://dlcs.io/thumbs/wellcome/1/d27737d0-6c60-42f5-b401-2950338c21aa/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/d27737d0-6c60-42f5-b401-2950338c21aa',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/d27737d0-6c60-42f5-b401-2950338c21aa',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/d27737d0-6c60-42f5-b401-2950338c21aa/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/d27737d0-6c60-42f5-b401-2950338c21aa',
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
              'https://dlcs.io/thumbs/wellcome/1/e24e8cbe-2bef-4696-8f38-b1dd03bebfc5/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/e24e8cbe-2bef-4696-8f38-b1dd03bebfc5',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/e24e8cbe-2bef-4696-8f38-b1dd03bebfc5',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/e24e8cbe-2bef-4696-8f38-b1dd03bebfc5/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/e24e8cbe-2bef-4696-8f38-b1dd03bebfc5',
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
              'https://dlcs.io/thumbs/wellcome/1/e4d19c66-b348-4b21-b4da-f6f5817ae8e3/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/e4d19c66-b348-4b21-b4da-f6f5817ae8e3',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/e4d19c66-b348-4b21-b4da-f6f5817ae8e3',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/e4d19c66-b348-4b21-b4da-f6f5817ae8e3/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/e4d19c66-b348-4b21-b4da-f6f5817ae8e3',
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
              'https://dlcs.io/thumbs/wellcome/1/b72e6cdb-e4c9-469d-a558-c35b51279f3c/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/b72e6cdb-e4c9-469d-a558-c35b51279f3c',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b72e6cdb-e4c9-469d-a558-c35b51279f3c',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/b72e6cdb-e4c9-469d-a558-c35b51279f3c/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/b72e6cdb-e4c9-469d-a558-c35b51279f3c',
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
              'https://dlcs.io/thumbs/wellcome/1/bf6644c5-4bae-49e8-b453-fac688876ca5/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/bf6644c5-4bae-49e8-b453-fac688876ca5',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/bf6644c5-4bae-49e8-b453-fac688876ca5',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/bf6644c5-4bae-49e8-b453-fac688876ca5/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/bf6644c5-4bae-49e8-b453-fac688876ca5',
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
              'https://dlcs.io/thumbs/wellcome/1/59fc3f17-e4d3-4bfa-bce1-f992ac4043fa/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/59fc3f17-e4d3-4bfa-bce1-f992ac4043fa',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/59fc3f17-e4d3-4bfa-bce1-f992ac4043fa',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/59fc3f17-e4d3-4bfa-bce1-f992ac4043fa/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/59fc3f17-e4d3-4bfa-bce1-f992ac4043fa',
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
              'https://dlcs.io/thumbs/wellcome/1/eee3cc1e-7d5b-4338-820c-a6c7d0046eb8/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/eee3cc1e-7d5b-4338-820c-a6c7d0046eb8',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/eee3cc1e-7d5b-4338-820c-a6c7d0046eb8',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/eee3cc1e-7d5b-4338-820c-a6c7d0046eb8/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/eee3cc1e-7d5b-4338-820c-a6c7d0046eb8',
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
              'https://dlcs.io/thumbs/wellcome/1/2561bc05-5a8b-46bd-91de-565fbf4360c0/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/2561bc05-5a8b-46bd-91de-565fbf4360c0',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/2561bc05-5a8b-46bd-91de-565fbf4360c0',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/2561bc05-5a8b-46bd-91de-565fbf4360c0/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/2561bc05-5a8b-46bd-91de-565fbf4360c0',
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
              'https://dlcs.io/thumbs/wellcome/1/f4431205-b1e1-48e5-882c-f95681519abb/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/f4431205-b1e1-48e5-882c-f95681519abb',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/f4431205-b1e1-48e5-882c-f95681519abb',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/f4431205-b1e1-48e5-882c-f95681519abb/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/f4431205-b1e1-48e5-882c-f95681519abb',
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
              'https://dlcs.io/thumbs/wellcome/1/71d2e185-85f7-48d8-a67e-26dccb2cf2e4/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/71d2e185-85f7-48d8-a67e-26dccb2cf2e4',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/71d2e185-85f7-48d8-a67e-26dccb2cf2e4',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/71d2e185-85f7-48d8-a67e-26dccb2cf2e4/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/71d2e185-85f7-48d8-a67e-26dccb2cf2e4',
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
              'https://dlcs.io/thumbs/wellcome/1/49ba0ddb-3c99-455e-af8f-3ea859f3e660/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/49ba0ddb-3c99-455e-af8f-3ea859f3e660',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/49ba0ddb-3c99-455e-af8f-3ea859f3e660',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/49ba0ddb-3c99-455e-af8f-3ea859f3e660/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/49ba0ddb-3c99-455e-af8f-3ea859f3e660',
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
              'https://dlcs.io/thumbs/wellcome/1/1dd1fa20-19bf-42a9-a103-53ae81988f7a/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/1dd1fa20-19bf-42a9-a103-53ae81988f7a',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/1dd1fa20-19bf-42a9-a103-53ae81988f7a',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/1dd1fa20-19bf-42a9-a103-53ae81988f7a/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/1dd1fa20-19bf-42a9-a103-53ae81988f7a',
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
              'https://dlcs.io/thumbs/wellcome/1/ea05be86-0018-47da-8015-b478125cbf70/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/ea05be86-0018-47da-8015-b478125cbf70',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/ea05be86-0018-47da-8015-b478125cbf70',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/ea05be86-0018-47da-8015-b478125cbf70/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/ea05be86-0018-47da-8015-b478125cbf70',
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
              'https://dlcs.io/thumbs/wellcome/1/43b5bdce-93c2-45ac-82c6-8e0d57625d05/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/43b5bdce-93c2-45ac-82c6-8e0d57625d05',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/43b5bdce-93c2-45ac-82c6-8e0d57625d05',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/43b5bdce-93c2-45ac-82c6-8e0d57625d05/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/43b5bdce-93c2-45ac-82c6-8e0d57625d05',
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
              'https://dlcs.io/thumbs/wellcome/1/cee483eb-c8dc-4b53-91ee-9548a117864f/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/cee483eb-c8dc-4b53-91ee-9548a117864f',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/cee483eb-c8dc-4b53-91ee-9548a117864f',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/cee483eb-c8dc-4b53-91ee-9548a117864f/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/cee483eb-c8dc-4b53-91ee-9548a117864f',
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
              'https://dlcs.io/thumbs/wellcome/1/df783b8d-9efa-4f89-9992-98143e6a23e5/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/df783b8d-9efa-4f89-9992-98143e6a23e5',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/df783b8d-9efa-4f89-9992-98143e6a23e5',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/df783b8d-9efa-4f89-9992-98143e6a23e5/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/df783b8d-9efa-4f89-9992-98143e6a23e5',
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
              'https://dlcs.io/thumbs/wellcome/1/c71e916e-35e5-48a7-be91-79cc3dd83544/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/c71e916e-35e5-48a7-be91-79cc3dd83544',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/c71e916e-35e5-48a7-be91-79cc3dd83544',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/c71e916e-35e5-48a7-be91-79cc3dd83544/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/c71e916e-35e5-48a7-be91-79cc3dd83544',
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
              'https://dlcs.io/thumbs/wellcome/1/fe43bb63-9125-43b0-9463-cc4fa86d07b6/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/fe43bb63-9125-43b0-9463-cc4fa86d07b6',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/fe43bb63-9125-43b0-9463-cc4fa86d07b6',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/fe43bb63-9125-43b0-9463-cc4fa86d07b6/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/fe43bb63-9125-43b0-9463-cc4fa86d07b6',
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
              'https://dlcs.io/thumbs/wellcome/1/a4d9bedf-7d0f-45a1-8272-7bb394ae1b51/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/a4d9bedf-7d0f-45a1-8272-7bb394ae1b51',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/a4d9bedf-7d0f-45a1-8272-7bb394ae1b51',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/a4d9bedf-7d0f-45a1-8272-7bb394ae1b51/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/a4d9bedf-7d0f-45a1-8272-7bb394ae1b51',
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
              'https://dlcs.io/thumbs/wellcome/1/a183a433-f3fe-4ae6-9594-fdc111b78923/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/a183a433-f3fe-4ae6-9594-fdc111b78923',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/a183a433-f3fe-4ae6-9594-fdc111b78923',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/a183a433-f3fe-4ae6-9594-fdc111b78923/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/a183a433-f3fe-4ae6-9594-fdc111b78923',
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
              'https://dlcs.io/thumbs/wellcome/1/96b8d94f-d4a8-48a4-a980-5674757be6f5/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/96b8d94f-d4a8-48a4-a980-5674757be6f5',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/96b8d94f-d4a8-48a4-a980-5674757be6f5',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/96b8d94f-d4a8-48a4-a980-5674757be6f5/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/96b8d94f-d4a8-48a4-a980-5674757be6f5',
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
              'https://dlcs.io/thumbs/wellcome/1/2eda183a-20fc-4c15-aecf-bac383bee548/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/2eda183a-20fc-4c15-aecf-bac383bee548',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/2eda183a-20fc-4c15-aecf-bac383bee548',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/2eda183a-20fc-4c15-aecf-bac383bee548/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/2eda183a-20fc-4c15-aecf-bac383bee548',
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
              'https://dlcs.io/thumbs/wellcome/1/682a5dea-cb08-4a41-8f00-13b82b0fdb55/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/682a5dea-cb08-4a41-8f00-13b82b0fdb55',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/682a5dea-cb08-4a41-8f00-13b82b0fdb55',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/682a5dea-cb08-4a41-8f00-13b82b0fdb55/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/682a5dea-cb08-4a41-8f00-13b82b0fdb55',
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
              'https://dlcs.io/thumbs/wellcome/1/38519225-7a87-4c29-b2a9-54a14f3f313e/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/38519225-7a87-4c29-b2a9-54a14f3f313e',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/38519225-7a87-4c29-b2a9-54a14f3f313e',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/38519225-7a87-4c29-b2a9-54a14f3f313e/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/38519225-7a87-4c29-b2a9-54a14f3f313e',
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
              'https://dlcs.io/thumbs/wellcome/1/71e423b8-6d1d-49af-890e-9d11170e3c0d/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/71e423b8-6d1d-49af-890e-9d11170e3c0d',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/71e423b8-6d1d-49af-890e-9d11170e3c0d',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/71e423b8-6d1d-49af-890e-9d11170e3c0d/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/71e423b8-6d1d-49af-890e-9d11170e3c0d',
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
              'https://dlcs.io/thumbs/wellcome/1/65064d88-3fc1-4571-bd7d-ec2eac8f2372/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/65064d88-3fc1-4571-bd7d-ec2eac8f2372',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/65064d88-3fc1-4571-bd7d-ec2eac8f2372',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/65064d88-3fc1-4571-bd7d-ec2eac8f2372/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/65064d88-3fc1-4571-bd7d-ec2eac8f2372',
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
              'https://dlcs.io/thumbs/wellcome/1/ff7eedf4-620b-49cf-9f45-5129cba79c21/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/ff7eedf4-620b-49cf-9f45-5129cba79c21',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/ff7eedf4-620b-49cf-9f45-5129cba79c21',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/ff7eedf4-620b-49cf-9f45-5129cba79c21/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/ff7eedf4-620b-49cf-9f45-5129cba79c21',
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
              'https://dlcs.io/thumbs/wellcome/1/b7d51cf2-87b5-4459-b686-6a08ad83ba52/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/b7d51cf2-87b5-4459-b686-6a08ad83ba52',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b7d51cf2-87b5-4459-b686-6a08ad83ba52',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/b7d51cf2-87b5-4459-b686-6a08ad83ba52/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/b7d51cf2-87b5-4459-b686-6a08ad83ba52',
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
              'https://dlcs.io/thumbs/wellcome/1/c569de3f-5ee1-40fd-abb9-b3c063bb7ba5/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/c569de3f-5ee1-40fd-abb9-b3c063bb7ba5',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/c569de3f-5ee1-40fd-abb9-b3c063bb7ba5',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/c569de3f-5ee1-40fd-abb9-b3c063bb7ba5/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/c569de3f-5ee1-40fd-abb9-b3c063bb7ba5',
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
              'https://dlcs.io/thumbs/wellcome/1/f6263c78-7ea4-4264-bdac-0a5b664e18e4/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/f6263c78-7ea4-4264-bdac-0a5b664e18e4',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/f6263c78-7ea4-4264-bdac-0a5b664e18e4',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/f6263c78-7ea4-4264-bdac-0a5b664e18e4/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/f6263c78-7ea4-4264-bdac-0a5b664e18e4',
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
              'https://dlcs.io/thumbs/wellcome/1/1c98f6de-185e-4205-b99f-ea45a0be0e83/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/1c98f6de-185e-4205-b99f-ea45a0be0e83',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/1c98f6de-185e-4205-b99f-ea45a0be0e83',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/1c98f6de-185e-4205-b99f-ea45a0be0e83/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/1c98f6de-185e-4205-b99f-ea45a0be0e83',
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
              'https://dlcs.io/thumbs/wellcome/1/1bbfcdf3-d4e2-4e1a-bbdd-939f93002d86/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/1bbfcdf3-d4e2-4e1a-bbdd-939f93002d86',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/1bbfcdf3-d4e2-4e1a-bbdd-939f93002d86',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/1bbfcdf3-d4e2-4e1a-bbdd-939f93002d86/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/1bbfcdf3-d4e2-4e1a-bbdd-939f93002d86',
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
              'https://dlcs.io/thumbs/wellcome/1/8a4feaf2-0503-430d-bcdf-74311c309dfe/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/8a4feaf2-0503-430d-bcdf-74311c309dfe',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/8a4feaf2-0503-430d-bcdf-74311c309dfe',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/8a4feaf2-0503-430d-bcdf-74311c309dfe/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/8a4feaf2-0503-430d-bcdf-74311c309dfe',
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
              'https://dlcs.io/thumbs/wellcome/1/b3f80c97-8681-4a6e-9d9b-2235dbf6a22e/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/b3f80c97-8681-4a6e-9d9b-2235dbf6a22e',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b3f80c97-8681-4a6e-9d9b-2235dbf6a22e',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/b3f80c97-8681-4a6e-9d9b-2235dbf6a22e/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/b3f80c97-8681-4a6e-9d9b-2235dbf6a22e',
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
              'https://dlcs.io/thumbs/wellcome/1/8f5cbf6b-a5a8-4230-87c0-ce33f7790a09/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/8f5cbf6b-a5a8-4230-87c0-ce33f7790a09',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/8f5cbf6b-a5a8-4230-87c0-ce33f7790a09',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/8f5cbf6b-a5a8-4230-87c0-ce33f7790a09/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/8f5cbf6b-a5a8-4230-87c0-ce33f7790a09',
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
              'https://dlcs.io/thumbs/wellcome/1/ee867732-a810-4ecc-a359-31f161a83a44/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/ee867732-a810-4ecc-a359-31f161a83a44',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/ee867732-a810-4ecc-a359-31f161a83a44',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/ee867732-a810-4ecc-a359-31f161a83a44/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/ee867732-a810-4ecc-a359-31f161a83a44',
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
              'https://dlcs.io/thumbs/wellcome/1/be9eeaff-55fd-4b47-ad44-9c5dd12bf536/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/be9eeaff-55fd-4b47-ad44-9c5dd12bf536',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/be9eeaff-55fd-4b47-ad44-9c5dd12bf536',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/be9eeaff-55fd-4b47-ad44-9c5dd12bf536/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/be9eeaff-55fd-4b47-ad44-9c5dd12bf536',
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
              'https://dlcs.io/thumbs/wellcome/1/2b03d96e-3b4f-4783-8db6-1c3926cef619/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/2b03d96e-3b4f-4783-8db6-1c3926cef619',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/2b03d96e-3b4f-4783-8db6-1c3926cef619',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/2b03d96e-3b4f-4783-8db6-1c3926cef619/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/2b03d96e-3b4f-4783-8db6-1c3926cef619',
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
              'https://dlcs.io/thumbs/wellcome/1/47709d62-978f-4daf-98b8-bdacc96582ee/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/47709d62-978f-4daf-98b8-bdacc96582ee',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/47709d62-978f-4daf-98b8-bdacc96582ee',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/47709d62-978f-4daf-98b8-bdacc96582ee/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/47709d62-978f-4daf-98b8-bdacc96582ee',
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
              'https://dlcs.io/thumbs/wellcome/1/797311e9-5f30-449e-8102-8cf9cc361dbd/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/797311e9-5f30-449e-8102-8cf9cc361dbd',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/797311e9-5f30-449e-8102-8cf9cc361dbd',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/797311e9-5f30-449e-8102-8cf9cc361dbd/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/797311e9-5f30-449e-8102-8cf9cc361dbd',
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
              'https://dlcs.io/thumbs/wellcome/1/d8d63f46-59f7-49c8-bab2-0fc58c668b66/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/d8d63f46-59f7-49c8-bab2-0fc58c668b66',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/d8d63f46-59f7-49c8-bab2-0fc58c668b66',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/d8d63f46-59f7-49c8-bab2-0fc58c668b66/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/d8d63f46-59f7-49c8-bab2-0fc58c668b66',
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
              'https://dlcs.io/thumbs/wellcome/1/b9660baf-4b2e-45be-af9f-fdb58fcce85f/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/b9660baf-4b2e-45be-af9f-fdb58fcce85f',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b9660baf-4b2e-45be-af9f-fdb58fcce85f',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/b9660baf-4b2e-45be-af9f-fdb58fcce85f/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/b9660baf-4b2e-45be-af9f-fdb58fcce85f',
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
              'https://dlcs.io/thumbs/wellcome/1/37e77f1b-3c00-4dcd-97bf-bceffaddea26/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/37e77f1b-3c00-4dcd-97bf-bceffaddea26',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/37e77f1b-3c00-4dcd-97bf-bceffaddea26',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/37e77f1b-3c00-4dcd-97bf-bceffaddea26/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/37e77f1b-3c00-4dcd-97bf-bceffaddea26',
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
              'https://dlcs.io/thumbs/wellcome/1/513c473d-5d30-4674-9515-7e64e02dd5f4/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/513c473d-5d30-4674-9515-7e64e02dd5f4',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/513c473d-5d30-4674-9515-7e64e02dd5f4',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/513c473d-5d30-4674-9515-7e64e02dd5f4/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/513c473d-5d30-4674-9515-7e64e02dd5f4',
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
              'https://dlcs.io/thumbs/wellcome/1/30c3f81c-26e9-4c1b-8692-706e7703889a/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/30c3f81c-26e9-4c1b-8692-706e7703889a',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/30c3f81c-26e9-4c1b-8692-706e7703889a',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/30c3f81c-26e9-4c1b-8692-706e7703889a/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/30c3f81c-26e9-4c1b-8692-706e7703889a',
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
              'https://dlcs.io/thumbs/wellcome/1/258d8594-ee2a-41e6-984e-f8225310dc86/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/258d8594-ee2a-41e6-984e-f8225310dc86',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/258d8594-ee2a-41e6-984e-f8225310dc86',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/258d8594-ee2a-41e6-984e-f8225310dc86/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/258d8594-ee2a-41e6-984e-f8225310dc86',
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
              'https://dlcs.io/thumbs/wellcome/1/582bfa2f-d6f7-483e-84ec-8a3346185e79/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/582bfa2f-d6f7-483e-84ec-8a3346185e79',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/582bfa2f-d6f7-483e-84ec-8a3346185e79',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/582bfa2f-d6f7-483e-84ec-8a3346185e79/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/582bfa2f-d6f7-483e-84ec-8a3346185e79',
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
              'https://dlcs.io/thumbs/wellcome/1/85667776-2260-44a1-8c62-7278dcf1b797/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/85667776-2260-44a1-8c62-7278dcf1b797',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/85667776-2260-44a1-8c62-7278dcf1b797',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/85667776-2260-44a1-8c62-7278dcf1b797/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/85667776-2260-44a1-8c62-7278dcf1b797',
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
              'https://dlcs.io/thumbs/wellcome/1/6419efc7-9730-40f1-873e-4ef9db077260/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/6419efc7-9730-40f1-873e-4ef9db077260',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/6419efc7-9730-40f1-873e-4ef9db077260',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/6419efc7-9730-40f1-873e-4ef9db077260/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/6419efc7-9730-40f1-873e-4ef9db077260',
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
              'https://dlcs.io/thumbs/wellcome/1/0baf231d-01ed-4792-be9e-838e37452d3d/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/0baf231d-01ed-4792-be9e-838e37452d3d',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/0baf231d-01ed-4792-be9e-838e37452d3d',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/0baf231d-01ed-4792-be9e-838e37452d3d/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/0baf231d-01ed-4792-be9e-838e37452d3d',
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
              'https://dlcs.io/thumbs/wellcome/1/39094237-64a4-4c8e-acf9-d1677ca9eabd/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/39094237-64a4-4c8e-acf9-d1677ca9eabd',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/39094237-64a4-4c8e-acf9-d1677ca9eabd',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/39094237-64a4-4c8e-acf9-d1677ca9eabd/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/39094237-64a4-4c8e-acf9-d1677ca9eabd',
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
              'https://dlcs.io/thumbs/wellcome/1/889bfc7e-f9d9-49b3-9146-ef44ea227153/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/889bfc7e-f9d9-49b3-9146-ef44ea227153',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/889bfc7e-f9d9-49b3-9146-ef44ea227153',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/889bfc7e-f9d9-49b3-9146-ef44ea227153/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/889bfc7e-f9d9-49b3-9146-ef44ea227153',
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
              'https://dlcs.io/thumbs/wellcome/1/27d2f74f-5972-4edc-a352-43dff1c9d6ff/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/27d2f74f-5972-4edc-a352-43dff1c9d6ff',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/27d2f74f-5972-4edc-a352-43dff1c9d6ff',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/27d2f74f-5972-4edc-a352-43dff1c9d6ff/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/27d2f74f-5972-4edc-a352-43dff1c9d6ff',
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
              'https://dlcs.io/thumbs/wellcome/1/5a94cd4b-5b47-413b-8e4f-5e83c29915dc/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/5a94cd4b-5b47-413b-8e4f-5e83c29915dc',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/5a94cd4b-5b47-413b-8e4f-5e83c29915dc',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/5a94cd4b-5b47-413b-8e4f-5e83c29915dc/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/5a94cd4b-5b47-413b-8e4f-5e83c29915dc',
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
              'https://dlcs.io/thumbs/wellcome/1/72984c51-877a-4901-be62-348a25f16272/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/72984c51-877a-4901-be62-348a25f16272',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/72984c51-877a-4901-be62-348a25f16272',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/72984c51-877a-4901-be62-348a25f16272/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/72984c51-877a-4901-be62-348a25f16272',
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
              'https://dlcs.io/thumbs/wellcome/1/a2213f32-0f1e-4241-b87d-69cb7bdb19b2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/a2213f32-0f1e-4241-b87d-69cb7bdb19b2',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/a2213f32-0f1e-4241-b87d-69cb7bdb19b2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/a2213f32-0f1e-4241-b87d-69cb7bdb19b2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/a2213f32-0f1e-4241-b87d-69cb7bdb19b2',
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
              'https://dlcs.io/thumbs/wellcome/1/98a1943a-575b-465b-93a4-246a6c54f1c9/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/98a1943a-575b-465b-93a4-246a6c54f1c9',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/98a1943a-575b-465b-93a4-246a6c54f1c9',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/98a1943a-575b-465b-93a4-246a6c54f1c9/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/98a1943a-575b-465b-93a4-246a6c54f1c9',
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
              'https://dlcs.io/thumbs/wellcome/1/b68290d8-64f1-4c32-a71d-a4cd228916b9/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/b68290d8-64f1-4c32-a71d-a4cd228916b9',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b68290d8-64f1-4c32-a71d-a4cd228916b9',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/b68290d8-64f1-4c32-a71d-a4cd228916b9/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/b68290d8-64f1-4c32-a71d-a4cd228916b9',
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
              'https://dlcs.io/thumbs/wellcome/1/a4168ab1-4ba9-416e-860d-7f5a13051897/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/a4168ab1-4ba9-416e-860d-7f5a13051897',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/a4168ab1-4ba9-416e-860d-7f5a13051897',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/a4168ab1-4ba9-416e-860d-7f5a13051897/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/a4168ab1-4ba9-416e-860d-7f5a13051897',
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
              'https://dlcs.io/thumbs/wellcome/1/c9e79f1f-5be5-479b-b9a6-c2ee0443a639/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/c9e79f1f-5be5-479b-b9a6-c2ee0443a639',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/c9e79f1f-5be5-479b-b9a6-c2ee0443a639',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/c9e79f1f-5be5-479b-b9a6-c2ee0443a639/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/c9e79f1f-5be5-479b-b9a6-c2ee0443a639',
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
              'https://dlcs.io/thumbs/wellcome/1/ef01a70b-7443-4828-bdd0-f5c492c9ec13/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/ef01a70b-7443-4828-bdd0-f5c492c9ec13',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/ef01a70b-7443-4828-bdd0-f5c492c9ec13',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/ef01a70b-7443-4828-bdd0-f5c492c9ec13/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/ef01a70b-7443-4828-bdd0-f5c492c9ec13',
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
              'https://dlcs.io/thumbs/wellcome/1/6d55014a-7475-44ad-92ee-cbb3589d9f11/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/6d55014a-7475-44ad-92ee-cbb3589d9f11',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/6d55014a-7475-44ad-92ee-cbb3589d9f11',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/6d55014a-7475-44ad-92ee-cbb3589d9f11/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/6d55014a-7475-44ad-92ee-cbb3589d9f11',
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
              'https://dlcs.io/thumbs/wellcome/1/7b39b75f-f493-4dde-9c25-38a81fb0ff16/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/7b39b75f-f493-4dde-9c25-38a81fb0ff16',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/7b39b75f-f493-4dde-9c25-38a81fb0ff16',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/7b39b75f-f493-4dde-9c25-38a81fb0ff16/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/7b39b75f-f493-4dde-9c25-38a81fb0ff16',
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
              'https://dlcs.io/thumbs/wellcome/1/4781d5e2-8432-4e47-87b3-7b8175c394e0/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/4781d5e2-8432-4e47-87b3-7b8175c394e0',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/4781d5e2-8432-4e47-87b3-7b8175c394e0',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/4781d5e2-8432-4e47-87b3-7b8175c394e0/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/4781d5e2-8432-4e47-87b3-7b8175c394e0',
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
              'https://dlcs.io/thumbs/wellcome/1/62188860-3ef5-4797-ad8d-18a4de46a9b2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/62188860-3ef5-4797-ad8d-18a4de46a9b2',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/62188860-3ef5-4797-ad8d-18a4de46a9b2',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/62188860-3ef5-4797-ad8d-18a4de46a9b2/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/62188860-3ef5-4797-ad8d-18a4de46a9b2',
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
              'https://dlcs.io/thumbs/wellcome/1/22406dc3-f973-47b6-bcdc-b5dd06edcf74/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/22406dc3-f973-47b6-bcdc-b5dd06edcf74',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/22406dc3-f973-47b6-bcdc-b5dd06edcf74',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/22406dc3-f973-47b6-bcdc-b5dd06edcf74/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/22406dc3-f973-47b6-bcdc-b5dd06edcf74',
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
              'https://dlcs.io/thumbs/wellcome/1/073e8b71-020f-4312-9a49-4c26f99ad461/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/073e8b71-020f-4312-9a49-4c26f99ad461',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/073e8b71-020f-4312-9a49-4c26f99ad461',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/073e8b71-020f-4312-9a49-4c26f99ad461/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/073e8b71-020f-4312-9a49-4c26f99ad461',
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
              'https://dlcs.io/thumbs/wellcome/1/08a99b46-a91b-4cb3-a814-61920c7acce1/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/08a99b46-a91b-4cb3-a814-61920c7acce1',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/08a99b46-a91b-4cb3-a814-61920c7acce1',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/08a99b46-a91b-4cb3-a814-61920c7acce1/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/08a99b46-a91b-4cb3-a814-61920c7acce1',
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
              'https://dlcs.io/thumbs/wellcome/1/b9e7d491-7bef-4108-bf19-31a897363552/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/b9e7d491-7bef-4108-bf19-31a897363552',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/b9e7d491-7bef-4108-bf19-31a897363552',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/b9e7d491-7bef-4108-bf19-31a897363552/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/b9e7d491-7bef-4108-bf19-31a897363552',
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
              'https://dlcs.io/thumbs/wellcome/1/3672c58b-75c5-4d0f-a2ed-becebcb361c1/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/3672c58b-75c5-4d0f-a2ed-becebcb361c1',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/3672c58b-75c5-4d0f-a2ed-becebcb361c1',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/3672c58b-75c5-4d0f-a2ed-becebcb361c1/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/3672c58b-75c5-4d0f-a2ed-becebcb361c1',
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
              'https://dlcs.io/thumbs/wellcome/1/7a8d1adc-dc09-4e8f-a514-649838e442b7/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/7a8d1adc-dc09-4e8f-a514-649838e442b7',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/7a8d1adc-dc09-4e8f-a514-649838e442b7',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/7a8d1adc-dc09-4e8f-a514-649838e442b7/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/7a8d1adc-dc09-4e8f-a514-649838e442b7',
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
              'https://dlcs.io/thumbs/wellcome/1/8007537f-55e3-437b-a403-d0980818f211/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/8007537f-55e3-437b-a403-d0980818f211',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/8007537f-55e3-437b-a403-d0980818f211',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/8007537f-55e3-437b-a403-d0980818f211/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/8007537f-55e3-437b-a403-d0980818f211',
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
              'https://dlcs.io/thumbs/wellcome/1/d9ad8bd5-30ec-4fe2-b8d7-fa3b4ed5f76d/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/d9ad8bd5-30ec-4fe2-b8d7-fa3b4ed5f76d',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/d9ad8bd5-30ec-4fe2-b8d7-fa3b4ed5f76d',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/d9ad8bd5-30ec-4fe2-b8d7-fa3b4ed5f76d/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/d9ad8bd5-30ec-4fe2-b8d7-fa3b4ed5f76d',
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
              'https://dlcs.io/thumbs/wellcome/1/cbe7f36d-057f-486c-9aac-6cd9b88924f5/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/cbe7f36d-057f-486c-9aac-6cd9b88924f5',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/cbe7f36d-057f-486c-9aac-6cd9b88924f5',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/cbe7f36d-057f-486c-9aac-6cd9b88924f5/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/cbe7f36d-057f-486c-9aac-6cd9b88924f5',
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
              'https://dlcs.io/thumbs/wellcome/1/1dc23bb0-254b-460e-8db8-4257b445fe61/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/1dc23bb0-254b-460e-8db8-4257b445fe61',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/1dc23bb0-254b-460e-8db8-4257b445fe61',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/1dc23bb0-254b-460e-8db8-4257b445fe61/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/1dc23bb0-254b-460e-8db8-4257b445fe61',
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
              'https://dlcs.io/thumbs/wellcome/1/21851eda-3dc8-4d44-8ef6-250cf7759606/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/21851eda-3dc8-4d44-8ef6-250cf7759606',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/21851eda-3dc8-4d44-8ef6-250cf7759606',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/21851eda-3dc8-4d44-8ef6-250cf7759606/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/21851eda-3dc8-4d44-8ef6-250cf7759606',
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
              'https://dlcs.io/thumbs/wellcome/1/4ab04f14-0f4f-4c86-aa5f-0996d67bea11/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/4ab04f14-0f4f-4c86-aa5f-0996d67bea11',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/4ab04f14-0f4f-4c86-aa5f-0996d67bea11',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/4ab04f14-0f4f-4c86-aa5f-0996d67bea11/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/4ab04f14-0f4f-4c86-aa5f-0996d67bea11',
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
              'https://dlcs.io/thumbs/wellcome/1/63e408a6-b352-4f4f-8ffa-0ec51fe4b520/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/63e408a6-b352-4f4f-8ffa-0ec51fe4b520',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/63e408a6-b352-4f4f-8ffa-0ec51fe4b520',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/63e408a6-b352-4f4f-8ffa-0ec51fe4b520/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/63e408a6-b352-4f4f-8ffa-0ec51fe4b520',
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
              'https://dlcs.io/thumbs/wellcome/1/f0ce5974-9928-4e14-8912-0eea84682e19/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/f0ce5974-9928-4e14-8912-0eea84682e19',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/f0ce5974-9928-4e14-8912-0eea84682e19',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/f0ce5974-9928-4e14-8912-0eea84682e19/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/f0ce5974-9928-4e14-8912-0eea84682e19',
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
              'https://dlcs.io/thumbs/wellcome/1/43b3366c-294e-4fe3-a31c-ac07af5c2f90/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/43b3366c-294e-4fe3-a31c-ac07af5c2f90',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/43b3366c-294e-4fe3-a31c-ac07af5c2f90',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/43b3366c-294e-4fe3-a31c-ac07af5c2f90/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/43b3366c-294e-4fe3-a31c-ac07af5c2f90',
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
              'https://dlcs.io/thumbs/wellcome/1/2e3ad6e9-1be7-4bee-92e1-9e25dd344d19/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/2e3ad6e9-1be7-4bee-92e1-9e25dd344d19',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/2e3ad6e9-1be7-4bee-92e1-9e25dd344d19',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/2e3ad6e9-1be7-4bee-92e1-9e25dd344d19/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/2e3ad6e9-1be7-4bee-92e1-9e25dd344d19',
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
              'https://dlcs.io/thumbs/wellcome/1/72222ea7-b186-45ac-b83b-19b31ca871ba/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/72222ea7-b186-45ac-b83b-19b31ca871ba',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/72222ea7-b186-45ac-b83b-19b31ca871ba',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/72222ea7-b186-45ac-b83b-19b31ca871ba/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/72222ea7-b186-45ac-b83b-19b31ca871ba',
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
              'https://dlcs.io/thumbs/wellcome/1/4d07f353-00d8-4f37-a2e8-3a8990c45b1f/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/4d07f353-00d8-4f37-a2e8-3a8990c45b1f',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/4d07f353-00d8-4f37-a2e8-3a8990c45b1f',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/4d07f353-00d8-4f37-a2e8-3a8990c45b1f/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/4d07f353-00d8-4f37-a2e8-3a8990c45b1f',
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
              'https://dlcs.io/thumbs/wellcome/1/98e1a83f-5ba2-47a8-a6f8-d22db8541ed0/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/98e1a83f-5ba2-47a8-a6f8-d22db8541ed0',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/98e1a83f-5ba2-47a8-a6f8-d22db8541ed0',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/98e1a83f-5ba2-47a8-a6f8-d22db8541ed0/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/98e1a83f-5ba2-47a8-a6f8-d22db8541ed0',
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
              'https://dlcs.io/thumbs/wellcome/1/2bb7b032-0a0c-4678-9ec0-25b21bbc3965/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/2bb7b032-0a0c-4678-9ec0-25b21bbc3965',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/2bb7b032-0a0c-4678-9ec0-25b21bbc3965',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/2bb7b032-0a0c-4678-9ec0-25b21bbc3965/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/2bb7b032-0a0c-4678-9ec0-25b21bbc3965',
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
              'https://dlcs.io/thumbs/wellcome/1/7d698c24-6e76-4865-ba26-f8ba1d51ca4a/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/7d698c24-6e76-4865-ba26-f8ba1d51ca4a',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/7d698c24-6e76-4865-ba26-f8ba1d51ca4a',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/7d698c24-6e76-4865-ba26-f8ba1d51ca4a/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/7d698c24-6e76-4865-ba26-f8ba1d51ca4a',
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
              'https://dlcs.io/thumbs/wellcome/1/feff4e30-15e7-4cec-b74f-c86c79642535/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/feff4e30-15e7-4cec-b74f-c86c79642535',
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
                'https://wellcomelibrary.org/iiif/b21538906/imageanno/feff4e30-15e7-4cec-b74f-c86c79642535',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/feff4e30-15e7-4cec-b74f-c86c79642535/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 646,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/feff4e30-15e7-4cec-b74f-c86c79642535',
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
