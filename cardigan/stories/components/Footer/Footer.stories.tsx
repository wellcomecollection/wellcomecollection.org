import Footer from '@weco/common/views/components/Footer/Footer';
import { openingTimes } from '@weco/common/test/fixtures/components/opening-times';

const Template = args => <Footer {...args} />;
export const basic = Template.bind({});
basic.args = {
  openingTimes,
};
basic.storyName = 'Footer';
