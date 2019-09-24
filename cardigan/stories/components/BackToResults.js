import { storiesOf } from '@storybook/react';
import BackToResults from '../../../common/views/components/BackToResults/BackToResults';
import { text } from '@storybook/addon-knobs/react';
import Readme from '../../../common/views/components/BackToResults/README.md';
import Router from 'next/router';

const BackToResultsExample = () => {
  const rejectedPromise = () => {
    // Needed by Link.linkClicked
    return new Promise((resolve, reject) => reject(new Error('mock')));
  };

  Router.router = {
    push: rejectedPromise,
    query: { query: text('Search query', 'darwin') },
  };

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

  return <BackToResults nextLink={nextLink} />;
};

const stories = storiesOf('Components', module);
stories.add('BackToResults', BackToResultsExample, {
  readme: { sidebar: Readme },
});
