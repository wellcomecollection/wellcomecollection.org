import { storiesOf } from '@storybook/react';
import Rating from '../../../common/views/components/Rating/Rating';
import Readme from '../../../common/views/components/Rating/README.md';

const stories = storiesOf('Components', module);

const ratings = [
  { value: 1, text: 'Not relevant' },
  { value: 2, text: 'Somewhat relevant' },
  { value: 3, text: 'Relevant' },
  { value: 4, text: 'Very relevant' },
];

const RatingExample = () => {
  return <Rating ratings={ratings} />;
};

stories.add('Rating', RatingExample, {
  readme: { sidebar: Readme },
});
