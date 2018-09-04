// @flow

import {Fragment} from 'react';
import HeaderText from '../HeaderText/HeaderText';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import FreeSticker from '../FreeSticker/FreeSticker';
import type {Link} from '../../../model/link';
import {BasePageColumn} from '../BasePage/BasePage';

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
      <div className='relative'>
        <BasePageColumn>
          <div className='relative'>
            <FreeSticker />
          </div>
        </BasePageColumn>
        {FeaturedMedia}
        <WobblyEdge background='white' />
      </div>
      <BasePageColumn>
        <HeaderText
          topLink={topLink}
          TagBar={TagBar}
          Heading={<h1 className='h0 inline-block no-margin'>{title}</h1>}
          DateInfo={DateInfo}
          Description={Description}
          InfoBar={InfoBar} />
      </BasePageColumn>
    </Fragment>
  );
};

export default ImageLeadHeader;
