import { Meta, StoryObj } from '@storybook/react';

import Pagination from '@weco/content/views/components/Pagination';

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
      name: 'Total pages',
      options: [5, 10, 250],
      control: { type: 'radio' },
    },
    hasDarkBg: { name: 'Has dark background', control: 'boolean' },
    ariaLabel: { table: { disable: true } },
    isHiddenMobile: { table: { disable: true } },
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
      name: 'Total pages',
      control: { type: 'select' },
      options: [1, 5, 10, 250],
    },
    isHiddenMobile: { table: { disable: true } },
  },
};

export const Midway: Story = {
  name: 'Midway or end',
  args: {
    totalPages: 10,
    hasDarkBg: false,
    isHiddenMobile: false,
  },
  argTypes: {
    isHiddenMobile: { table: { disable: true } },
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
