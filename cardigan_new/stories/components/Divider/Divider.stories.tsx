import { Meta, StoryObj } from '@storybook/react';
import { themeColors } from '@weco/cardigan_new/.storybook/preview';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import Divider from '@weco/common/views/components/Divider/Divider';
import Readme from '@weco/common/views/components/Divider/README.mdx';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  render: args => {
    return (
      <ReadmeDecorator WrappedComponent={Divider} args={args} Readme={Readme} />
    );
  },
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const Basic: Story = {
  name: 'Divider',
  args: {
    isStub: false,
    lineColor: 'black',
  },
  argTypes: {
    lineColor: {
      control: 'select',
      options: themeColors.map(c => c.name),
    },
  },
};
