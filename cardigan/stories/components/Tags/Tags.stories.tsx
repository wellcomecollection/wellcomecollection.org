import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import Tags from '@weco/content/views/components/Tags';
import Readme from '@weco/content/views/components/Tags/README.mdx';

type StoryProps = ComponentProps<typeof Tags> & {
  numberOfTags: number;
};

const linkAttributes = {
  href: {
    pathname: '/search/works',
    query: { query: 'sun', page: 2 },
  },
  as: {
    pathname: '/search/works',
    query: { query: 'sun', page: 2 },
  },
};

const tagPool = [
  ['Medical illustration'],
  ['Dentistry', 'History'],
  ['Teeth', 'Care and hygiene', 'History', 'Pictorial works'],
  ['Bacteriology'],
  ['Blood transfusion'],
  ['Delivery of health care'],
  ['Hospitals', 'Military'],
  ['Nursing'],
  ['Nutrition'],
  ['Ophthalmologic surgical procedures'],
  ['Tropical medicine'],
  ['Women in medicine'],
].map(textParts => ({ textParts, linkAttributes }));

const meta: Meta<StoryProps> = {
  title: 'Components/Tags',
  component: Tags,
  args: {
    tags: tagPool,
    numberOfTags: 12,
    maxVisible: 10,
    showAllText: 'Show all subjects',
    showLessText: 'Show less subjects',
    isFirstPartBold: false,
    separator: '–',
  },
  argTypes: {
    tags: { table: { disable: true } },
    buttonColors: { table: { disable: true } },
    numberOfTags: {
      name: 'Number of tags',
      control: { type: 'range', min: 1, max: 12 },
    },
    maxVisible: {
      name: 'Tags shown before the reveal control',
      control: { type: 'range', min: 1, max: 12 },
    },
    showAllText: { name: 'Reveal control label', control: 'text' },
    showLessText: { name: 'Collapse control label', control: 'text' },
    isFirstPartBold: { name: 'First part bold', control: 'boolean' },
    separator: { name: 'Separator character', control: 'text' },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Basic: Story = {
  name: 'Tags',
  render: ({ numberOfTags, ...args }) => (
    <ReadmeDecorator
      WrappedComponent={Tags}
      args={{ ...args, tags: args.tags.slice(0, numberOfTags) }}
      Readme={Readme}
    />
  ),
};
