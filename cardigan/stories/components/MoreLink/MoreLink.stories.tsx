import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import MoreLink from '@weco/content/views/components/MoreLink';
import Readme from '@weco/content/views/components/MoreLink/README.mdx';

const meta: Meta<typeof MoreLink> = {
  title: 'Components/MoreLink',
  component: MoreLink,
  args: {
    url: '#',
    name: 'View all exhibitions',
  },
};

export default meta;

type Story = StoryObj<typeof MoreLink>;

export const Basic: Story = {
  name: 'MoreLink',
  render: args => (
    <ReadmeDecorator WrappedComponent={MoreLink} args={args} Readme={Readme} />
  ),
};
