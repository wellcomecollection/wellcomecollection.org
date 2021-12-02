import ImagePlaceholder from '@weco/common/views/components/ImagePlaceholder/ImagePlaceholder';

const Template = args => <ImagePlaceholder {...args} />;
export const basic = Template.bind({});
basic.args = {
  color: 'teal',
};
basic.storyName = 'ImagePlaceholder';
