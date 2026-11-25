import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import LabelsList from '@weco/common/views/components/LabelsList';

type StoryProps = ComponentProps<typeof LabelsList> & {
  numberOfLabels: number;
};

const meta: Meta<StoryProps> = {
  title: 'Components/LabelsList',
  component: LabelsList,
  args: {
    defaultLabelColor: 'yellow',
    labels: [
      { text: 'Gallery tour' },
      { text: 'Audio described' },
      { text: 'British Sign Language' },
      { text: 'Audio guides' },
      { text: 'Lorem ipsum' },
      { text: 'Dolor sit amet' },
      { text: 'Gallery tour' },
      { text: 'Audio described' },
      { text: 'British Sign Language' },
      { text: 'Audio guides' },
      { text: 'Lorem ipsum' },
      { text: 'Dolor sit amet' },
    ],
    numberOfLabels: 2,
  },
  argTypes: {
    defaultLabelColor: {
      name: 'Default label color',
    },
    labels: {
      table: {
        disable: true,
      },
    },
    numberOfLabels: {
      name: 'Number of labels',
      control: {
        type: 'range',
        min: 1,
        max: 12,
      },
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'LabelsList',
  render: args => (
    <LabelsList
      labels={args.labels.slice(0, args.numberOfLabels)}
      defaultLabelColor={args.defaultLabelColor}
    />
  ),
};
