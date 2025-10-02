import { Meta, StoryObj } from '@storybook/react';

import Breadcrumb from '@weco/common/views/components/Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  args: {
    noHomeLink: false,
    items: [
      {
        text: 'Content type',
        url: '/content-type',
      },
      {
        prefix: 'Part of',
        text: 'The Ambroise Paré collection',
        url: '/part-of/this',
      },
    ],
  },
  argTypes: {
    noHomeLink: {
      name: 'Remove Home link',
    },
    items: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Basic: Story = {
  name: 'Breadcrumb',
};
