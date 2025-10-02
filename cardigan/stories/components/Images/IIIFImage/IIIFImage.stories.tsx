import { Meta, StoryObj } from '@storybook/react';

import IIIFImage from '@weco/content/views/components/IIIFImage';

const meta: Meta<typeof IIIFImage> = {
  title: 'Components/Images/IIIFImage',
  component: IIIFImage,
  args: {
    image: {
      contentUrl:
        'https://iiif.wellcomecollection.org/image/V0043039/info.json',
      width: 300,
      height: 300,
      alt: 'image of trees',
    },
    width: 400,
    layout: 'fixed',
  },
  argTypes: {
    image: { table: { disable: true } },
    priority: { table: { disable: true } },
    onLoadingComplete: { table: { disable: true } },
    sizes: { table: { disable: true } },
    layout: { control: 'radio', options: ['raw', 'fixed'] },
    background: { control: 'color', name: 'Background color (shown on load)' },
    width: {
      control: 'number',
      name: 'Width of requested image',
    },
  },
};

export default meta;

type Story = StoryObj<typeof IIIFImage>;

export const Basic: Story = {
  name: 'IIIFImage',
  render: args => (
    <div style={{ maxWidth: 400 }}>
      <IIIFImage {...args} />
    </div>
  ),
};
