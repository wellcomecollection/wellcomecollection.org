import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import Placeholder from '@weco/content/components/Placeholder';
import Readme from '@weco/content/components/Placeholder/README.mdx';

const meta: Meta<typeof Placeholder> = {
  title: 'Components/Placeholder',
  component: Placeholder,
  args: {
    isLoading: true,
    nRows: 1,
  },
};

export default meta;

type Story = StoryObj<typeof Placeholder>;

export const Basic: Story = {
  name: 'Placeholder',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={Placeholder}
      args={args}
      Readme={Readme}
    />
  ),
};
