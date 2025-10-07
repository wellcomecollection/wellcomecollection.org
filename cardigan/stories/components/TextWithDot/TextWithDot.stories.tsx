import { Meta, StoryObj } from '@storybook/react';

import TextWithDot from '@weco/content/views/components/TextWithDot';

const meta: Meta<typeof TextWithDot> = {
  title: 'Components/TextWithDot',
  component: TextWithDot,
  args: {
    dotColor: 'black',
    text: 'This is some text',
  },
  argTypes: {
    text: { name: 'Text' },
    dotColor: {
      control: {
        type: 'select',
      },
      options: [
        'black',
        'accent.blue',
        'accent.purple',
        'accent.green',
        'accent.salmon',
        'neutral.300',
      ],
      name: 'Dot color',
    },
    className: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof TextWithDot>;

export const Basic: Story = {
  name: 'TextWithDot',
  render: args => <TextWithDot {...args} />,
};
