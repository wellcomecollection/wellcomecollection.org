import { storiesOf } from '@storybook/react';
import Readme from '../../../common/views/components/Auth/README.md';

const stories = storiesOf('Components', module);

const AuthExample = () => {
  // TODO: figure out how to demonstrate this in Cardigan
  return <p>Needs NextJS to render</p>;
};

stories.add('Auth', AuthExample, {
  readme: { sidebar: Readme },
});
