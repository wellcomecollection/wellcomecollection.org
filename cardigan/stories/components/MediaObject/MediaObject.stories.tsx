import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { imageWithCrops } from '@weco/cardigan/stories/data/images';
import { mockData } from '@weco/common/test/fixtures/components/media-object';
import { MediaObject } from '@weco/content/components/MediaObject/MediaObject';
import Readme from '@weco/content/components/MediaObject/README.md';

const Template = args => (
  <ReadmeDecorator WrappedComponent={MediaObject} args={args} Readme={Readme} />
);
export const basic = Template.bind({});
basic.args = {
  title: mockData.title,
  text: mockData.text,
  image: imageWithCrops,
};
basic.storyName = 'MediaObject';
