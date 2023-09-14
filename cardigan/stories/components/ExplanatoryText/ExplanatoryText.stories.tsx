import ExplanatoryText from '@weco/content/components/WorkDetails/ExplanatoryText';
import { singleLineOfText } from '@weco/cardigan/stories/content';

const Template = args => <ExplanatoryText {...args} />;
export const basic = Template.bind({});
basic.args = {
  id: 'test',
  controlText: { closedText: 'Show me more', openedText: 'Show me less' },
  children: <p style={{ marginTop: '30px' }}>{singleLineOfText()}</p>,
};
basic.storyName = 'ExplanatoryText';
