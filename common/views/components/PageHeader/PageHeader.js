// @flow

import {font, spacing, classNames} from '../../../utils/classnames';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import LabelsList from '../LabelsList/LabelsList';
import {UiImage} from '../Images/Images';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import Picture from '../Picture/Picture';
import HeaderBackground from '../BaseHeader/HeaderBackground';
import FreeSticker from '../FreeSticker/FreeSticker';
import TextLayout from '../TextLayout/TextLayout';
import WobblyBottom from '../WobblyBottom/WobblyBottom';
import {breakpoints} from '../../../utils/breakpoints';
import type {Node, Element, ElementProps} from 'react';
import type {GenericContentFields} from '../../../model/generic-content-fields';

export type FeaturedMedia =
  | Element<typeof UiImage>
  | Element<typeof VideoEmbed>
  | Element<typeof Picture>

type BackgroundType = Element<typeof HeaderBackground>

export function getFeaturedMedia(
  fields: GenericContentFields,
  isPicture?: boolean
): ?FeaturedMedia {
  const image = fields.promo && fields.promo.image;
  const { squareImage, widescreenImage } = fields;
  const {body} = fields;
  const tasl = image && {
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
    ? <VideoEmbed {...body[0].value} /> : isPicture && widescreenImage && squareImage
      ? <Picture
        images={[{...widescreenImage, minWidth: breakpoints.medium}, {...squareImage, minWidth: null}]}
        isFull={true} />
      : image && tasl ? <UiImage tasl={tasl} {...widescreenImage} sizesQueries='' /> : null;

  return FeaturedMedia;
}

export function getHeroPicture(fields: GenericContentFields): ?Element<typeof Picture> {
  const { squareImage, widescreenImage } = fields;
  return squareImage && widescreenImage &&
    <Picture
      images={[{...widescreenImage, minWidth: breakpoints.medium}, {...squareImage, minWidth: null}]}
      isFull={true} />;
}

type Props = {|
  breadcrumbs: ElementProps<typeof Breadcrumb>,
  labels: ?ElementProps<typeof LabelsList>,
  title: string,
  ContentTypeInfo: ?Node,
  Background: ?BackgroundType,
  FeaturedMedia: ?FeaturedMedia,
  HeroPicture: ?Element<typeof Picture>,
  isFree?: boolean
|}

const PageHeader = ({
  breadcrumbs,
  labels,
  title,
  ContentTypeInfo,
  HeroPicture,
  FeaturedMedia,
  isFree = false
}: Props) => {
  const Heading = <h1 className='h1 inline-block no-margin'>{title}</h1>;

  return (
    <div className={`row relative`}>
      <TextLayout>
        {isFree &&
          <div className='relative'>
            <FreeSticker />
          </div>
        }

        <div className={spacing({s: 3, m: 4}, {padding: ['top', 'bottom']})}>
          <div className={spacing({s: 3, m: 4}, {margin: ['bottom']})}>
            <Breadcrumb {...breadcrumbs} />
          </div>
          {Heading}

          {ContentTypeInfo &&
            <div className={`${font({s: 'HNL4', m: 'HNL3'})}`}>
              {ContentTypeInfo}
            </div>
          }

          {labels &&
            <div className={classNames({
              [spacing({s: 3, m: 4}, {margin: ['top']})]: true
            })}>
              <LabelsList {...labels} />
            </div>
          }

          {FeaturedMedia &&
            <div className={`${spacing({s: 3}, {margin: ['top']})} relative`}>
              {FeaturedMedia}
            </div>
          }
        </div>
      </TextLayout>

      {HeroPicture &&
        <div className={classNames({
          'margin-h-auto': true,
          [spacing({m: 4}, {padding: ['left', 'right']})]: true
        })} style={{maxWidth: '1450px'}}>
          <WobblyBottom color='white'>
            {HeroPicture}
          </WobblyBottom>
        </div>
      }
    </div>
  );
};

export default PageHeader;
