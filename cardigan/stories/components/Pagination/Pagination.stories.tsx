import { Meta, StoryObj } from '@storybook/react';

import Pagination from '@weco/content/components/Pagination/Pagination';

const Template = args => (
  <div
    style={{
      padding: '10px',
      backgroundColor: args.hasDarkBg ? 'black' : 'transparent',
      color: args.hasDarkBg ? 'white' : 'black',
    }}
  >
    <Pagination {...args} ariaLabel="Cardigan pagination" />
  </div>
);

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  render: Template,
  argTypes: {
    totalPages: {
      options: [5, 10, 250],
      control: { type: 'radio' },
    },
    hasDarkBg: { control: 'boolean' },
    ariaLabel: {
      table: {
        disable: true,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Start: Story = {
  name: 'Start',
  args: {
    totalPages: 10,
    hasDarkBg: false,
    isHiddenMobile: false,
  },
  argTypes: {
    totalPages: {
      options: ['auto', 5, 10, 250],
    },
  },
};

export const Midway: Story = {
  name: 'Midway or end',
  args: {
    totalPages: 10,
    hasDarkBg: false,
    isHiddenMobile: false,
  },
  parameters: {
    nextjs: {
      router: {
        query: {
          page: '5',
        },
      },
    },
  },
};
