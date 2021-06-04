import MessageBar from '@weco/common/views/components/MessageBar/MessageBar';

const Template = args => <MessageBar {...args} />;
export const basic = Template.bind({});
basic.args = {
  tagText: 'Smoke test',
  children: (
    <>
      Things may not always be what they seem.
      <a href="/works/progress">Find out more</a>.
    </>
  ),
};
basic.storyName = 'MessageBar';
