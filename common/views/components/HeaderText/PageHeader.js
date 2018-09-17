// @flow

import {font, spacing} from '../../../utils/classnames';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import HighlightedHeading from '../HighlightedHeading/HighlightedHeading';
import LabelsList from '../LabelsList/LabelsList';
import {UiImage} from '../Images/Images';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import Picture from '../Picture/Picture';
import HeaderBackground from '../BaseHeader/HeaderBackground';
import FreeSticker from '../FreeSticker/FreeSticker';
import TextLayout from '../TextLayout/TextLayout';
import type {Node, Element} from 'react';

export type FeaturedMedia =
  | Element<typeof UiImage>
  | Element<typeof VideoEmbed>
  | Element<typeof Picture>

type BackgroundType = Element<typeof HeaderBackground>

type Props = {|
  title: string,
  Breadcrumb: ?Element<typeof Breadcrumb>,
  ContentTypeInfo: ?Node,
  LabelsList: ?Element<typeof LabelsList>,
  Background: ?BackgroundType,
  FeaturedMedia: ?FeaturedMedia,
  isFree?: boolean
|}

const backgroundTexture = 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';
const PageHeader = ({
  title,
  Breadcrumb,
  ContentTypeInfo,
  LabelsList,
  Background,
  FeaturedMedia,
  isFree = false
}: Props) => {
  const BackgroundComponent = Background ||
    (FeaturedMedia ? HeaderBackground({backgroundTexture}) : null);

  const Heading = Background
    ? <h1 className='h1 inline-block no-margin'>{title}</h1>
    : <HighlightedHeading text={title} />;

  return (
    <div className={`row relative`} style={{
      backgroundImage: BackgroundComponent ? null : `url(${backgroundTexture})`,
      backgroundSize: BackgroundComponent ? null : '150%'
    }}>
      {BackgroundComponent}

      <TextLayout>
        {isFree &&
          <div className='relative'>
            <FreeSticker />
          </div>
        }

        <div className={spacing({s: 2}, {padding: ['top']})}>
          {Breadcrumb}
          {Heading}

          {ContentTypeInfo &&
            <div className={`${font({s: 'HNL3'})}`}>
              {ContentTypeInfo}
            </div>
          }

          {LabelsList}

          {FeaturedMedia &&
            <div className={`${spacing({s: 3}, {margin: ['top']})} relative`}>
              {FeaturedMedia}
            </div>
          }
        </div>
      </TextLayout>
    </div>
  );
};

export default PageHeader;
