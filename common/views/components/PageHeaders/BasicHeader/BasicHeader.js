
// @flow
import {spacing, grid, font} from '../../../../utils/classnames';
import {UiImage} from '../../Images/Images';
import type {Node} from 'react';
import type {UiImageProps} from '../../Images/Images';

type Props = {|
  title: string,
  mainImageProps: ?UiImageProps,
  DateInfo: Node,
  InfoBar: Node,
  Description: ?Node
|}

const BasicHeader = ({
  title,
  mainImageProps,
  DateInfo,
  Description,
  InfoBar
}: Props) => (
  <div className={`container ${spacing({s: 5, m: 7}, {padding: ['top']})} ${spacing({s: 1}, {padding: ['bottom']})}`}>
    <div className='grid'>
      <div className={grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}>
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
);

export default BasicHeader;
