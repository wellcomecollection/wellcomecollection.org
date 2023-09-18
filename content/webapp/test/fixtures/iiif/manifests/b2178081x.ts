// This is based on https://iiif-test.wellcomecollection.org/presentation/v3/b2178081x
// Retrieved 4 May 2023.
//
// This uses the new version of the DLCS image server, after the upgrades in May 2023.
const manifest = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://iiif-test.wellcomecollection.org/presentation/b2178081x',
  type: 'Collection',
  label: {
    en: [
      'A monograph on the British fossil reptilia of the Mesozoic formations / by Richard Owen.',
    ],
  },
  homepage: [
    {
      id: 'https://wellcomecollection.org/works/apgz6qv8',
      type: 'Text',
      label: {
        en: [
          'A monograph on the British fossil reptilia of the Mesozoic formations / by Richard Owen.',
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
        none: [
          'London : Printed for the Palaeontographical Society, 1874-1889.',
        ],
      },
    },
    {
      label: {
        en: ['Physical description'],
      },
      value: {
        en: ['parts : illustrations, plates (some folded) ; 29 cm'],
      },
    },
    {
      label: {
        en: ['Contributors'],
      },
      value: {
        none: [
          'Owen, Richard, 1804-1892',
          'Palaeontographical Society (Great Britain)',
        ],
      },
    },
    {
      label: {
        en: ['Notes'],
      },
      value: {
        en: ['Each plate preceded by leaf with descriptive letterpress.'],
      },
    },
    {
      label: {
        en: ['Subjects'],
      },
      value: {
        en: ['Reptiles, Fossil', 'Paleontology'],
      },
    },
  ],
  rights: 'http://creativecommons.org/publicdomain/mark/1.0/',
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
  rendering: [
    {
      id: 'https://api.wellcomecollection.org/text/v1/b2178081x.zip',
      type: 'Text',
      label: {
        en: ['Complete text as zip file'],
      },
      format: 'application/zip',
    },
  ],
  seeAlso: [
    {
      id: 'https://api.wellcomecollection.org/catalogue/v2/works/apgz6qv8',
      type: 'Dataset',
      profile: 'https://api.wellcomecollection.org/catalogue/v2/context.json',
      label: {
        en: ['Wellcome Collection Catalogue API'],
      },
      format: 'application/json',
    },
  ],
  behavior: ['multi-part'],
  services: [
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b2178081x#tracking',
      type: 'Text',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      label: {
        en: [
          'Format: Monograph, Institution: n/a, Identifier: b2178081x, Digicode: digukmhl, Collection code: n/a',
        ],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b2178081x#timestamp',
      type: 'Text',
      profile:
        'https://github.com/wellcomecollection/iiif-builder/build-timestamp',
      label: {
        none: ['2023-04-26T12:56:19.5796453Z'],
      },
    },
  ],
  items: [
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b2178081x_0002',
      type: 'Manifest',
      label: {
        en: [
          'A monograph on the British fossil reptilia of the Mesozoic formations / by Richard Owen.',
          'Volume 1',
        ],
      },
      thumbnail: [
        {
          id: 'https://iiif-test.wellcomecollection.org/thumbs/b2178081x_0002_0005.jp2/full/75,100/0/default.jpg',
          type: 'Image',
          width: 75,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif-test.wellcomecollection.org/thumbs/b2178081x_0002_0005.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 766,
              height: 1024,
              sizes: [
                {
                  width: 75,
                  height: 100,
                },
                {
                  width: 150,
                  height: 200,
                },
                {
                  width: 299,
                  height: 400,
                },
                {
                  width: 766,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b2178081x_0003',
      type: 'Manifest',
      label: {
        en: [
          'A monograph on the British fossil reptilia of the Mesozoic formations / by Richard Owen.',
          'Volume 2',
        ],
      },
      thumbnail: [
        {
          id: 'https://iiif-test.wellcomecollection.org/thumbs/b2178081x_0003_0001.jp2/full/75,100/0/default.jpg',
          type: 'Image',
          width: 75,
          height: 100,
          service: [
            {
              '@id':
                'https://iiif-test.wellcomecollection.org/thumbs/b2178081x_0003_0001.jp2',
              '@type': 'ImageService2',
              profile: 'http://iiif.io/api/image/2/level0.json',
              width: 772,
              height: 1024,
              sizes: [
                {
                  width: 75,
                  height: 100,
                },
                {
                  width: 151,
                  height: 200,
                },
                {
                  width: 302,
                  height: 400,
                },
                {
                  width: 772,
                  height: 1024,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  partOf: [
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/contributors/uu9xg9uh',
      type: 'Collection',
      label: {
        en: ['Contributor: Owen, Richard, 1804-1892'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/contributors/sbky99vm',
      type: 'Collection',
      label: {
        en: ['Contributor: Palaeontographical Society (Great Britain)'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/v8fygcmd',
      type: 'Collection',
      label: {
        en: ['Subject: Reptiles, Fossil'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/t9zppk79',
      type: 'Collection',
      label: {
        en: ['Subject: Paleontology'],
      },
    },
  ],
};

export default manifest;
