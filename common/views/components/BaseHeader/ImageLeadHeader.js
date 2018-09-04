// @flow
import {Fragment} from 'react';
import {spacing, classNames, grid} from '../../../utils/classnames';
import HeaderText from '../HeaderText/HeaderText';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import type {Link} from '../../../model/link';

type Props = {|
  title: string,
  TagBar: ?Node,
  DateInfo: ?Node,
  InfoBar: ?Node,
  FeaturedMedia: Element<typeof UiImage>,
  topLink: ?Link,
  Description: ?Node
|}
const ImageLeadHeader = ({
  title,
  FeaturedMedia,
  topLink,
  TagBar,
  DateInfo,
  InfoBar,
  Description
}: Props) => {
  return (
    <Fragment>
      <div className={classNames({
        'relative': true,
        [spacing({s: 3}, {margin: ['bottom']})]: true
      })}>
        {FeaturedMedia}
        <WobblyEdge background='white' />
      </div>
      <div className='container'>
        <div className={`grid`}>
          <div className={`${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}`}>
            <HeaderText
              topLink={topLink}
              TagBar={TagBar}
              Heading={<h1 className='h0 inline-block no-margin'>{title}</h1>}
              DateInfo={DateInfo}
              Description={Description}
              InfoBar={InfoBar} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ImageLeadHeader;
