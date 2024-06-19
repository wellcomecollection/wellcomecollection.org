import Body from '@weco/content/components/Body/Body';
import untransformedBody from '@weco/cardigan/stories/data/untransformed-body';

const Template = args => <Body {...args} />;
export const basic = Template.bind({});
basic.args = {
  untransformedBody,
};
basic.storyName = 'Body';
