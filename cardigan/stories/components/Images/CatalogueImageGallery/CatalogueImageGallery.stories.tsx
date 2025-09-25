import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { Container } from '@weco/common/views/components/styled/Container';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';
import Readme from '@weco/content/views/components/CatalogueImageGallery/README.mdx';

import mockImages from './mock-images';

const meta: Meta = {
  title: 'Components/Images/CatalogueImageGallery',
  component: CatalogueImageGallery,
  args: {
    variant: 'scrollable',
    label: 'Hello there, this is some text',
    imageCount: 10,
    scrollButtonsAfter: false,
  },
  argTypes: {
    label: { name: 'Label', control: 'text' },
    imageCount: {
      name: 'Number of images',
      control: 'select',
      options: [1, 2, 5, 10],
    },
    variant: {
      name: 'Variant',
      control: 'select',
      options: ['scrollable', 'justified'],
    },
    scrollButtonsAfter: {
      name: 'Scroll buttons after images',
      control: 'boolean',
      if: { arg: 'variant', eq: 'scrollable' },
    },
    images: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof CatalogueImageGallery>;

export const Basic: Story = {
  args: {
    variant: 'scrollable',
  },
  name: 'CatalogueImageGallery',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={args => (
        <Container
          style={{
            padding:
              args.variant === 'scrollable' ? '48px 0 48px 48px' : undefined,
            margin: args.variant === 'scrollable' ? '0' : undefined,
            background: '#323232',
          }}
        >
          <CatalogueImageGallery
            {...args}
            images={mockImages.slice(0, args.imageCount)}
          />
        </Container>
      )}
      args={args}
      Readme={Readme}
    />
  ),
};
