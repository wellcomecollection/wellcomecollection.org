import { storiesOf } from '@storybook/react';
import WorkTags from '../../../common/views/components/WorkTags/WorkTags';
import Readme from '../../../common/views/components/WorkTags/README.md';

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
    query: 'test',
    textParts: ['Medical illustration'],
    linkAttributes: nextLink,
  },
  {
    query: 'test',
    textParts: ['Dentistry', 'History'],
    linkAttributes: nextLink,
  },
  {
    query: 'test',
    textParts: ['Teeth', 'Care and hygiene', 'History', 'Pictorial works'],
    linkAttributes: nextLink,
  },
];

const stories = storiesOf('Components', module);
stories.add('WorkTags', () => <WorkTags tags={tags} />, { info: Readme });
