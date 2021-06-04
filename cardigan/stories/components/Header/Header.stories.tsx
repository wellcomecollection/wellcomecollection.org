import Header, { links } from '@weco/common/views/components/Header/Header';

const Template = args => <Header {...args} />;
export const basic = Template.bind({});
basic.args = {
  siteSection: 'stories',
  isActive: true,
  links,
};
basic.storyName = 'Header';
