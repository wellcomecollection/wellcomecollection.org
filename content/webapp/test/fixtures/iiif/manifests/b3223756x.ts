// This is based on https://iiif-test.wellcomecollection.org/presentation/v3/b3223756x
// as retrieved 4 May 2023
//
// This uses the new version of the DLCS image server, after the upgrades in May 2023.
const manifest = {
  '@context': 'http://iiif.io/api/presentation/3/context.json',
  id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x',
  type: 'Manifest',
  label: {
    en: ['Animated slides on the duplicity of vision.'],
  },
  summary: {
    en: [
      '&lt;p&gt;Animated slides with voiceover showing the function of the Fovea. &lt;/p&gt;',
    ],
  },
  homepage: [
    {
      id: 'https://wellcomecollection.org/works/r2whysjp',
      type: 'Text',
      label: {
        en: ['Animated slides on the duplicity of vision.'],
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
          '&lt;p&gt;Animated slides with voiceover showing the function of the Fovea. &lt;/p&gt;',
        ],
      },
    },
    {
      label: {
        en: ['Publication/creation'],
      },
      value: {
        none: ['England, c.1960.'],
      },
    },
    {
      label: {
        en: ['Physical description'],
      },
      value: {
        en: ['1 encoded moving image (05 min.)'],
      },
    },
    {
      label: {
        en: ['Contributors'],
      },
      value: {
        none: ['Institute of Ophthalmology.'],
      },
    },
    {
      label: {
        en: ['Copyright note'],
      },
      value: {
        en: ['Institute of Ophthalmology.'],
      },
    },
    {
      label: {
        en: ['Notes'],
      },
      value: {
        en: [
          'The sound reel forms part of a group of films donated to the Wellcome Trust in 2006 by The British Medical Association.',
          "The picture only reel was 1 of 58 films which formed part of an additional accession in 2015 to a group of films donated to the Wellcome Trust in 2006 by The British Medical Association. The material originates from the Institute of Ophthalmology and it isn't clear when they arrived at the BMA.",
        ],
      },
    },
    {
      label: {
        en: ['Creator/production credits'],
      },
      value: {
        en: ['R. A. Weale.'],
      },
    },
    {
      label: {
        en: ['Subjects'],
      },
      value: {
        en: [
          'Ophthalmology',
          'Vision, Ocular',
          'Eye',
          'Eye Diseases',
          'Eye Manifestations',
          'Nystagmus, Pathologic',
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
          '&lt;span&gt;Conditions of use: it is possible this item is protected by copyright and/or related rights. You are free to use this item in any way that is permitted by the copyright and related rights legislation that applies to your use. For other uses you need to obtain permission from the rights-holder(s).&lt;/span&gt;',
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
          id: 'https://iiif-test.wellcomecollection.org/logos/wellcome-collection-black.png',
          type: 'Image',
          format: 'image/png',
        },
      ],
    },
  ],
  seeAlso: [
    {
      id: 'https://api.wellcomecollection.org/catalogue/v2/works/r2whysjp',
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
      id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x#tracking',
      type: 'Text',
      profile: 'http://universalviewer.io/tracking-extensions-profile',
      label: {
        en: [
          'Format: Video, Institution: n/a, Identifier: b3223756x, Digicode: digfilm, Collection code: n/a',
        ],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x#timestamp',
      type: 'Text',
      profile:
        'https://github.com/wellcomecollection/iiif-builder/build-timestamp',
      label: {
        none: ['2023-05-03T16:48:12.4591750Z'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x#accesscontrolhints',
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
    id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/poster-b3223756x_0002.mp4',
    type: 'Canvas',
    label: {
      en: ['Poster Image Canvas'],
    },
    width: 600,
    height: 400,
    items: [
      {
        id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/poster-b3223756x_0002.mp4/painting',
        type: 'AnnotationPage',
        items: [
          {
            id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/poster-b3223756x_0002.mp4/painting/anno',
            type: 'Annotation',
            motivation: 'painting',
            body: {
              id: 'https://iiif-test.wellcomecollection.org/thumb/b3223756x',
              type: 'Image',
              label: {
                en: ['Poster Image'],
              },
              format: 'image/jpeg',
            },
            target:
              'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/poster-b3223756x_0002.mp4/painting',
          },
        ],
      },
    ],
  },
  items: [
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/b3223756x_0002.mp4',
      type: 'Canvas',
      label: {
        none: ['-'],
      },
      width: 2048,
      height: 1536,
      duration: 239.875,
      rendering: [
        {
          width: 960,
          height: 720,
          duration: 239.875,
          id: 'https://iiif-test.wellcomecollection.org/av/b3223756x_0002.mp4/full/full/max/max/0/default.mp4',
          type: 'Video',
          label: {
            en: ['Video file, size: 960 x 720'],
          },
          format: 'video/mp4',
        },
        {
          width: 2048,
          height: 1536,
          duration: 239.875,
          id: 'https://iiif-test.wellcomecollection.org/file/b3223756x_0002.mp4',
          type: 'Video',
          label: {
            en: ['Video file, size: 2048 x 1536'],
          },
          format: 'video/mp4',
        },
      ],
      items: [
        {
          id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/b3223756x_0002.mp4/painting',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/b3223756x_0002.mp4/painting/anno',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                type: 'Choice',
                items: [
                  {
                    width: 960,
                    height: 720,
                    duration: 239.875,
                    id: 'https://iiif-test.wellcomecollection.org/av/b3223756x_0002.mp4/full/full/max/max/0/default.mp4',
                    type: 'Video',
                    label: {
                      en: ['Video file, size: 960 x 720'],
                    },
                    format: 'video/mp4',
                  },
                  {
                    width: 2048,
                    height: 1536,
                    duration: 239.875,
                    id: 'https://iiif-test.wellcomecollection.org/file/b3223756x_0002.mp4',
                    type: 'Video',
                    label: {
                      en: ['Video file, size: 2048 x 1536'],
                    },
                    format: 'video/mp4',
                  },
                ],
              },
              target:
                'https://iiif-test.wellcomecollection.org/presentation/b3223756x/canvases/b3223756x_0002.mp4',
            },
          ],
        },
      ],
    },
  ],
  partOf: [
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/contributors/f2skecp7',
      type: 'Collection',
      label: {
        en: ['Contributor: Institute of Ophthalmology.'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/yykpte9u',
      type: 'Collection',
      label: {
        en: ['Subject: Ophthalmology'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/fc3sth5p',
      type: 'Collection',
      label: {
        en: ['Subject: Vision, Ocular'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/nfv4y9gy',
      type: 'Collection',
      label: {
        en: ['Subject: Eye'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/msp96ntw',
      type: 'Collection',
      label: {
        en: ['Subject: Eye Diseases'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/brz3964g',
      type: 'Collection',
      label: {
        en: ['Subject: Eye Manifestations'],
      },
    },
    {
      id: 'https://iiif-test.wellcomecollection.org/presentation/collections/subjects/qpeyyytg',
      type: 'Collection',
      label: {
        en: ['Subject: Nystagmus, Pathologic'],
      },
    },
  ],
};

export default manifest;
