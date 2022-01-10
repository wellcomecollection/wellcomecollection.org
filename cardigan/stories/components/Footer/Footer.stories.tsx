import Footer from '@weco/common/views/components/Footer/Footer';
import { venues } from '@weco/common/test/fixtures/components/venues';

const Template = args => <Footer {...args} />;
export const basic = Template.bind({});
basic.args = {
  venues,
};
basic.storyName = 'Footer';
