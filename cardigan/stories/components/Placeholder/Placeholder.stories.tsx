import Placeholder from '@weco/common/views/components/Placeholder/Placeholder';

const Template = args => <Placeholder {...args} />;
export const basic = Template.bind({});
basic.args = {
  isLoading: true,
  nRows: 1,
};
basic.storyName = 'Placeholder';
