import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import ImagePlaceholder from '@weco/content/views/components/ImagePlaceholder';
import Readme from '@weco/content/views/components/ImagePlaceholder/README.mdx';

const meta: Meta<typeof ImagePlaceholder> = {
  title: 'Components/Images/ImagePlaceholder',
  component: ImagePlaceholder,
  args: {
    backgroundColor: 'accent.blue',
  },
  argTypes: {
    backgroundColor: {
      name: 'Background color',
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

const WrappedPlaceholder = args => {
  return (
    <div style={{ maxWidth: '400px' }}>
      <ImagePlaceholder {...args} />
    </div>
  );
};

export const Basic: Story = {
  name: 'ImagePlaceholder',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={WrappedPlaceholder}
      args={args}
      Readme={Readme}
    />
  ),
};
