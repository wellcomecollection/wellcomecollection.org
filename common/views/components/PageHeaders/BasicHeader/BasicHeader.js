
// @flow
import {Fragment} from 'react';
import {spacing, grid, font} from '../../../../utils/classnames';
import {UiImage} from '../../Images/Images';
import type {Node} from 'react';
import type {UiImageProps} from '../../Images/Images';
import type {Props as TagsProps} from '../../Tags/Tags';

type Props = {|
  title: string,
  mainImageProps: ?UiImageProps,
  tags: TagsProps,
  DateInfo: Node,
  InfoBar: Node,
  Description: ?Node
|}

const BasicHeader = ({
  title,
  mainImageProps,
  tags,
  DateInfo,
  Description,
  InfoBar
}: Props) => (
  <div className={`container ${spacing({s: 5, m: 7}, {padding: ['top']})} ${spacing({s: 1}, {padding: ['bottom']})}`}>
    <div className='grid'>
      <div className={grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}>
        {tags.length > 0 &&
          <Fragment>
            {tags.map(tag => {
              return <div key={tag.text} className={`bg-yellow ${font({s: 'HNM5'})} ${spacing({s: 1}, { padding: ['left', 'right'] })}`} style={{ display: 'inline-block' }}>{tag.text}</div>;
            })}
          </Fragment>
        }

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
