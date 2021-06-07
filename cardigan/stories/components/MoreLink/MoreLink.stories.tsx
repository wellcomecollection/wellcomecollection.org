import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';

const Template = args => <MoreLink {...args} />;
export const basic = Template.bind({});
basic.args = {
  url: '#',
  name: 'View all exhibitions',
};
basic.storyName = 'MoreLink';
