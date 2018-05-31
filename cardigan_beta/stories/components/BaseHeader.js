import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs/react';

import VideoEmbed from '../../../common/views/components/VideoEmbed/VideoEmbed';
import {UiImage} from '../../../common/views/components/Images/Images';
import StatusIndicator from '../../../common/views/components/StatusIndicator/StatusIndicator';
import WobblyBackground from '../../../common/views/components/BaseHeader/WobblyBackground';
import DateRange from '../../../common/views/components/DateRange/DateRange';
import BaseHeader from '../../../common/views/components/BaseHeader/BaseHeader';
import Tags from '../../../common/views/components/Tags/Tags';
import {image, videoEmbed} from '../content';

const stories = storiesOf('Components', module).addDecorator(withKnobs);

const Header = () => {
  const title = text('Title', 'Some sort of title');
  const description = text('Description', 'Some sort of description');
  const Image = UiImage(image);
  const TagBar = <Tags tags={[{
    text: 'Tag'
  }]} />;
  const Video = VideoEmbed(videoEmbed);
  const DateInfo = <DateRange start={new Date()} end={new Date()} />;
  const InfoBar = <StatusIndicator start={new Date()} end={new Date()} />;
  const Description = <div>{description}</div>;

  const hasTags = boolean('Has tags?', true);
  const hasBackground = boolean('Has background?', true);
  const hasDescription = boolean('Has description?', true);
  const hasDateInfo = boolean('Has date info?', true);
  const hasInfoBar = boolean('Has info bar?', true);

  const featuredMedia = select('Featured media', {
    none: null,
    image: 'Image',
    video: 'Video'
  });
  const FeaturedMedia = featuredMedia === 'image' ? Image
    : featuredMedia === 'video' ? Video
      : null;

  return (
    <BaseHeader
      title={title}
      TagBar={hasTags ? TagBar : null}
      FeaturedMedia={FeaturedMedia}
      Background={hasBackground ? WobblyBackground() : null}
      Description={hasDescription ? Description : null}
      DateInfo={hasDateInfo ? DateInfo : null}
      InfoBar={hasInfoBar ? InfoBar : null}
    />
  );
};

stories
  .add('Header', Header);

export default Header();
