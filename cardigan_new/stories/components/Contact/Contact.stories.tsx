import type { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan_new/config/decorators';
import Contact from '@weco/content/components/Contact/Contact';
import Readme from '@weco/content/components/Contact/README.mdx';

const meta: Meta<typeof Contact> = {
  title: 'Components/Contact',
  component: Contact,
  args: {
    title: 'Joe Bloggs',
    subtitle: 'Head of Examples',
    phone: '+44 (0)20 7444 4444',
    email: 'j.bloggs@wellcome.ac.uk',
  },
};

export default meta;

type Story = StoryObj<typeof Contact>;

export const Basic: Story = {
  name: 'Contact',
  render: args => (
    <ReadmeDecorator WrappedComponent={Contact} args={args} Readme={Readme} />
  ),
};
