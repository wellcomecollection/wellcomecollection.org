import { Meta, StoryObj } from '@storybook/react';

import {
  defaultSerializer,
  dropCapSerializer,
} from '@weco/common/views/components/HTMLSerializers';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst';

const meta: Meta<typeof PageHeaderStandfirst> = {
  title: 'Components/PageHeaderStandfirst',
  component: PageHeaderStandfirst,
  args: {
    html: [
      {
        type: 'paragraph',
        text: 'Can you help us better understand and care for the collections we hold? And help us plan for the future?',
        spans: [],
      },
    ],
    htmlSerializer: defaultSerializer,
  },
  argTypes: {
    html: { table: { disable: true } },
    htmlSerializer: {
      control: { type: 'radio' },
      options: ['default', 'dropCap'],
      name: 'HTML Serializer',
      mapping: { default: defaultSerializer, dropCap: dropCapSerializer },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PageHeaderStandfirst>;

export const Basic: Story = {
  name: 'PageHeaderStandfirst',
  render: args => <PageHeaderStandfirst {...args} />,
};
