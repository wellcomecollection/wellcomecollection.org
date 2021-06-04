import ExplanatoryText from '@weco/common/views/components/ExplanatoryText/ExplanatoryText';
import { singleLineOfText } from '../../content';

const Template = args => <ExplanatoryText {...args} />;
export const basic = Template.bind({});
basic.args = {
  id: 'test',
  controlText: 'Show me more',
  children: <p style={{ marginTop: '30px' }}>{singleLineOfText(10, 20)}</p>,
};
basic.storyName = 'ExplanatoryText';
