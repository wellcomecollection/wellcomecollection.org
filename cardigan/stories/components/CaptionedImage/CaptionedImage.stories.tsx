import { captionedImage } from '@weco/cardigan/stories/data/images';
import CaptionedImage from '@weco/content/components/CaptionedImage/CaptionedImage';

const Template = args => <CaptionedImage {...args} />;
export const basic = Template.bind({});

basic.args = captionedImage();
basic.storyName = 'CaptionedImage';
