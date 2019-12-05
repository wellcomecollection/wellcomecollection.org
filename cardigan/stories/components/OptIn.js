import { storiesOf } from '@storybook/react';
import OptIn from '../../../common/views/components/OptIn/OptIn';
import Readme from '../../../common/views/components/OptIn/README.md';

const stories = storiesOf('Components', module);

const OptInExample = () => {
  return <OptIn />;
};

stories.add('OptIn', OptInExample, {
  readme: { sidebar: Readme },
});
