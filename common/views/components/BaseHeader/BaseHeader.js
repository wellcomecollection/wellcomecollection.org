// @flow
import {Fragment} from 'react';
import {spacing} from '../../../utils/classnames';
import {breakpoints} from '../../../utils/breakpoints';
import HeaderBackground from './HeaderBackground';
import type {Node, Element} from 'react';
import {UiImage} from '../Images/Images';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import HighlightedHeading from '../HighlightedHeading/HighlightedHeading';
import type {GenericContentFields} from '../../../model/generic-content-fields';
import type {Tasl} from '../../../model/tasl';
import type {Link} from '../../../model/link';
import HeaderText from '../HeaderText/HeaderText';
import FreeSticker from '../FreeSticker/FreeSticker';
import Picture from '../Picture/Picture';
import {BasePageColumn} from '../BasePage/BasePage';

export type FeaturedMedia =
  | Element<typeof UiImage>
  | Element<typeof VideoEmbed>
  | Element<typeof Picture>

type BackgroundType = Element<typeof HeaderBackground>

type Props = {|
  title: string,
  Background: ?BackgroundType,
  TagBar: ?Node, // potentially make this only take Async | Tags?
  DateInfo: ?Node,
  InfoBar: ?Node,
  Description: ?Node,
  FeaturedMedia: ?FeaturedMedia,
  LabelBar: ?Node,
  isFree: boolean,
  topLink: ?Link
|}

export function getFeaturedMedia(
  fields: GenericContentFields,
  isPicture?: boolean
): ?FeaturedMedia {
  const image = fields.promo && fields.promo.thinImage;
  const squareImage = fields.promo && fields.promo.squareImage;
  const {body} = fields;
  const tasl: ?Tasl = image && {
    title: image.title,
    author: image.author,
    sourceName: image.source && image.source.name,
    sourceLink: image.source && image.source.link,
    license: image.license,
    copyrightHolder: image.copyright && image.copyright.holder,
    copyrightLink: image.copyright && image.copyright.link
  };
  const hasFeaturedVideo = body.length > 0 && body[0].type === 'videoEmbed';
  const FeaturedMedia = hasFeaturedVideo
    ? <VideoEmbed {...body[0].value} /> : isPicture && image && squareImage
      ? <Picture
        images={[{...image, minWidth: breakpoints.medium}, squareImage]}
        isFull={true} />
      : image ? <UiImage tasl={tasl} {...image} /> : null;

  return FeaturedMedia;
}

const backgroundTexture = 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';
const BaseHeader = ({
  title,
  Background,
  TagBar,
  DateInfo,
  Description,
  InfoBar,
  FeaturedMedia,
  LabelBar,
  isFree,
  topLink
}: Props) => {
  const BackgroundComponent = Background ||
    (FeaturedMedia ? HeaderBackground({backgroundTexture}) : null);
  const Heading = Background
    ? <h1 className='h1 inline-block no-margin'>{title}</h1>
    : <HighlightedHeading text={title} />;

  return (
    <Fragment>
      <div className={`row relative`} style={{
        backgroundImage: BackgroundComponent ? null : `url(${backgroundTexture})`,
        backgroundSize: BackgroundComponent ? null : '150%'
      }}>
        {BackgroundComponent}
        <BasePageColumn>
          {isFree &&
            <div className='relative'>
              <FreeSticker />
            </div>
          }

          <HeaderText
            topLink={topLink}
            TagBar={TagBar}
            Heading={Heading}
            DateInfo={DateInfo}
            Description={Description}
            InfoBar={InfoBar} />

          {FeaturedMedia &&
            <div className={`${spacing({s: 3}, {margin: ['top']})} relative`}>
              {FeaturedMedia}
            </div>
          }

          {LabelBar &&
            <div className={`${spacing({s: 3}, {margin: ['top']})} relative`}>
              {LabelBar}
            </div>
          }
        </BasePageColumn>
      </div>
    </Fragment>
  );
};

export default BaseHeader;
