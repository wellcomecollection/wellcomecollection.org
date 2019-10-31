import { storiesOf } from '@storybook/react';
import OptIn from '../../../common/views/components/OptIn/OptIn';
import Readme from '../../../common/views/components/OptIn/README.md';

const stories = storiesOf('Components', module);

const temp = {
  text: {
    defaultMessage: [
      'Help us improve your search results.',
      'Rate your search results by how relevant they are to you.',
    ],
    optedInMessage: ['Currently rating search results.'],
    optInCTA: 'Rate your results',
    optOutCTA: 'No thanks',
  },
  cookieName: 'toggle_relevanceRating',
};

const OptInExample = () => {
  return <OptIn text={temp.text} cookieName={temp.cookieName} />;
};

stories.add('OptIn', OptInExample, {
  readme: { sidebar: Readme },
});
