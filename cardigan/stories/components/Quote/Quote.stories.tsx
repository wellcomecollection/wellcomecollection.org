import Quote from '@weco/common/views/components/Quote/Quote';
import { quote } from '../../content';

const Template = args => <Quote {...args} />;
export const block = Template.bind({});
block.args = {
  text: quote().text,
  citation: quote().citation,
  isPullOrReview: false,
};
block.storyName = 'Quote';

export const pullOrReview = Template.bind({});
pullOrReview.args = {
  text: quote().text,
  citation: quote().citation,
  isPullOrReview: true,
};
pullOrReview.storyName = 'Pull/Review';
