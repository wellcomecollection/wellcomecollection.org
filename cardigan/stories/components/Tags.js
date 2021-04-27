import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import Tags from '../../../common/views/components/Tags/Tags';
import Readme from '../../../common/views/components/Tags/README.md';

const nextLink = {
  href: {
    pathname: '/works',
    query: {
      query: 'sun',
      page: 2,
    },
  },
  as: {
    pathname: '/works',
    query: {
      query: 'sun',
      page: 2,
    },
  },
};

const tags = [
  {
    textParts: ['Medical illustration'],
    linkAttributes: nextLink,
  },
  {
    textParts: ['Dentistry', 'History'],
    linkAttributes: nextLink,
  },
  {
    textParts: ['Teeth', 'Care and hygiene', 'History', 'Pictorial works'],
    linkAttributes: nextLink,
  },
];

const stories = storiesOf('Components', module);
stories.add(
  'Tags',
  () => {
    const isFirstPartBold = boolean('first part bold', true);
    return <Tags tags={tags} isFirstPartBold={isFirstPartBold} />;
  },
  {
    readme: { sidebar: Readme },
  }
);
