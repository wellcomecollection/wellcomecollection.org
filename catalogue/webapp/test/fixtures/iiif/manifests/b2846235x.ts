// Based on https://iiif.wellcomecollection.org/presentation/v3/b2846235x
// Retrieved 16 May 2023
//
// This pre-dates the DLCS image server upgrades in May 2023.
const manifest = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://iiif.wellcomecollection.org/presentation/b2846235x',
  type: 'Manifest',
  label: {
    en: ['Foundations for moral relativism / J. David Velleman.'],
  },
  summary: {
    en: [
      '&lt;p&gt;"In Foundations for Moral Relativism a distinguished moral philosopher tames a bugbear of current debate about cultural difference. J. David Velleman shows that different communities can indeed be subject to incompatible moralities, because their local mores are rationally binding. At the same time, he explains why the mores of different communities, even when incompatible, are still variations on the same moral themes. The book thus maps out a universe of many moral worlds without, as Velleman puts it, "moral black holes. The five self-standing chapters discuss such diverse topics as online avatars and virtual worlds, lying in Russian and truth-telling in Quechua, the pleasure of solitude and the fear of absurdity. Accessibly written, Foundations for Moral Relativism presupposes no prior training in philosophy."--Publisher\'s website.&lt;/p&gt;',
    ],
  },
  thumbnail: [
    {
      id: 'https://iiif.wellcomecollection.org/thumb/b2846235x',
      type: 'Image',
      format: 'image/jpeg',
    },
  ],
  homepage: [
    {
      id: 'https://wellcomecollection.org/works/sz6amg9m',
      type: 'Text',
      label: {
        en: ['Foundations for moral relativism / J. David Velleman.'],
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
          '&lt;p&gt;"In Foundations for Moral Relativism a distinguished moral philosopher tames a bugbear of current debate about cultural difference. J. David Velleman shows that different communities can indeed be subject to incompatible moralities, because their local mores are rationally binding. At the same time, he explains why the mores of different communities, even when incompatible, are still variations on the same moral themes. The book thus maps out a universe of many moral worlds without, as Velleman puts it, "moral black holes. The five self-standing chapters discuss such diverse topics as online avatars and virtual worlds, lying in Russian and truth-telling in Quechua, the pleasure of solitude and the fear of absurdity. Accessibly written, Foundations for Moral Relativism presupposes no prior training in philosophy."--Publisher\'s website.&lt;/p&gt;',
        ],
      },
    },
    {
      label: {
        en: ['Publication/creation'],
      },
      value: {
        none: ['Cambridge : Open Book Publishers, [2015], Â©2015.'],
      },
    },
    {
      label: {
        en: ['Physical description'],
      },
      value: {
        en: ['1 online resource (x, 109 pages)'],
      },
    },
    {
      label: {
        en: ['Contributors'],
      },
      value: {
        none: ['Velleman, James David.', 'Open Book Publishers.'],
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
        en: ['Ethical relativism'],
      },
    },
    {
      label: {
        en: ['Attribution and usage'],
      },
      value: {
        en: [
          'Wellcome Collection',
          '&lt;span&gt;You have permission to make copies of this work under a &lt;a target="_top" href="http://creativecommons.org/licenses/by-nc-nd/4.0/";&gt;Creative Commons, Attribution, Non-commercial, No-derivatives license&lt;/a&gt;. &lt;br/&gt;&lt;br/&gt; Non-commercial use includes private study, academic research, teaching, and other activities that are not primarily intended for, or directed towards, commercial advantage or private monetary compensation. See the &lt;a target="_top" href="http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode";&gt;Legal Code&lt;/a&gt; for further information.&lt;br/&gt;&lt;br/&gt;Image source should be attributed as specified in the full catalogue record. If no source is given the image should be attributed to Wellcome Collection.&lt;br/&gt;&lt;br/&gt; Altering, adapting, modifying or translating the work is prohibited.&lt;/span&gt;',
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
      id: 'https://api.wellcomecollection.org/catalogue/v2/works/sz6amg9m',
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
      id: 'https://iiif.wellcomecollection.org/presentation/b2846235x#tracking',
      type: 'Text',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      label: {
        en: [
          'Format: Monograph, Institution: n/a, Identifier: b2846235x, Digicode: digobp, Collection code: n/a',
        ],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2846235x#timestamp',
      type: 'Text',
      profile:
        'https://github.com/wellcomecollection/iiif-builder/build-timestamp',
      label: {
        none: ['2021-04-29T04:42:39.4581427Z'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2846235x#accesscontrolhints',
      type: 'Text',
      profile: 'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
      label: {
        en: ['open'],
      },
    },
  ],
  items: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/b2846235x/canvases/b2846235x_Foundations-Moral-Relativism-Expanded2ndEd.pdf',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      annotations: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b2846235x/canvases/b2846235x_Foundations-Moral-Relativism-Expanded2ndEd.pdf/supplementing',
          type: 'AnnotationPage',
          items: [
            {
              body: {
                id: 'https://iiif.wellcomecollection.org/file/b2846235x_Foundations-Moral-Relativism-Expanded2ndEd.pdf',
                type: 'Text',
                label: {
                  en: ['Foundations for moral relativism / J. David Velleman.'],
                },
                format: 'application/pdf',
              },
              id: 'https://iiif.wellcomecollection.org/presentation/b2846235x/canvases/b2846235x_Foundations-Moral-Relativism-Expanded2ndEd.pdf/supplementing/pdf',
              type: 'Annotation',
              motivation: 'supplementing',
              target:
                'https://iiif.wellcomecollection.org/presentation/b2846235x/canvases/b2846235x_Foundations-Moral-Relativism-Expanded2ndEd.pdf',
            },
          ],
        },
      ],
    },
  ],
  partOf: [
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/ew9rzxst',
      type: 'Collection',
      label: {
        en: ['Contributor: Velleman, James David.'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/contributors/he2bhwrf',
      type: 'Collection',
      label: {
        en: ['Contributor: Open Book Publishers.'],
      },
    },
    {
      id: 'https://iiif.wellcomecollection.org/presentation/collections/subjects/ha7dy4jz',
      type: 'Collection',
      label: {
        en: ['Subject: Ethical relativism'],
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
