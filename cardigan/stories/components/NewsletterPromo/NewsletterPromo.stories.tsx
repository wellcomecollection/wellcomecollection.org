import { Meta, StoryObj } from '@storybook/react';

import NewsletterPromo from '@weco/common/views/components/NewsletterPromo';

const meta: Meta<typeof NewsletterPromo> = {
  title: 'Components/NewsletterPromo',
  component: NewsletterPromo,
};

export default meta;

type Story = StoryObj<typeof NewsletterPromo>;

export const Basic: Story = {
  name: 'NewsletterPromo',
};
