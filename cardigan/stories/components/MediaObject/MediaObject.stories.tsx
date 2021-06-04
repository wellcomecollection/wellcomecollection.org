import { MediaObject } from '@weco/common/views/components/MediaObject/MediaObject';
import { mockData } from '@weco/common/test/fixtures/components/media-object';
import { mockImage } from '@weco/common/test/fixtures/components/compact-card';

const Template = args => <MediaObject {...args} />;
export const basic = Template.bind({});
basic.args = {
  title: mockData.title,
  text: mockData.text,
  image: mockImage,
};
basic.storyName = 'MediaObject';
