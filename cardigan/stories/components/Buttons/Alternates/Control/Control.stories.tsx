import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { arrow, chevron, cross, rotateRight } from '@weco/common/icons';
import Control, { ButtonProps } from '@weco/common/views/components/Control';
import ControlReadme from '@weco/common/views/components/Control/README.mdx';

const meta: Meta<ButtonProps> = {
  title: 'Components/Buttons/Alternates/Control',
  args: {
    text: 'something for screenreaders',
    icon: chevron,
    colorScheme: 'light',
  },
  argTypes: {
    text: { control: 'text', name: 'Text for screenreaders' },
    icon: {
      control: 'select',
      options: ['cross', 'arrow', 'rotateRight'],
      mapping: { cross, arrow, rotateRight },
      name: 'Icon',
    },
    colorScheme: {
      control: 'select',
      options: ['light', 'dark', 'on-black', 'black-on-white'],
      name: 'Color scheme',
    },
  },
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Basic: Story = {
  name: 'Control',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={Control}
      args={args}
      Readme={ControlReadme}
    />
  ),
};
