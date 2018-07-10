
// @flow
import {Fragment} from 'react';
import {spacing, grid, font} from '../../../utils/classnames';
import TexturedBackground from './TexturedBackground';
import type {Node, Element} from 'react';
import {UiImage} from '../Images/Images';
import WobblyBackground from './WobblyBackground';
import VideoEmbed from '../VideoEmbed/VideoEmbed';
import BaseHeading from '../BaseHeading/BaseHeading';

type FeaturedMedia =
  | Element<typeof UiImage>
  | Element<typeof VideoEmbed>

type BackgroundType =
  | Element<typeof WobblyBackground>
  | Element<typeof TexturedBackground>

type Props = {|
  title: string,
  Background: ?BackgroundType,
  TagBar: ?Node, // potentially make this only take Async | Tags?
  DateInfo: ?Node,
  InfoBar: ?Node,
  Description: ?Node,
  FeaturedMedia: ?FeaturedMedia
|}

const backgroundTexture = 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';
const BaseHeader = ({
  title,
  Background,
  TagBar,
  DateInfo,
  Description,
  InfoBar,
  FeaturedMedia
}: Props) => {
  const BackgroundComponent = Background ||
    (FeaturedMedia ? TexturedBackground({backgroundTexture}) : null);

  return (
    <Fragment>
      {BackgroundComponent}
      <div className='row' style={{
        backgroundImage: BackgroundComponent ? null : `url(${backgroundTexture})`,
        backgroundSize: BackgroundComponent ? null : '150%'
      }}>
        <div className={`container`}>
          <div className={`grid ${spacing({s: 5, m: 7, l: 9}, {padding: ['top']})}`}>
            {TagBar &&
              <div className={`
                ${spacing({s: 1}, {padding: ['top']})}
                ${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}
              `}>
                {TagBar}
              </div>
            }
            <div className={`
              ${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}
              ${spacing({s: 2}, {padding: ['bottom']})}
            `}>

              <BaseHeading
                text={title}
                hasWhiteBackground={!Background} />

              {DateInfo &&
                <div className={`${font({s: 'HNL3'})} ${spacing({s: 3}, {margin: ['top']})}`}>
                  {DateInfo}
                </div>
              }

              {Description &&
                <div className={`${font({s: 'HNL4'})} ${spacing({s: 3}, {margin: ['top']})} first-para-no-margin`}>
                  {Description}
                </div>
              }

              {InfoBar &&
                <div className={`${font({s: 'HNL4'})} ${spacing({s: 3}, {margin: ['top', 'bottom']})}`}>
                  {InfoBar}
                </div>
              }

              {FeaturedMedia &&
                <div className={`${spacing({s: 3}, {margin: ['top']})} relative`}>
                  {FeaturedMedia}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BaseHeader;
