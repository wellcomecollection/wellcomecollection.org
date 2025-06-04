import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import ScrollableGallery from '@weco/content/components/ScrollableGallery/ScrollableGallery';
import Readme from '@weco/content/components/ScrollableGallery/README.mdx';
import mockImages from './mock-images';

const meta: Meta = {
  title: 'Components/ScrollableGallery',
  component: ScrollableGallery,
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
      }
    },
  },
};

export default meta;

type Story = StoryObj<typeof ScrollableGallery>;

export const Basic: Story = {
  name: 'ScrollableGallery',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={args => (
        <div
          style={{
            padding: '48px',
            background: '#323232',
          }}
        >
          <ScrollableGallery
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
