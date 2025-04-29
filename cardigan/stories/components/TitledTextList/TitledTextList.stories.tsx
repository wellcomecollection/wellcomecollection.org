import { RichTextField } from '@prismicio/client';
import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import Readme from '@weco/content/components/TitledTextList/README.mdx';
import TitledTextList from '@weco/content/components/TitledTextList';
const items = [
  {
    title: '17th-18th century Burney Collection newspapers',
    text: [
      {
        type: 'paragraph',
        text: 'The newspapers and news pamphlets, gathered by the Reverend Charles Burney (1757-1817) include more than 1,000 pamphlets, proclamations, newsbooks and newspapers from the period. Hosted by the British Library.',
        spans: [],
      },
    ] as RichTextField,
    link: 'https://wellcomecollection.org',
    label: {
      id: 'YCVHBBUAACgAUxW0',
      title: 'Online',
    },
  },
  {
    title: '19th century British Library newspapers',
    text: [
      {
        type: 'paragraph',
        text: 'A selectio of 19th-century national and local British newspapers held by the British Library. All newsparpers are full text and fully searchable, with full runs of the publication where possible.',
        spans: [],
      },
    ] as RichTextField,
    link: 'https://bbc.co.uk',
    label: {
      id: 'YCVHKRUAACoAUxXw',
      title: 'In library',
    },
  },
];

const meta: Meta<typeof TitledTextList> = {
  title: 'Components/TitledTextList',
  component: TitledTextList,
  args: {
    items,
  },
};

export default meta;

type Story = StoryObj<typeof TitledTextList>;

export const Basic: Story = {
  name: 'TitledTextList',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={TitledTextList}
      args={args}
      Readme={Readme}
    />
  ),
};
