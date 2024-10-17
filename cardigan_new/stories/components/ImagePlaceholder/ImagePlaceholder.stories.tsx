import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan_new/config/decorators';
import ImagePlaceholder from '@weco/content/components/ImagePlaceholder/ImagePlaceholder';
import Readme from '@weco/content/components/ImagePlaceholder/README.mdx';

const meta: Meta<typeof ImagePlaceholder> = {
  title: 'Components/ImagePlaceholder',
  component: ImagePlaceholder,
  args: {
    backgroundColor: 'accent.blue',
  },
  argTypes: {
    backgroundColor: {
      control: 'select',
      options: [
        'accent.blue',
        'accent.salmon',
        'accent.purple',
        'accent.green',
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ImagePlaceholder>;

export const Basic: Story = {
  name: 'ImagePlaceholder',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={ImagePlaceholder}
      args={args}
      Readme={Readme}
    />
  ),
};
