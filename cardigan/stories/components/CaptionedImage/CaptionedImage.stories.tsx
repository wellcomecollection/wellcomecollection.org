import { CaptionedImage } from '@weco/common/views/components/Images/Images';
import { captionedImage } from '../../content';

const Template = args => <CaptionedImage {...args} />;
export const basic = Template.bind({});

basic.args = {
  ...captionedImage(),
};
basic.storyName = 'CaptionedImage';
