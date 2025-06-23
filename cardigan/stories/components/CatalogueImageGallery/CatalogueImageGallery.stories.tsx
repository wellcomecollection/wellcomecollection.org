import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import mockImages from '@weco/cardigan/stories/components/CatalogueImageGallery/mock-images';
import CatalogueImageGalleryScrollable from '@weco/content/components/CatalogueImageGallery/CatalogueImageGallery.Scrollable';
import Readme from '@weco/content/components/CatalogueImageGallery/README.mdx';

const meta: Meta = {
  title: 'Components/CatalogueImageGallery',
  component: CatalogueImageGalleryScrollable,
  args: {
    label: 'Hello there, this is some text',
    imageCount: 10,
  },
  argTypes: {
    imageCount: {
      control: 'select',
      options: [1, 2, 5, 10],
    },
    images: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CatalogueImageGalleryScrollable>;

export const Basic: Story = {
  name: 'CatalogueImageGallery',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={args => (
        <div
          style={{
            padding: '48px',
            background: '#323232',
          }}
        >
          <CatalogueImageGalleryScrollable
            label={args.label}
            images={mockImages.slice(0, args.imageCount)}
          />
        </div>
      )}
      args={args}
      Readme={Readme}
    />
  ),
};
