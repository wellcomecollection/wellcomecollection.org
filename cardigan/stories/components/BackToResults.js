import { storiesOf } from '@storybook/react';
import BackToResults from '../../../common/views/components/BackToResults/BackToResults';
import Readme from '../../../common/views/components/BackToResults/README.md';

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

const stories = storiesOf('Components', module);
stories.add('BackToResults', () => <BackToResults nextLink={nextLink} />, {
  info: Readme,
});
