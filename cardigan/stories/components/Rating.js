import { storiesOf } from '@storybook/react';
import Rating from '../../../common/views/components/Rating/Rating';
import Readme from '../../../common/views/components/Rating/README.md';

const stories = storiesOf('Components', module);

const ratings = [
  { value: 1, text: 'not relevant' },
  { value: 2, text: 'somewhat relevant' },
  { value: 3, text: 'relevant' },
  { value: 4, text: 'very relevant' },
];

const RatingExample = () => {
  return <Rating ratings={ratings} />;
};

stories.add('Rating', RatingExample, {
  readme: { sidebar: Readme },
});
