import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import Message from '@weco/content/components/Message/Message';
import Readme from '@weco/content/components/Message/README.md';

const Template = args => (
  <ReadmeDecorator WrappedComponent={Message} args={args} Readme={Readme} />
);
export const basic = Template.bind({});
basic.args = {
  text: 'Just turn up',
};
basic.storyName = 'Message';
