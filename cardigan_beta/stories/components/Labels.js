import { storiesOf } from '@storybook/react';
import Labels from '../../../common/views/components/Labels/Labels';

const stories = storiesOf('Components', module);
stories
  .add('Labels', () => <Labels labels={['Gallery tour', 'Audio described']} />);
