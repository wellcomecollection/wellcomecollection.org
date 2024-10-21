import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { CopyUrl } from '@weco/content/components/CopyButtons';
import Readme from '@weco/content/components/CopyButtons/README.mdx';

const meta: Meta<typeof CopyUrl> = {
  title: 'Components/Buttons/Alternates/CopyUrl',
  component: CopyUrl,
  args: {
    url: 'https://wellcomecollection.org/works/t59c279p',
  },
};

export default meta;

type Story = StoryObj<typeof CopyUrl>;

export const Basic: Story = {
  name: 'CopyUrl',
  render: args => (
    <ReadmeDecorator WrappedComponent={CopyUrl} args={args} Readme={Readme} />
  ),
};
