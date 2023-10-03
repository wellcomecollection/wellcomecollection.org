const manifest = {
  '@context': 'http://iiif.io/api/presentation/2/context.json',
  '@id': 'https://iiif.wellcomecollection.org/presentation/v2/b21538906',
  '@type': 'sc:Manifest',
  label:
    'Egg cookery : how to cook eggs in 150 ways, English and foreign / by Mrs. Hugh Coleman Davidson.',
  metadata: [
    {
      label: 'Publication/creation',
      value: '[London] : L. Upcott Gill, 1899.',
    },
    {
      label: 'Physical description',
      value: '86 pages ; 19 cm',
    },
    {
      label: 'Contributors',
      value: 'Davidson, J. E.; University of Leeds. Library',
    },
    {
      label: 'Type/technique',
      value: 'Electronic books',
    },
    {
      label: 'Attribution',
      value: 'Leeds University Archive',
    },
    {
      label: 'Full conditions of use',
      value:
        "&lt;span&gt;This work has been identified as being free of known restrictions under copyright law, including all related and neighbouring rights and is being made available under the &lt;a target='_top' href='http://creativecommons.org/publicdomain/mark/1.0/';&gt;Creative Commons, Public Domain Mark&lt;/a&gt;.&lt;br/&gt;&lt;br/&gt;You can copy, modify, distribute and perform the work, even for commercial purposes, without asking permission.&lt;/span&gt;",
    },
    {
      label: 'Repository',
      value:
        '&lt;img src="https://iiif.wellcomecollection.org/partners/leeds-logo.jpg&apos; alt="Leeds University Archive"" /&gt;&lt;br/&gt;&lt;br/&gt;This material has been provided by This material has been provided by The University of Leeds Library. The original may be consulted at The University of Leeds Library. where the originals may be consulted.',
    },
  ],
  thumbnail: {
    '@id':
      'https://iiif.wellcomecollection.org/thumbs/b21538906_0007.jp2/full/63,100/0/default.jpg',
    '@type': 'dctypes:Image',
    service: {
      '@context': 'http://iiif.io/api/image/2/context.json',
      '@id': 'https://iiif.wellcomecollection.org/thumbs/b21538906_0007.jp2',
      profile: 'http://iiif.io/api/image/2/level0.json',
      protocol: 'http://iiif.io/api/image',
      width: 649,
      height: 1024,
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
    },
  },
  license: 'http://creativecommons.org/publicdomain/mark/1.0/',
  logo: 'https://iiif.wellcomecollection.org/logos/wellcome-collection-black.png',
  related: {
    '@id': 'https://wellcomecollection.org/works/pxv98cnk',
    format: 'text/html',
    label:
      'Egg cookery : how to cook eggs in 150 ways, English and foreign / by Mrs. Hugh Coleman Davidson.',
  },
  seeAlso: {
    '@id': 'https://api.wellcomecollection.org/catalogue/v2/works/pxv98cnk',
    profile: 'https://api.wellcomecollection.org/catalogue/v2/context.json',
    format: 'application/json',
    label: 'Wellcome Collection Catalogue API',
  },
  service: [
    {
      '@context': 'http://iiif.io/api/search/0/context.json',
      '@id': 'https://iiif.wellcomecollection.org/search/v0/b21538906',
      profile: 'http://iiif.io/api/search/0/search',
      label: 'Search within this manifest',
      service: {
        '@id':
          'https://iiif.wellcomecollection.org/search/autocomplete/v1/b21538906',
        profile: 'http://iiif.io/api/search/0/autocomplete',
        label: 'Autocomplete words in this manifest',
      },
    },
    {
      '@context': 'http://universalviewer.io/context.json',
      '@id': 'http://wellcomelibrary.org/service/trackingLabels/b21538906',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      trackingLabel:
        'Format: Monograph, Institution: Leeds University Archive, Identifier: b21538906, Digicode: digleeds, Collection code: n/a',
    },
    {
      '@context': 'http://wellcomelibrary.org/ld/iiif-ext/0/context.json',
      '@id':
        'https://wellcomelibrary.org/iiif/b21538906/access-control-hints-service',
      profile: 'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
      accessHint: 'open',
    },
  ],
  sequences: [
    {
      '@id':
        'https://iiif.wellcomecollection.org/presentation/v2/b21538906/sequences/s0',
      '@type': 'sc:Sequence',
      label: 'Sequence s0',
      rendering: [
        {
          '@id': 'https://iiif.wellcomecollection.org/pdf/b21538906',
          label: 'View as PDF',
          format: 'application/pdf',
        },
        {
          '@id': 'https://api.wellcomecollection.org/text/v1/b21538906',
          label: 'View raw text',
          format: 'text/plain',
        },
      ],
      viewingHint: 'paged',
      compatibilityHint: '',
      canvases: [
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0001.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0001.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0001.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0001.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3506,
          width: 2244,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0001.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0001.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0001.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2244,
                  height: 3506,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0001.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0001.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0002.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0002.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0002.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 658,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0002.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3441,
          width: 2212,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0002.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0002.jp2/full/658,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 658,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0002.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2212,
                  height: 3441,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0002.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0002.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0003.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0003.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0003.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 658,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0003.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3441,
          width: 2212,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0003.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0003.jp2/full/658,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 658,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0003.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2212,
                  height: 3441,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0003.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0003.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0004.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0004.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0004.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0004.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0004.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0004.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0004.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0004.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0004.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0005.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0005.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0005.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0005.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0005.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0005.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0005.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0005.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0005.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0006.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0006.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0006.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0006.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0006.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0006.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0006.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0006.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0006.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0007.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0007.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0007.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0007.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0007.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0007.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0007.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0007.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0007.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0008.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0008.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0008.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0008.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0008.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0008.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0008.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0008.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0008.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0009.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0009.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0009.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0009.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0009.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0009.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0009.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0009.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0009.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0010.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0010.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0010.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0010.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0010.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0010.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0010.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0010.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0010.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0011.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0011.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0011.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0011.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0011.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0011.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0011.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0011.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0011.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0012.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0012.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0012.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0012.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0012.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0012.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0012.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0012.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0012.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0013.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0013.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0013.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0013.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0013.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0013.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0013.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0013.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0013.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0014.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0014.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0014.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0014.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0014.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0014.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0014.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0014.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0014.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0015.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0015.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0015.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0015.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0015.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0015.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0015.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0015.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0015.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0016.jp2',
          '@type': 'sc:Canvas',
          label: '12',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0016.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0016.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0016.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0016.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0016.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0016.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0016.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0016.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 12',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0017.jp2',
          '@type': 'sc:Canvas',
          label: '13',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0017.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0017.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0017.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0017.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0017.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0017.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0017.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0017.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 13',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0018.jp2',
          '@type': 'sc:Canvas',
          label: '14',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0018.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0018.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0018.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0018.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0018.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0018.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0018.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0018.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 14',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0019.jp2',
          '@type': 'sc:Canvas',
          label: '15',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0019.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0019.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0019.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0019.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0019.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0019.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0019.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0019.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 15',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0020.jp2',
          '@type': 'sc:Canvas',
          label: '16',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0020.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0020.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0020.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0020.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0020.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0020.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0020.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0020.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 16',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0021.jp2',
          '@type': 'sc:Canvas',
          label: '17',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0021.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0021.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 649,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0021.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3355,
          width: 2126,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0021.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0021.jp2/full/649,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 649,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0021.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2126,
                  height: 3355,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0021.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0021.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 17',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0022.jp2',
          '@type': 'sc:Canvas',
          label: '18',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0022.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0022.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0022.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0022.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0022.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0022.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0022.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0022.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 18',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0023.jp2',
          '@type': 'sc:Canvas',
          label: '19',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0023.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0023.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0023.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0023.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0023.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0023.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0023.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0023.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 19',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0024.jp2',
          '@type': 'sc:Canvas',
          label: '20',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0024.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0024.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0024.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0024.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0024.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0024.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0024.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0024.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 20',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0025.jp2',
          '@type': 'sc:Canvas',
          label: '21',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0025.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0025.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0025.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0025.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0025.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0025.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0025.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0025.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 21',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0026.jp2',
          '@type': 'sc:Canvas',
          label: '22',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0026.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0026.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0026.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0026.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0026.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0026.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0026.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0026.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 22',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0027.jp2',
          '@type': 'sc:Canvas',
          label: '23',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0027.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0027.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0027.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0027.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0027.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0027.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0027.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0027.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 23',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0028.jp2',
          '@type': 'sc:Canvas',
          label: '24',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0028.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0028.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0028.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0028.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0028.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0028.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0028.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0028.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 24',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0029.jp2',
          '@type': 'sc:Canvas',
          label: '25',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0029.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0029.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0029.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0029.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0029.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0029.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0029.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0029.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 25',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0030.jp2',
          '@type': 'sc:Canvas',
          label: '26',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0030.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0030.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0030.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0030.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0030.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0030.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0030.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0030.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 26',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0031.jp2',
          '@type': 'sc:Canvas',
          label: '27',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0031.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0031.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0031.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0031.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0031.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0031.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0031.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0031.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 27',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0032.jp2',
          '@type': 'sc:Canvas',
          label: '28',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0032.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0032.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0032.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0032.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0032.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0032.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0032.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0032.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 28',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0033.jp2',
          '@type': 'sc:Canvas',
          label: '29',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0033.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0033.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0033.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0033.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0033.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0033.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0033.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0033.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 29',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0034.jp2',
          '@type': 'sc:Canvas',
          label: '30',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0034.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0034.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0034.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0034.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0034.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0034.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0034.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0034.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 30',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0035.jp2',
          '@type': 'sc:Canvas',
          label: '31',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0035.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0035.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0035.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0035.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0035.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0035.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0035.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0035.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 31',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0036.jp2',
          '@type': 'sc:Canvas',
          label: '32',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0036.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0036.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0036.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0036.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0036.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0036.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0036.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0036.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 32',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0037.jp2',
          '@type': 'sc:Canvas',
          label: '33',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0037.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0037.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0037.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0037.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0037.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0037.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0037.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0037.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 33',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0038.jp2',
          '@type': 'sc:Canvas',
          label: '34',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0038.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0038.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0038.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0038.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0038.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0038.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0038.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0038.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 34',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0039.jp2',
          '@type': 'sc:Canvas',
          label: '35',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0039.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0039.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0039.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0039.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0039.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0039.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0039.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0039.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 35',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0040.jp2',
          '@type': 'sc:Canvas',
          label: '36',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0040.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0040.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0040.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0040.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0040.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0040.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0040.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0040.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 36',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0041.jp2',
          '@type': 'sc:Canvas',
          label: '37',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0041.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0041.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0041.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0041.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0041.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0041.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0041.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0041.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 37',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0042.jp2',
          '@type': 'sc:Canvas',
          label: '38',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0042.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0042.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0042.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0042.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0042.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0042.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0042.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0042.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 38',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0043.jp2',
          '@type': 'sc:Canvas',
          label: '39',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0043.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0043.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0043.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0043.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0043.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0043.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0043.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0043.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 39',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0044.jp2',
          '@type': 'sc:Canvas',
          label: '40',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0044.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0044.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0044.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0044.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0044.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0044.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0044.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0044.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 40',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0045.jp2',
          '@type': 'sc:Canvas',
          label: '41',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0045.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0045.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0045.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0045.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0045.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0045.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0045.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0045.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 41',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0046.jp2',
          '@type': 'sc:Canvas',
          label: '42',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0046.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0046.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0046.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0046.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0046.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0046.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0046.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0046.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 42',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0047.jp2',
          '@type': 'sc:Canvas',
          label: '43',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0047.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0047.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0047.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0047.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0047.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0047.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0047.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0047.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 43',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0048.jp2',
          '@type': 'sc:Canvas',
          label: '44',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0048.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0048.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0048.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0048.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0048.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0048.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0048.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0048.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 44',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0049.jp2',
          '@type': 'sc:Canvas',
          label: '45',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0049.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0049.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0049.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0049.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0049.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0049.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0049.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0049.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 45',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0050.jp2',
          '@type': 'sc:Canvas',
          label: '46',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0050.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0050.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0050.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0050.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0050.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0050.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0050.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0050.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 46',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0051.jp2',
          '@type': 'sc:Canvas',
          label: '47',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0051.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0051.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0051.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0051.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0051.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0051.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0051.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0051.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 47',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0052.jp2',
          '@type': 'sc:Canvas',
          label: '48',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0052.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0052.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0052.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0052.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0052.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0052.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0052.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0052.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 48',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0053.jp2',
          '@type': 'sc:Canvas',
          label: '49',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0053.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0053.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0053.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0053.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0053.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0053.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0053.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0053.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 49',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0054.jp2',
          '@type': 'sc:Canvas',
          label: '50',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0054.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0054.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0054.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0054.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0054.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0054.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0054.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0054.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 50',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0055.jp2',
          '@type': 'sc:Canvas',
          label: '51',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0055.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0055.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0055.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0055.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0055.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0055.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0055.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0055.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 51',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0056.jp2',
          '@type': 'sc:Canvas',
          label: '52',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0056.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0056.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0056.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0056.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0056.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0056.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0056.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0056.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 52',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0057.jp2',
          '@type': 'sc:Canvas',
          label: '53',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0057.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0057.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0057.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0057.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0057.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0057.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0057.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0057.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 53',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0058.jp2',
          '@type': 'sc:Canvas',
          label: '54',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0058.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0058.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0058.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0058.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0058.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0058.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0058.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0058.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 54',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0059.jp2',
          '@type': 'sc:Canvas',
          label: '55',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0059.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0059.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0059.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0059.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0059.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0059.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0059.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0059.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 55',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0060.jp2',
          '@type': 'sc:Canvas',
          label: '56',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0060.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0060.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0060.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0060.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0060.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0060.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0060.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0060.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 56',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0061.jp2',
          '@type': 'sc:Canvas',
          label: '57',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0061.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0061.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0061.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0061.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0061.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0061.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0061.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0061.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 57',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0062.jp2',
          '@type': 'sc:Canvas',
          label: '58',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0062.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0062.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0062.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0062.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0062.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0062.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0062.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0062.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 58',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0063.jp2',
          '@type': 'sc:Canvas',
          label: '59',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0063.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0063.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0063.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0063.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0063.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0063.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0063.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0063.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 59',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0064.jp2',
          '@type': 'sc:Canvas',
          label: '60',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0064.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0064.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0064.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0064.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0064.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0064.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0064.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0064.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 60',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0065.jp2',
          '@type': 'sc:Canvas',
          label: '61',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0065.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0065.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0065.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0065.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0065.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0065.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0065.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0065.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 61',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0066.jp2',
          '@type': 'sc:Canvas',
          label: '62',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0066.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0066.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0066.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0066.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0066.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0066.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0066.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0066.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 62',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0067.jp2',
          '@type': 'sc:Canvas',
          label: '63',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0067.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0067.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0067.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0067.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0067.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0067.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0067.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0067.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 63',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0068.jp2',
          '@type': 'sc:Canvas',
          label: '64',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0068.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0068.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0068.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0068.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0068.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0068.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0068.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0068.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 64',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0069.jp2',
          '@type': 'sc:Canvas',
          label: '65',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0069.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0069.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0069.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0069.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0069.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0069.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0069.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0069.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 65',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0070.jp2',
          '@type': 'sc:Canvas',
          label: '66',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0070.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0070.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0070.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0070.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0070.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0070.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0070.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0070.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 66',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0071.jp2',
          '@type': 'sc:Canvas',
          label: '67',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0071.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0071.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0071.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0071.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0071.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0071.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0071.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0071.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 67',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0072.jp2',
          '@type': 'sc:Canvas',
          label: '68',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0072.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0072.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0072.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0072.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0072.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0072.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0072.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0072.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 68',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0073.jp2',
          '@type': 'sc:Canvas',
          label: '69',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0073.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0073.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0073.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0073.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0073.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0073.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0073.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0073.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 69',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0074.jp2',
          '@type': 'sc:Canvas',
          label: '70',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0074.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0074.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0074.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0074.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0074.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0074.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0074.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0074.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 70',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0075.jp2',
          '@type': 'sc:Canvas',
          label: '71',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0075.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0075.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0075.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0075.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0075.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0075.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0075.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0075.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 71',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0076.jp2',
          '@type': 'sc:Canvas',
          label: '72',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0076.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0076.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0076.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0076.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0076.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0076.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0076.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0076.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 72',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0077.jp2',
          '@type': 'sc:Canvas',
          label: '73',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0077.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0077.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0077.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0077.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0077.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0077.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0077.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0077.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 73',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0078.jp2',
          '@type': 'sc:Canvas',
          label: '74',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0078.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0078.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0078.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0078.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0078.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0078.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0078.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0078.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 74',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0079.jp2',
          '@type': 'sc:Canvas',
          label: '75',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0079.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0079.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0079.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0079.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0079.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0079.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0079.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0079.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 75',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0080.jp2',
          '@type': 'sc:Canvas',
          label: '76',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0080.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0080.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0080.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0080.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0080.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0080.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0080.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0080.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 76',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0081.jp2',
          '@type': 'sc:Canvas',
          label: '77',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0081.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0081.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0081.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0081.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0081.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0081.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0081.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0081.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 77',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0082.jp2',
          '@type': 'sc:Canvas',
          label: '78',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0082.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0082.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0082.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0082.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0082.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0082.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0082.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0082.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 78',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0083.jp2',
          '@type': 'sc:Canvas',
          label: '79',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0083.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0083.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0083.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0083.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0083.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0083.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0083.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0083.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 79',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0084.jp2',
          '@type': 'sc:Canvas',
          label: '80',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0084.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0084.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0084.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0084.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0084.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0084.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0084.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0084.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 80',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0085.jp2',
          '@type': 'sc:Canvas',
          label: '81',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0085.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0085.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0085.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0085.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0085.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0085.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0085.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0085.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 81',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0086.jp2',
          '@type': 'sc:Canvas',
          label: '82',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0086.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0086.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0086.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0086.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0086.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0086.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0086.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0086.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 82',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0087.jp2',
          '@type': 'sc:Canvas',
          label: '83',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0087.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0087.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0087.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0087.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0087.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0087.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0087.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0087.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 83',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0088.jp2',
          '@type': 'sc:Canvas',
          label: '84',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0088.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0088.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0088.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0088.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0088.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0088.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0088.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0088.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 84',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0089.jp2',
          '@type': 'sc:Canvas',
          label: '85',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0089.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0089.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0089.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0089.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0089.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0089.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0089.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0089.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 85',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0090.jp2',
          '@type': 'sc:Canvas',
          label: '86',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0090.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0090.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0090.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0090.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0090.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0090.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0090.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0090.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page 86',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0091.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0091.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0091.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0091.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0091.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0091.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0091.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0091.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0091.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0092.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0092.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0092.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0092.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0092.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0092.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0092.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0092.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0092.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0093.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0093.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0093.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0093.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0093.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0093.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0093.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0093.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0093.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0094.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0094.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0094.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0094.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0094.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0094.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0094.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0094.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0094.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0095.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0095.jp2/full/64,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0095.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 655,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0095.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3290,
          width: 2105,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0095.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0095.jp2/full/655,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 655,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0095.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2105,
                  height: 3290,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0095.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0095.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
        {
          '@id':
            'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0096.jp2',
          '@type': 'sc:Canvas',
          label: '-',
          thumbnail: {
            '@id':
              'https://iiif.wellcomecollection.org/thumbs/b21538906_0096.jp2/full/63,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://iiif.wellcomecollection.org/thumbs/b21538906_0096.jp2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              protocol: 'http://iiif.io/api/image',
              width: 646,
              height: 1024,
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
            },
          },
          seeAlso: {
            '@id':
              'https://api.wellcomecollection.org/text/alto/b21538906/b21538906_0096.jp2',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            format: 'text/xml',
            label: 'METS-ALTO XML',
          },
          height: 3561,
          width: 2245,
          images: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0096.jp2/painting/anno',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://iiif.wellcomecollection.org/image/b21538906_0096.jp2/full/646,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 646,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://iiif.wellcomecollection.org/image/b21538906_0096.jp2',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                  protocol: 'http://iiif.io/api/image',
                  width: 2245,
                  height: 3561,
                },
              },
              on: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0096.jp2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://iiif.wellcomecollection.org/annotations/v2/b21538906/b21538906_0096.jp2/line',
              '@type': 'sc:AnnotationList',
              label: 'Text of page  -',
            },
          ],
          within: '',
        },
      ],
    },
  ],
  structures: [
    {
      '@id':
        'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0001',
      '@type': 'sc:Range',
      label: 'Cover',
      canvases: [
        'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0001.jp2',
      ],
      within: '',
    },
    {
      '@id':
        'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0002',
      '@type': 'sc:Range',
      label: 'Title Page',
      canvases: [
        'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0007.jp2',
      ],
      within: '',
    },
    {
      '@id':
        'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0003',
      '@type': 'sc:Range',
      label: 'Cover',
      canvases: [
        'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0096.jp2',
      ],
      within: '',
    },
  ],
  otherContent: [
    {
      '@id':
        'https://iiif.wellcomecollection.org/annotations/v2/b21538906/images',
      '@type': 'sc:AnnotationList',
      label: 'OCR-identified images and figures for b21538906',
    },
  ],
  within:
    'https://iiif.wellcomecollection.org/presentation/v2/collections/contributors/xmk3e978',
  manifests: [],
};

export default manifest;
