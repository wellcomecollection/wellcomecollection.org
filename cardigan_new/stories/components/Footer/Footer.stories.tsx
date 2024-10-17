import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan_new/config/decorators';
import { venues } from '@weco/common/test/fixtures/components/venues';
import Footer from '@weco/common/views/components/Footer';
import Readme from '@weco/common/views/components/Footer/README.mdx';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  args: {
    venues,
  },
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Basic: Story = {
  name: 'Footer',
  render: args => (
    <ReadmeDecorator WrappedComponent={Footer} args={args} Readme={Readme} />
  ),
};
