import { storiesOf } from '@storybook/react';
import Outro from '../../../common/views/components/Outro/Outro';
import Readme from '../../../common/views/components/Outro/README.md';

const OutroExample = () => {
  return <Outro />;
};

const stories = storiesOf('Components', module);
stories
  .add('Outro', OutroExample, {info: Readme});
