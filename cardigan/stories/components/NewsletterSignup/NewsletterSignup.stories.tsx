import { Meta, StoryObj } from '@storybook/react';

import NewsletterSignup from '@weco/content/components/NewsletterSignup';

const meta: Meta<typeof NewsletterSignup> = {
  title: 'Components/NewsletterSignup',
  component: NewsletterSignup,
};

export default meta;

type Story = StoryObj<typeof NewsletterSignup>;

export const Basic: Story = {
  name: 'NewsletterSignup',
};
