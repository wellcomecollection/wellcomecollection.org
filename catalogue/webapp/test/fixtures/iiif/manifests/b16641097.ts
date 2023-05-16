// This is based on https://iiif-test.wellcomecollection.org/presentation/b16641097
// as retrieved 3 May 2023
//
// This uses the new version of the DLCS image server, after the upgrades in May 2023.
const manifest = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097',
  type: 'Manifest',
  label: {
    en: ['Gestation of ovum.'],
  },
  summary: {
    en: [
      '&lt;p&gt;A time lapse study showing the relative sliding movements of the cells during early stages of embryonic development, and the development and fusion of the medullary plates. Time lapse studies of axolotl ovum and the rotation of the embryo during later stages of development are shown.  2 segments.&lt;/p&gt;',
    ],
  },
  homepage: [
    {
      id: 'https://wellcomecollection.org/works/qbukhq7m',
      type: 'Text',
      label: {
        en: ['Gestation of ovum.'],
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
          '&lt;p&gt;A time lapse study showing the relative sliding movements of the cells during early stages of embryonic development, and the development and fusion of the medullary plates. Time lapse studies of axolotl ovum and the rotation of the embryo during later stages of development are shown.  2 segments.&lt;/p&gt;',
        ],
      },
    },
    {
      label: {
        en: ['Publication/creation'],
      },
      value: {
        none: ['Germany : [s.n], 1924.'],
      },
    },
    {
      label: {
        en: ['Physical description'],
      },
      value: {
        en: ['1 encoded moving image (9 min.) : silent, black and white'],
      },
    },
    {
      label: {
        en: ['Copyright note'],
      },
      value: {
        en: ['British Medical Association 1924'],
      },
    },
    {
      label: {
        en: ['Creator/production credits'],
      },
      value: {
        en: ['Prof. Kopsch and Berlin University'],
      },
    },
    {
      label: {
        en: ['Subjects'],
      },
      value: {
        en: [
          'Obstetrics',
          'Embryology',
          'Embryonic and Fetal Development',
          'Friedrich-Wilhelms-UniversitÃ¤t Berlin',
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
          '&lt;span&gt;You have permission to make copies of this work under a &lt;a target="_top" href="http://creativecommons.org/licenses/by-nc/4.0/";&gt;Creative Commons, Attribution, Non-commercial license&lt;/a&gt;.&lt;br/&gt;&lt;br/&gt;Non-commercial use includes private study, academic research, teaching, and other activities that are not primarily intended for, or directed towards, commercial advantage or private monetary compensation. See the &lt;a target="_top" href="http://creativecommons.org/licenses/by-nc/4.0/legalcode";&gt;Legal Code&lt;/a&gt; for further information.&lt;br/&gt;&lt;br/&gt;Image source should be attributed as specified in the full catalogue record. If no source is given the image should be attributed to Wellcome Collection.&lt;/span&gt;',
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
          id: 'https://iiif-test.wellcomecollection.org/logos/wellcome-collection-black.png',
          type: 'Image',
          format: 'image/png',
        },
      ],
    },
  ],
  seeAlso: [
    {
      id: 'https://api.wellcomecollection.org/catalogue/v2/works/qbukhq7m',
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
      id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097#tracking',
      type: 'Text',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      label: {
        en: [
          'Format: Video, Institution: n/a, Identifier: b16641097, Digicode: digfilm, Collection code: n/a',
        ],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097#timestamp',
      type: 'Text',
      profile:
        'https://github.com/wellcomecollection/iiif-builder/build-timestamp',
      label: {
        none: ['2023-04-26T12:58:58.9397379Z'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097#accesscontrolhints',
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
  placeholderCanvas: {
    id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/poster-b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg',
    type: 'Canvas',
    label: {
      en: ['Poster Image Canvas'],
    },
    width: 600,
    height: 400,
    items: [
      {
        id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/poster-b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/painting',
        type: 'AnnotationPage',
        items: [
          {
            id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/poster-b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/painting/anno',
            type: 'Annotation',
            motivation: 'painting',
            body: {
              id: 'https://iiif-test.wellcomecollection.org/thumb/b16641097',
              type: 'Image',
              label: {
                en: ['Poster Image'],
              },
              format: 'image/jpeg',
            },
            target:
              'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/poster-b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/painting',
          },
        ],
      },
    ],
  },
  items: [
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 999,
      height: 999,
      duration: 1061,
      rendering: [
        {
          width: 720,
          height: 720,
          duration: 1061,
          id: 'https://iiif-test.wellcomecollection.org/av/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/full/full/max/max/0/default.mp4',
          type: 'Video',
          label: {
            en: ['Video file, size: 720 x 720'],
          },
          format: 'video/mp4',
        },
      ],
      items: [
        {
          id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                width: 720,
                height: 720,
                duration: 1061,
                id: 'https://iiif-test.wellcomecollection.org/av/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg/full/full/max/max/0/default.mp4',
                type: 'Video',
                label: {
                  en: ['Video file, size: 720 x 720'],
                },
                format: 'video/mp4',
              },
              target:
                'https://iiif-test.wellcomecollection.org/presentation/b16641097/canvases/b16641097_0055-0000-3655-0000-0-0000-0000-0.mpg',
            },
          ],
        },
      ],
    },
  ],
  partOf: [
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/zntjhxwq',
      type: 'Collection',
      label: {
        en: ['Subject: Obstetrics'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/tszj8pne',
      type: 'Collection',
      label: {
        en: ['Subject: Embryology'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/h5zvgnb3',
      type: 'Collection',
      label: {
        en: ['Subject: Embryonic and Fetal Development'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/q3cjsazk',
      type: 'Collection',
      label: {
        en: ['Subject: Friedrich-Wilhelms-UniversitÃ¤t Berlin'],
      },
    },
  ],
};

export default manifest;
