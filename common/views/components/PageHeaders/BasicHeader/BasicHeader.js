
// @flow
import {Fragment} from 'react';
import {spacing, grid, font} from '../../../../utils/classnames';
import {UiImage} from '../../Images/Images';
import type {Node} from 'react';
import type {UiImageProps} from '../../Images/Images';
import type WobblyBackground from '../../Templates/BasicPage/WobblyBackground';
import type TexturedBackground from '../../Templates/BasicPage/TexturedBackground';

type Props = {|
  title: string,
  mainImageProps: ?UiImageProps,
  Background: ?(WobblyBackground | TexturedBackground),
  TagBar: Node,
  DateInfo: Node,
  InfoBar: Node,
  Description: ?Node
|}

const defaultBackgroundTexture = 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';
const BasicHeader = ({
  title,
  mainImageProps,
  Background,
  TagBar,
  DateInfo,
  Description,
  InfoBar
}: Props) => (
  <Fragment>
    {Background}
    <div className='row' style={{
      backgroundImage: Background ? null : `url(${defaultBackgroundTexture})`,
      backgroundSize: Background ? null : '150%'
    }}>
      <div className={`container ${spacing({s: 5, m: 7}, {padding: ['top']})} ${spacing({s: 1}, {padding: ['bottom']})}`}>
        <div className='grid'>
          <div className={`${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}`}>
            {TagBar}
          </div>
          <div className={`${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}`}>
            <h1 className='h1'>{title}</h1>

            <div className={`${font({s: 'HNL3'})}`}>
              {DateInfo}
            </div>

            {Description &&
              <div className={`${font({s: 'HNL4'})} ${spacing({s: 3}, {margin: ['top']})} first-para-no-margin`}>
                {Description}
              </div>
            }

            <div className={`${font({s: 'HNL4'})} ${spacing({s: 3}, {margin: ['top', 'bottom']})}`}>
              {InfoBar}
            </div>

            {mainImageProps &&
              <div className='relative'>
                <UiImage {...mainImageProps} />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);

export default BasicHeader;
