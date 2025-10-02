import { Meta, StoryObj } from '@storybook/react';
import { themeColors } from '@weco/cardigan/.storybook/preview';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import Divider from '@weco/common/views/components/Divider';
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
      name: 'Line color',
      control: 'select',
      options: themeColors.map(c => c.name),
    },
    isStub: { name: 'Is stub line', control: 'boolean' },
  },
};
