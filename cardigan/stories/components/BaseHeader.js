import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs/react';

import VideoEmbed from '../../../common/views/components/VideoEmbed/VideoEmbed';
import {UiImage} from '../../../common/views/components/Images/Images';
import StatusIndicator from '../../../common/views/components/StatusIndicator/StatusIndicator';
import HeaderBackground from '../../../common/views/components/BaseHeader/HeaderBackground';
import LabelsList from '../../../common/views/components/LabelsList/LabelsList';
import DateRange from '../../../common/views/components/DateRange/DateRange';
import BaseHeader from '../../../common/views/components/BaseHeader/BaseHeader';
import Breadcrumb from '../../../common/views/components/Breadcrumb/Breadcrumb';
import {image, videoEmbed} from '../content';

const stories = storiesOf('Components', module).addDecorator(withKnobs);
export const Header = () => {
  const title = text('Title', 'Some sort of title');
  const description = text('Description', 'Some sort of description');
  const Image = UiImage(image());
  const BreadcrumbComponent = <Breadcrumb items={[{
    text: 'Content type',
    url: '/content-type'
  }, {
    prefix: 'Part of',
    text: 'The Ambroise Paré collection',
    url: '/part-of/this'
  }]} />;
  const Video = VideoEmbed(videoEmbed);
  const DateInfo = <DateRange start={new Date()} end={new Date()} />;
  const InfoBar = <StatusIndicator start={new Date()} end={new Date()} />;
  const Description = <div>{description}</div>;

  const hasBreadcrumb = boolean('Has breadcrumb?', true);
  const hasBackground = boolean('Has background?', true);
  const hasWobblyEdge = boolean('Has wobbly edge?', true);
  const hasDescription = boolean('Has description?', true);
  const hasDateInfo = boolean('Has date info?', true);
  const hasInfoBar = boolean('Has info bar?', true);
  const hasLabels = boolean('Has labels?', true);
  const isFree = boolean('Is free?', false);

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
      Breadcrumb={hasBreadcrumb ? BreadcrumbComponent : null}
      FeaturedMedia={FeaturedMedia}
      Background={<HeaderBackground
        backgroundTexture={hasBackground ? 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg' : null}
        hasWobblyEdge={hasWobblyEdge} />}
      Description={hasDescription ? Description : null}
      DateInfo={hasDateInfo ? DateInfo : null}
      InfoBar={hasInfoBar ? InfoBar : null}
      LabelBar={hasLabels ? <LabelsList labels={[{url: null, text: 'Gallery tour'}, {url: null, text: 'Audio described'}]} /> : null}
      isFree={isFree}
    />
  );
};

stories
  .add('Headers: Base', Header);
