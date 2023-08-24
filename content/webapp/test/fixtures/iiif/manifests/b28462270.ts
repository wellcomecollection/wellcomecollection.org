// Based on https://iiif-test.wellcomecollection.org/presentation/v3/b28462270
// Retrieved 4 May 2023
//
// This uses the new version of the DLCS image server, after the upgrades in May 2023.
const manifest = {
  '@context': [
    'https://iiif-test.wellcomecollection.org/extensions/born-digital/context.json',
    'http://iiif.io/api/presentation/3/context.json',
  ],
  id: 'https://iiif-test.wellcomecollection.org/presentation/b28462270',
  type: 'Manifest',
  label: {
    en: [
      'Digital humanities pedagogy : practices, principles and politics / edited by Brett D. Hirsch.',
    ],
  },
  thumbnail: [
    {
      id: 'https://iiif-test.wellcomecollection.org/thumb/b28462270',
      type: 'Image',
      format: 'image/jpeg',
    },
  ],
  homepage: [
    {
      id: 'https://wellcomecollection.org/works/qvgcmea3',
      type: 'Text',
      label: {
        en: [
          'Digital humanities pedagogy : practices, principles and politics / edited by Brett D. Hirsch.',
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
        none: ['Cambridge : Open Book Publishers, [2012], Â©2012.'],
      },
    },
    {
      label: {
        en: ['Physical description'],
      },
      value: {
        en: ['1 online resource (448 pages) : illustrations.'],
      },
    },
    {
      label: {
        en: ['Contributors'],
      },
      value: {
        none: ['Hirsch, Brett D', 'Open Book Publishers'],
      },
    },
    {
      label: {
        en: ['Notes'],
      },
      value: {
        en: ['Available through Open Book Publishers.'],
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
        en: [
          'Humanities - Computer network resources - Study and teaching (Higher)',
          'Digital humanities - Study and teaching (Higher)',
          'Humanities - Methodology - Study and teaching (Higher)',
          'Humanities - Study and teaching (Higher)',
          'Humanities - Technological innovations - Study and teaching (Higher)',
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
          '<span>You have permission to make copies of this work under a <a target="_top" href="http: //creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons, Attribution, Non-commercial, No-derivatives license</a>. <br/><br/> Non-commercial use includes private study, academic research, teaching, and other activities that are not primarily intended for, or directed towards, commercial advantage or private monetary compensation. See the <a target="_top" href="http: //creativecommons.org/licenses/by-nc-nd/4.0/legalcode">Legal Code</a> for further information.<br/><br/>Image source should be attributed as specified in the full catalogue record. If no source is given the image should be attributed to Wellcome Collection.<br/><br/> Altering, adapting, modifying or translating the work is prohibited.</span>',
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
          id: 'https://iiif-test.wellcomecollection.org/logos/wellcome-collection-black.png',
          type: 'Image',
          format: 'image/png',
        },
      ],
    },
  ],
  seeAlso: [
    {
      id: 'https://api.wellcomecollection.org/catalogue/v2/works/qvgcmea3',
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
      id: 'https://iiif-test.wellcomecollection.org/presentation/b28462270#tracking',
      type: 'Text',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      label: {
        en: [
          'Format: Monograph, Institution: n/a, Identifier: b28462270, Digicode: digobp, Collection code: n/a',
        ],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b28462270#timestamp',
      type: 'Text',
      profile:
        'https://github.com/wellcomecollection/iiif-builder/build-timestamp',
      label: {
        none: ['2023-04-26T12:59:00.3894750Z'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b28462270#accesscontrolhints',
      type: 'Text',
      profile: 'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
      label: {
        en: ['open'],
      },
      metadata: [
        {
          label: {
            en: ['Open'],
          },
          value: {
            none: ['1'],
          },
        },
      ],
    },
  ],
  items: [
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b28462270/canvases/b28462270_DigitalHumanitiesPedagogy.pdf',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 1000,
      height: 800,
      thumbnail: [
        {
          id: 'https://iiif-test.wellcomecollection.org/extensions/born-digital/placeholder-thumb/fmt/20/application/pdf',
          type: 'Image',
          width: 101,
          height: 151,
          format: 'image/png',
        },
      ],
      metadata: [
        {
          label: {
            en: ['File format'],
          },
          value: {
            none: ['Acrobat PDF 1.6 - Portable Document Format 1.6'],
          },
        },
        {
          label: {
            en: ['File size'],
          },
          value: {
            none: ['5.9 MB'],
          },
        },
        {
          label: {
            en: ['Pronom key'],
          },
          value: {
            none: ['fmt/20'],
          },
        },
      ],
      rendering: [
        {
          id: 'https://iiif-test.wellcomecollection.org/file/b28462270_DigitalHumanitiesPedagogy.pdf',
          type: 'Text',
          label: {
            none: ['-'],
          },
          format: 'application/pdf',
          behavior: ['original'],
        },
      ],
      behavior: ['placeholder'],
      items: [
        {
          id: 'https://iiif-test.wellcomecollection.org/presentation/b28462270/canvases/b28462270_DigitalHumanitiesPedagogy.pdf/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif-test.wellcomecollection.org/presentation/b28462270/canvases/b28462270_DigitalHumanitiesPedagogy.pdf/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://iiif-test.wellcomecollection.org/extensions/born-digital/placeholder-canvas/fmt/20/application/pdf',
                type: 'Image',
                width: 1000,
                height: 800,
                format: 'image/png',
              },
              target:
                'https://iiif-test.wellcomecollection.org/presentation/b28462270/canvases/b28462270_DigitalHumanitiesPedagogy.pdf',
            },
          ],
        },
      ],
    },
  ],
  partOf: [
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/contributors/d7fe2vs8',
      type: 'Collection',
      label: {
        en: ['Contributor: Hirsch, Brett D'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/contributors/he2bhwrf',
      type: 'Collection',
      label: {
        en: ['Contributor: Open Book Publishers'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/p5dgx97w',
      type: 'Collection',
      label: {
        en: [
          'Subject: Humanities - Computer network resources - Study and teaching (Higher)',
        ],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/e9ghzxj3',
      type: 'Collection',
      label: {
        en: ['Subject: Digital humanities - Study and teaching (Higher)'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/tvb662ze',
      type: 'Collection',
      label: {
        en: ['Subject: Humanities - Methodology - Study and teaching (Higher)'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/p5dgx97w',
      type: 'Collection',
      label: {
        en: ['Subject: Humanities - Study and teaching (Higher)'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/p5dgx97w',
      type: 'Collection',
      label: {
        en: [
          'Subject: Humanities - Technological innovations - Study and teaching (Higher)',
        ],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/genres/Electronic_books',
      type: 'Collection',
      label: {
        en: ['Genre: Electronic books'],
      },
    },
  ],
};

export default manifest;
