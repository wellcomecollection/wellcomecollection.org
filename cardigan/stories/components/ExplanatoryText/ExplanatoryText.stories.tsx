import ExplanatoryText from '@weco/catalogue/components/WorkDetails/ExplanatoryText';
import { singleLineOfText } from '@weco/cardigan/stories/content';

const Template = args => <ExplanatoryText {...args} />;
export const basic = Template.bind({});
basic.args = {
  id: 'test',
  controlText: 'Show me more',
  children: <p style={{ marginTop: '30px' }}>{singleLineOfText()}</p>,
};
basic.storyName = 'ExplanatoryText';
