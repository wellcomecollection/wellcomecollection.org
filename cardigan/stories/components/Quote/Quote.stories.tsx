import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { quote } from '@weco/cardigan/stories/data/content';
import Quote from '@weco/content/components/Quote/Quote';
import Readme from '@weco/content/components/Quote/README.md';

const Template = args => (
  <ReadmeDecorator WrappedComponent={Quote} args={args} Readme={Readme} />
);

export const basic = Template.bind({});
basic.args = {
  ...quote,
};
basic.storyName = 'Quote';
basic.argTypes = {
  isPullOrReview: {
    control: 'boolean',
    name: 'Is either a pull quote or a review',
  },
  text: {
    table: {
      disable: true,
    },
  },
  citation: {
    table: {
      disable: true,
    },
  },
};
