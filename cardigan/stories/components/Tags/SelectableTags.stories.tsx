import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import SelectableTags from '@weco/content/views/components/SelectableTags';

type StoryProps = ComponentProps<typeof SelectableTags> & {
  numberOfTags: number;
};

const meta: Meta<StoryProps> = {
  title: 'Components/Tags/SelectableTags',
  component: SelectableTags,
  args: {
    tags: [
      { id: '1', label: 'Tag 1' },
      { id: '2', label: 'Tag 2' },
      { id: '3', label: 'Tag 3' },
      { id: '4', label: 'Tag 4' },
      { id: '5', label: 'Tag 5' },
      { id: '6', label: 'Tag 6' },
      { id: '7', label: 'Tag 7' },
      { id: '8', label: 'Tag 8' },
      { id: '9', label: 'Tag 9' },
      { id: '10', label: 'Tag 10' },
    ],
    isMultiSelect: false,
    numberOfTags: 3,
  },
  argTypes: {
    tags: { table: { disable: true } },
    onChange: { table: { disable: true } },
    isMultiSelect: { control: 'boolean', name: 'Allow multiple selection' },
    numberOfTags: {
      name: 'Number of tags to display',
      control: {
        type: 'range',
        min: 1,
        max: 10,
      },
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'SelectableTags',
  render: args => {
    const { tags, numberOfTags, ...rest } = args;

    return <SelectableTags tags={args.tags.slice(0, numberOfTags)} {...rest} />;
  },
};
