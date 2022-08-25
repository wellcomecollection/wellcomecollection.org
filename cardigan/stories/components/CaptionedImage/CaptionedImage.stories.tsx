import CaptionedImage from '@weco/content/components/CaptionedImage/CaptionedImage';
import { captionedImage } from '../../content';

const Template = args => <CaptionedImage {...args} />;
export const basic = Template.bind({});

basic.args = {
  ...captionedImage(),
};
basic.storyName = 'CaptionedImage';
