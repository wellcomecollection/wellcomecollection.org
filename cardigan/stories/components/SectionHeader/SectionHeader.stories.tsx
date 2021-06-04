import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';

const Template = args => <SectionHeader {...args} />;
export const basic = Template.bind({});
basic.args = {
  title: 'You may have missed',
};
basic.storyName = 'SectionHeader';
