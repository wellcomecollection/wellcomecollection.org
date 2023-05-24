import Label from '@weco/common/views/components/Label/Label';

const Template = args => <Label {...args} />;
export const basic = Template.bind({});
basic.args = {
  label: {
    text: 'Audio described',
  },
};
basic.storyName = 'Label';
basic.parameters = { chromatic: { viewports: [375, 1200] } };
