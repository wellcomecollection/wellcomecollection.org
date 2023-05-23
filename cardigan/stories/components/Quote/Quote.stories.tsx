import Quote from '@weco/content/components/Quote/Quote';
import { quote } from '@weco/cardigan/stories/content';
import Readme from '@weco/content/components/Quote/README.md';
import { ReadmeDecorator } from '@weco/cardigan/config/decorators';

const Template = args => (
  <ReadmeDecorator WrappedComponent={Quote} args={args} Readme={Readme} />
);
export const block = Template.bind({});
block.args = {
  text: quote().text,
  citation: quote().citation,
  isPullOrReview: false,
};
block.storyName = 'Quote';
block.parameters = { chromatic: { viewports: [375, 1200] } };

export const pullOrReview = Template.bind({});
pullOrReview.args = {
  text: quote().text,
  citation: quote().citation,
  isPullOrReview: true,
};
pullOrReview.storyName = 'Pull/Review';
pullOrReview.parameters = { chromatic: { viewports: [375, 1200] } };
