import ImagePlaceholder from '@weco/content/components/ImagePlaceholder/ImagePlaceholder';

const Template = args => <ImagePlaceholder {...args} />;
export const basic = Template.bind({});
basic.args = {
  color: 'accent.blue',
};
basic.storyName = 'ImagePlaceholder';
