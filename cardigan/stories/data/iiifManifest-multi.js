const multiManifest = {
  '@context': 'http://iiif.io/api/presentation/2/context.json',
  '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/manifest',
  '@type': 'sc:Manifest',
  label:
    'The life and letters of Charles Darwin : including an autobiographical chapter',
  metadata: [
    {
      label: 'Title',
      value: 'The life and letters of Charles Darwin :',
    },
    {
      label: 'Author(s)',
      value: 'Darwin, Charles; Darwin, Francis',
    },
    {
      label: 'Publication date',
      value: '1887.',
    },
    {
      label: '',
      value:
        "<a href='https://search.wellcomelibrary.org/iii/encore/record/C__Rb1803196'>View full catalogue record</a>",
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
    '@id': 'https://wellcomelibrary.org/item/b18031961',
    format: 'text/html',
  },
  seeAlso: [
    {
      '@id': 'https://wellcomelibrary.org/data/b18031961.json',
      format: 'application/json',
      profile: 'http://wellcomelibrary.org/profiles/res',
    },
    {
      '@id': 'https://wellcomelibrary.org/resource/schemaorg/b18031961',
      format: 'application/ld+json',
      profile: 'http://iiif.io/community/profiles/discovery/schema',
    },
    {
      '@id': 'https://wellcomelibrary.org/resource/dublincore/b18031961',
      format: 'application/ld+json',
      profile: 'http://iiif.io/community/profiles/discovery/dc',
    },
  ],
  service: [
    {
      '@context': 'http://wellcomelibrary.org/ld/iiif-ext/0/context.json',
      '@id':
        'https://wellcomelibrary.org/iiif/b18031961-0/access-control-hints-service',
      profile: 'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
      accessHint: 'open',
    },
    {
      '@context': 'http://iiif.io/api/search/0/context.json',
      '@id': 'https://wellcomelibrary.org/annoservices/search/b18031961-0',
      profile: 'http://iiif.io/api/search/0/search',
      label: 'Search within this manifest',
      service: {
        '@id':
          'https://wellcomelibrary.org/annoservices/autocomplete/b18031961-0',
        profile: 'http://iiif.io/api/search/0/autocomplete',
        label: 'Get suggested words in this manifest',
      },
    },
    {
      '@context': 'http://universalviewer.io/context.json',
      '@id': 'http://wellcomelibrary.org/service/trackingLabels/b18031961',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      trackingLabel:
        'Format: monograph, Institution: n/a, Identifier: b18031961, Digicode: diggenetics, Collection code: n/a',
    },
  ],
  sequences: [
    {
      '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/sequence/s0',
      '@type': 'sc:Sequence',
      label: 'Sequence s0',
      rendering: [
        {
          '@id': 'https://dlcs.io/pdf/wellcome/pdf-item/b18031961/0',
          format: 'application/pdf',
          label: 'Download as PDF',
        },
        {
          '@id':
            'https://wellcomelibrary.org/service/fulltext/b18031961/0?raw=true',
          format: 'text/plain',
          label: 'Download raw text',
        },
      ],
      viewingHint: 'paged',
      canvases: [
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c0',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/ec7e17fb-d3fb-4a4f-8212-5f3474478027/full/67,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/ec7e17fb-d3fb-4a4f-8212-5f3474478027',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 683,
              sizes: [
                {
                  width: 67,
                  height: 100,
                },
                {
                  width: 133,
                  height: 200,
                },
                {
                  width: 267,
                  height: 400,
                },
                {
                  width: 683,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=0',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 5616,
          width: 3744,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/ec7e17fb-d3fb-4a4f-8212-5f3474478027',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/ec7e17fb-d3fb-4a4f-8212-5f3474478027/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 683,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/ec7e17fb-d3fb-4a4f-8212-5f3474478027',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c0',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/0',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c2',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/89ab69d2-fb33-4bc6-a948-f1b2fa28eba9/full/60,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/89ab69d2-fb33-4bc6-a948-f1b2fa28eba9',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 611,
              sizes: [
                {
                  width: 60,
                  height: 100,
                },
                {
                  width: 119,
                  height: 200,
                },
                {
                  width: 239,
                  height: 400,
                },
                {
                  width: 611,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=2',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 2888,
          width: 1724,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/89ab69d2-fb33-4bc6-a948-f1b2fa28eba9',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/89ab69d2-fb33-4bc6-a948-f1b2fa28eba9/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 611,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/89ab69d2-fb33-4bc6-a948-f1b2fa28eba9',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c2',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/2',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c3',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/624eea57-455c-4eed-a03a-ce890155f924/full/60,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/624eea57-455c-4eed-a03a-ce890155f924',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 611,
              sizes: [
                {
                  width: 60,
                  height: 100,
                },
                {
                  width: 119,
                  height: 200,
                },
                {
                  width: 239,
                  height: 400,
                },
                {
                  width: 611,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=3',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 2888,
          width: 1724,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/624eea57-455c-4eed-a03a-ce890155f924',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/624eea57-455c-4eed-a03a-ce890155f924/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 611,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/624eea57-455c-4eed-a03a-ce890155f924',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c3',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/3',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c4',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/2cd541cc-5bba-4ba2-98c3-94cda3bbf550/full/60,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/2cd541cc-5bba-4ba2-98c3-94cda3bbf550',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 611,
              sizes: [
                {
                  width: 60,
                  height: 100,
                },
                {
                  width: 119,
                  height: 200,
                },
                {
                  width: 239,
                  height: 400,
                },
                {
                  width: 611,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=4',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 2888,
          width: 1724,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/2cd541cc-5bba-4ba2-98c3-94cda3bbf550',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/2cd541cc-5bba-4ba2-98c3-94cda3bbf550/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 611,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/2cd541cc-5bba-4ba2-98c3-94cda3bbf550',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c4',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/4',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c5',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/72b75582-148c-4c00-b69e-66e5bea81444/full/60,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/72b75582-148c-4c00-b69e-66e5bea81444',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 611,
              sizes: [
                {
                  width: 60,
                  height: 100,
                },
                {
                  width: 119,
                  height: 200,
                },
                {
                  width: 239,
                  height: 400,
                },
                {
                  width: 611,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=5',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 2888,
          width: 1724,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/72b75582-148c-4c00-b69e-66e5bea81444',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/72b75582-148c-4c00-b69e-66e5bea81444/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 611,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/72b75582-148c-4c00-b69e-66e5bea81444',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c5',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/5',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c6',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/0da311be-2ba2-4e93-948c-671fadac4d76/full/60,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/0da311be-2ba2-4e93-948c-671fadac4d76',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 611,
              sizes: [
                {
                  width: 60,
                  height: 100,
                },
                {
                  width: 119,
                  height: 200,
                },
                {
                  width: 239,
                  height: 400,
                },
                {
                  width: 611,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=6',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 2888,
          width: 1724,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/0da311be-2ba2-4e93-948c-671fadac4d76',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/0da311be-2ba2-4e93-948c-671fadac4d76/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 611,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/0da311be-2ba2-4e93-948c-671fadac4d76',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c6',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/6',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c7',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/8840f2bb-fac7-4d07-9e06-ceacb95193f9/full/60,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/8840f2bb-fac7-4d07-9e06-ceacb95193f9',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 611,
              sizes: [
                {
                  width: 60,
                  height: 100,
                },
                {
                  width: 119,
                  height: 200,
                },
                {
                  width: 239,
                  height: 400,
                },
                {
                  width: 611,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=7',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 2888,
          width: 1724,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/8840f2bb-fac7-4d07-9e06-ceacb95193f9',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/8840f2bb-fac7-4d07-9e06-ceacb95193f9/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 611,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/8840f2bb-fac7-4d07-9e06-ceacb95193f9',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c7',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/7',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c8',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/db66bb5c-d7f5-4be1-a792-8d8ff900e312/full/60,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/db66bb5c-d7f5-4be1-a792-8d8ff900e312',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 611,
              sizes: [
                {
                  width: 60,
                  height: 100,
                },
                {
                  width: 119,
                  height: 200,
                },
                {
                  width: 239,
                  height: 400,
                },
                {
                  width: 611,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=8',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 2888,
          width: 1724,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/db66bb5c-d7f5-4be1-a792-8d8ff900e312',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/db66bb5c-d7f5-4be1-a792-8d8ff900e312/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 611,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/db66bb5c-d7f5-4be1-a792-8d8ff900e312',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c8',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/8',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c9',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/9b4784c1-2917-453a-bc87-fd3ff3cb11d3/full/60,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/9b4784c1-2917-453a-bc87-fd3ff3cb11d3',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 611,
              sizes: [
                {
                  width: 60,
                  height: 100,
                },
                {
                  width: 119,
                  height: 200,
                },
                {
                  width: 239,
                  height: 400,
                },
                {
                  width: 611,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=9',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 2888,
          width: 1724,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/9b4784c1-2917-453a-bc87-fd3ff3cb11d3',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/9b4784c1-2917-453a-bc87-fd3ff3cb11d3/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 611,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/9b4784c1-2917-453a-bc87-fd3ff3cb11d3',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c9',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/9',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c420',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/32533b95-d787-47ac-9d7c-abdb383f8d79/full/60,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/32533b95-d787-47ac-9d7c-abdb383f8d79',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 611,
              sizes: [
                {
                  width: 60,
                  height: 100,
                },
                {
                  width: 119,
                  height: 200,
                },
                {
                  width: 239,
                  height: 400,
                },
                {
                  width: 611,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=420',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 2888,
          width: 1724,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/32533b95-d787-47ac-9d7c-abdb383f8d79',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/32533b95-d787-47ac-9d7c-abdb383f8d79/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 611,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/32533b95-d787-47ac-9d7c-abdb383f8d79',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c420',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/420',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c421',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/f80d6c73-3801-4465-86ac-86417b97e4d6/full/60,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/f80d6c73-3801-4465-86ac-86417b97e4d6',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 611,
              sizes: [
                {
                  width: 60,
                  height: 100,
                },
                {
                  width: 119,
                  height: 200,
                },
                {
                  width: 239,
                  height: 400,
                },
                {
                  width: 611,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=421',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 2888,
          width: 1724,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/f80d6c73-3801-4465-86ac-86417b97e4d6',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/f80d6c73-3801-4465-86ac-86417b97e4d6/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 611,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/f80d6c73-3801-4465-86ac-86417b97e4d6',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c421',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/421',
              '@type': 'sc:AnnotationList',
              label: 'Text of this page',
            },
          ],
        },
        {
          '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c1',
          '@type': 'sc:Canvas',
          label: ' - ',
          thumbnail: {
            '@id':
              'https://dlcs.io/thumbs/wellcome/1/7d38995f-ea0d-4a7b-9168-232eefa5fce7/full/67,100/0/default.jpg',
            '@type': 'dctypes:Image',
            service: {
              '@context': 'http://iiif.io/api/image/2/context.json',
              '@id':
                'https://dlcs.io/thumbs/wellcome/1/7d38995f-ea0d-4a7b-9168-232eefa5fce7',
              protocol: 'http://iiif.io/api/image',
              height: 1024,
              width: 683,
              sizes: [
                {
                  width: 67,
                  height: 100,
                },
                {
                  width: 133,
                  height: 200,
                },
                {
                  width: 267,
                  height: 400,
                },
                {
                  width: 683,
                  height: 1024,
                },
              ],
              profile: ['http://iiif.io/api/image/2/level0.json'],
            },
          },
          seeAlso: {
            '@id':
              'https://wellcomelibrary.org/service/alto/b18031961/0?image=1',
            format: 'text/xml',
            profile: 'http://www.loc.gov/standards/alto/v3/alto.xsd',
            label: 'METS-ALTO XML',
          },
          height: 5616,
          width: 3744,
          images: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/imageanno/7d38995f-ea0d-4a7b-9168-232eefa5fce7',
              '@type': 'oa:Annotation',
              motivation: 'sc:painting',
              resource: {
                '@id':
                  'https://dlcs.io/iiif-img/wellcome/1/7d38995f-ea0d-4a7b-9168-232eefa5fce7/full/!1024,1024/0/default.jpg',
                '@type': 'dctypes:Image',
                format: 'image/jpeg',
                height: 1024,
                width: 683,
                service: {
                  '@context': 'http://iiif.io/api/image/2/context.json',
                  '@id':
                    'https://dlcs.io/iiif-img/wellcome/1/7d38995f-ea0d-4a7b-9168-232eefa5fce7',
                  profile: 'http://iiif.io/api/image/2/level1.json',
                },
              },
              on: 'https://wellcomelibrary.org/iiif/b18031961-0/canvas/c1',
            },
          ],
          otherContent: [
            {
              '@id':
                'https://wellcomelibrary.org/iiif/b18031961-0/contentAsText/1',
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
      '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/range/r-2',
      '@type': 'sc:Range',
      label: 'Title Page',
      canvases: ['https://wellcomelibrary.org/iiif/b18031961-0/canvas/c9'],
    },
    {
      '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/range/r-1',
      '@type': 'sc:Range',
      label: 'Back Cover',
      canvases: ['https://wellcomelibrary.org/iiif/b18031961-0/canvas/c1'],
    },
  ],
  otherContent: [
    {
      '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/images',
      '@type': 'sc:AnnotationList',
      label: 'OCR-identified images and figures for b18031961-0',
    },
    {
      '@id': 'https://wellcomelibrary.org/iiif/b18031961-0/allcontent',
      '@type': 'sc:AnnotationList',
      label: 'All OCR-derived annotations for b18031961-0',
    },
  ],
  within: 'https://wellcomelibrary.org/iiif/collection/b18031961',
};
export default multiManifest;
