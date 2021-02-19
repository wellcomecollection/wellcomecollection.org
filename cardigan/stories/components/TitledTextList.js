import { storiesOf } from '@storybook/react';
import TitledTextList from '../../../common/views/components/TitledTextList/TitledTextList';
import Readme from '../../../common/views/components/TitledTextList/README.md';

const items = [
  {
    title: '17th-18th century Burney Collection newspapers',
    text: [
      {
        type: 'paragraph',
        text:
          'The newspapers and news pamphlets, gathered by the Reverend Charles Burney (1757-1817) include more than 1,000 pamphlets, proclamations, newsbooks and newspapers from the period. Hosted by the British Library.',
        spans: [],
      },
    ],
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
        text:
          'A selectio of 19th-century national and local British newspapers held by the British Library. All newsparpers are full text and fully searchable, with full runs of the publication where possible.',
        spans: [],
      },
    ],
    link: 'https://bbc.co.uk',
    label: {
      id: 'YCVHKRUAACoAUxXw',
      title: 'In library',
    },
  },
];

const TitledTextListExample = () => {
  return <TitledTextList items={items} />;
};
const stories = storiesOf('Components', module);
stories.add('TitledTextList', TitledTextListExample, { readme: { sidebar: Readme } });
