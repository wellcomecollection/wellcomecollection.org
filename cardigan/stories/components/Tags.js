import { storiesOf } from '@storybook/react';
import Tags from '../../../common/views/components/Tags/Tags';
import Readme from '../../../common/views/components/Tags/README.md';

const TagsExample = () => {
  return <Tags tags={[
    {text: 'Quacks', url: '#'},
    {text: 'James Gillray', url: '#'}
  ]} />;
};

const stories = storiesOf('Components', module);
stories
  .add('Tags', TagsExample, {info: Readme});
