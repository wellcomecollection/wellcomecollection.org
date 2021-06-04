import ImageGallery from '@weco/common/views/components/ImageGallery/ImageGallery';
import { captionedImage } from '../../content';

const images = [...new Array(5)].map(_ => captionedImage());

const Template = args => <ImageGallery {...args} />;
export const inline = Template.bind({});
inline.args = {
  items: images,
  id: 'test',
  isStandalone: false,
};
export const standalone = Template.bind({});
standalone.args = {
  items: images,
  id: 'test',
  isStandalone: true,
};
