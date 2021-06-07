import Message from '@weco/common/views/components/Message/Message';

const Template = args => <Message {...args} />;
export const basic = Template.bind({});
basic.args = {
  text: 'Just turn up',
};
basic.storyName = 'Message';
