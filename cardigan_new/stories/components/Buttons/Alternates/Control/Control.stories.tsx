import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan_new/config/decorators';
import { chevron } from '@weco/common/icons';
import Control, { ButtonProps } from '@weco/common/views/components/Control';
import ControlReadme from '@weco/common/views/components/Control/README.mdx';

const meta: Meta<ButtonProps> = {
  title: 'Components/Buttons/Alternates/Control',
  args: {
    text: 'something for screenreaders',
    icon: chevron,
    colorScheme: 'light',
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
