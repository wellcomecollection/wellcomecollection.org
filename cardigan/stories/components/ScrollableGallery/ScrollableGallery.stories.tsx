import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import ScrollableGallery from '@weco/content/components/ScrollableGallery/ScrollableGallery';
import Readme from '@weco/content/components/ScrollableGallery/README.mdx';

const mockImages = [
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/L0078251/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'cc-by',
          label: 'Attribution 4.0 International (CC BY 4.0)',
          url: 'http://creativecommons.org/licenses/by/4.0/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'uwed88df',
      title: 'Oversize ephemera : Medical songs 3.',
      type: 'Work',
    },
    aspectRatio: 0.75,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/L0078251/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'cc-by',
        label: 'Attribution 4.0 International (CC BY 4.0)',
        url: 'http://creativecommons.org/licenses/by/4.0/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#c6b39d',
    id: 'a2sahwbs',
    type: 'Image',
  },
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/L0078298/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'cc-by',
          label: 'Attribution 4.0 International (CC BY 4.0)',
          url: 'http://creativecommons.org/licenses/by/4.0/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'uwed88df',
      title: 'Oversize ephemera : Medical songs 3.',
      type: 'Work',
    },
    aspectRatio: 0.7425,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/L0078298/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'cc-by',
        label: 'Attribution 4.0 International (CC BY 4.0)',
        url: 'http://creativecommons.org/licenses/by/4.0/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#c0b19e',
    id: 'a62y95ed',
    type: 'Image',
  },
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/L0048838/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'pdm',
          label: 'Public Domain Mark',
          url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'cmpdynkc',
      title:
        "A woman's example: and a nation's work : A tribute to Florence Nightingale / [Frederick Milnes Edge].",
      type: 'Work',
    },
    aspectRatio: 0.68,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/L0048838/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'pdm',
        label: 'Public Domain Mark',
        url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#d4cbba',
    id: 'acfyvhw4',
    type: 'Image',
  },
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/L0048835/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'pdm',
          label: 'Public Domain Mark',
          url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'cmpdynkc',
      title:
        "A woman's example: and a nation's work : A tribute to Florence Nightingale / [Frederick Milnes Edge].",
      type: 'Work',
    },
    aspectRatio: 0.63,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/L0048835/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'pdm',
        label: 'Public Domain Mark',
        url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#d5cdbc',
    id: 'aebtqwby',
    type: 'Image',
  },
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/L0078256/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'cc-by',
          label: 'Attribution 4.0 International (CC BY 4.0)',
          url: 'http://creativecommons.org/licenses/by/4.0/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'uwed88df',
      title: 'Oversize ephemera : Medical songs 3.',
      type: 'Work',
    },
    aspectRatio: 0.75,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/L0078256/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'cc-by',
        label: 'Attribution 4.0 International (CC BY 4.0)',
        url: 'http://creativecommons.org/licenses/by/4.0/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#c4b29c',
    id: 'aegz5w4d',
    type: 'Image',
  },
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/L0014569/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'pdm',
          label: 'Public Domain Mark',
          url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'pdr4x6bp',
      title:
        "Crimean War: Florence Nightingale and Mr Bracebridge at Cathcart's Hill burial ground. Tinted lithograph after W. Simpson.",
      type: 'Work',
    },
    aspectRatio: 1.3605442,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/L0014569/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'pdm',
        label: 'Public Domain Mark',
        url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#afafaf',
    id: 'anwfbufu',
    type: 'Image',
  },
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/V0004314/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'pdm',
          label: 'Public Domain Mark',
          url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'zv27yedw',
      title:
        'Florence Nightingale. Reproduction of wood engraving, 1872, after T. Cole after Goodman, 1858.',
      type: 'Work',
    },
    aspectRatio: 0.69,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/V0004314/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'pdm',
        label: 'Public Domain Mark',
        url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#888781',
    id: 'auxg2jxw',
    type: 'Image',
  },
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/V0006578/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'pdm',
          label: 'Public Domain Mark',
          url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'rfuspvn9',
      title: 'Florence Nightingale. Coloured lithograph.',
      type: 'Work',
    },
    aspectRatio: 1.2578616,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/V0006578/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'pdm',
        label: 'Public Domain Mark',
        url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#584a36',
    id: 'avgsbjh5',
    type: 'Image',
  },
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/L0078291/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'cc-by',
          label: 'Attribution 4.0 International (CC BY 4.0)',
          url: 'http://creativecommons.org/licenses/by/4.0/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'uwed88df',
      title: 'Oversize ephemera : Medical songs 3.',
      type: 'Work',
    },
    aspectRatio: 0.7175,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/L0078291/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'cc-by',
        label: 'Attribution 4.0 International (CC BY 4.0)',
        url: 'http://creativecommons.org/licenses/by/4.0/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#c2baa8',
    id: 'avmppmny',
    type: 'Image',
  },
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/L0078306/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'cc-by',
          label: 'Attribution 4.0 International (CC BY 4.0)',
          url: 'http://creativecommons.org/licenses/by/4.0/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'uwed88df',
      title: 'Oversize ephemera : Medical songs 3.',
      type: 'Work',
    },
    aspectRatio: 0.76,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/L0078306/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'cc-by',
        label: 'Attribution 4.0 International (CC BY 4.0)',
        url: 'http://creativecommons.org/licenses/by/4.0/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#cdbca2',
    id: 'awar93qt',
    type: 'Image',
  },
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/V0004315/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'pdm',
          label: 'Public Domain Mark',
          url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'j69ccyja',
      title: 'Florence Nightingale. Lithograph, 1854.',
      type: 'Work',
    },
    aspectRatio: 1.3422819,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/V0004315/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'pdm',
        label: 'Public Domain Mark',
        url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#ab9b84',
    id: 'aznm4zhn',
    type: 'Image',
  },
  {
    locations: [
      {
        url: 'https://iiif.wellcomecollection.org/image/L0078288/info.json',
        credit: 'Wellcome Collection',
        license: {
          id: 'cc-by',
          label: 'Attribution 4.0 International (CC BY 4.0)',
          url: 'http://creativecommons.org/licenses/by/4.0/',
          type: 'License',
        },
        accessConditions: [
          {
            method: {
              id: 'view-online',
              label: 'View online',
              type: 'AccessMethod',
            },
            status: {
              id: 'open',
              label: 'Open',
              type: 'AccessStatus',
            },
            type: 'AccessCondition',
          },
        ],
        locationType: {
          id: 'iiif-image',
          label: 'IIIF Image API',
          type: 'LocationType',
        },
        type: 'DigitalLocation',
      },
    ],
    source: {
      id: 'uwed88df',
      title: 'Oversize ephemera : Medical songs 3.',
      type: 'Work',
    },
    aspectRatio: 0.7175,
    thumbnail: {
      url: 'https://iiif.wellcomecollection.org/image/L0078288/info.json',
      credit: 'Wellcome Collection',
      license: {
        id: 'cc-by',
        label: 'Attribution 4.0 International (CC BY 4.0)',
        url: 'http://creativecommons.org/licenses/by/4.0/',
        type: 'License',
      },
      accessConditions: [
        {
          method: {
            id: 'view-online',
            label: 'View online',
            type: 'AccessMethod',
          },
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      locationType: {
        id: 'iiif-image',
        label: 'IIIF Image API',
        type: 'LocationType',
      },
      type: 'DigitalLocation',
    },
    averageColor: '#987e69',
    id: 'b9ysc8nf',
    type: 'Image',
  },
];

const meta: Meta<typeof ScrollableGallery> = {
  title: 'Components/ScrollableGallery',
  component: ScrollableGallery,
  args: {
    label: 'Hello there, this is some text',
    images: mockImages,
  },
};

export default meta;

type Story = StoryObj<typeof ScrollableGallery>;

export const Basic: Story = {
  name: 'ScrollableGallery',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={ScrollableGallery}
      args={args}
      Readme={Readme}
    />
  ),
};
