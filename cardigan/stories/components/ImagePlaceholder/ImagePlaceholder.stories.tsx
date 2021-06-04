import ImagePlaceholder from '@weco/common/views/components/ImagePlaceholder/ImagePlaceholder';

const Template = args => <ImagePlaceholder {...args} />;
export const basic = Template.bind({});
basic.args = {
  color: 'turquoise',
};
basic.storyName = 'ImagePlaceholder';
