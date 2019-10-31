import { storiesOf } from '@storybook/react';
import Rating from '../../../common/views/components/Rating/Rating';
import Readme from '../../../common/views/components/Rating/README.md';

const stories = storiesOf('Components', module);

const RatingExample = () => {
  return <Rating clickHandler={value => window.alert(`rated this ${value}`)} />;
};

stories.add('Rating', RatingExample, {
  readme: { sidebar: Readme },
});
