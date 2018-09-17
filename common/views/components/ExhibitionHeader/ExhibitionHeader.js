// @flow

import {Fragment} from 'react';
import HeaderText from '../HeaderText/HeaderText';
import WobblyBottom from '../WobblyBottom/WobblyBottom';
import FreeSticker from '../FreeSticker/FreeSticker';
import TextLayout from '../TextLayout/TextLayout';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import {classNames, spacing} from '../../../utils/classnames';
import type {Node} from 'react';
import type {FeaturedMedia as FeaturedMediaType} from '../BaseHeader/BaseHeader';

type Props = {|
  title: string,
  DateInfo: ?Node,
  InfoBar: ?Node,
  FeaturedMedia: ?FeaturedMediaType,
|}

const ExhibitionHeader = ({
  title,
  FeaturedMedia,
  DateInfo,
  InfoBar
}: Props) => {
  return (
    <Fragment>
      <TextLayout>
        <HeaderText
          Breadcrumb={<Breadcrumb items={[{url: '/exhibitions', text: 'Exhibitions'}]} />}
          Heading={<h1 className='h0 inline-block no-margin'>{title}</h1>}
          DateInfo={DateInfo}
          InfoBar={InfoBar}
          Description={null} />
      </TextLayout>
      <TextLayout>
        <div className='relative' style={{zIndex: 1}}>
          <FreeSticker />
        </div>
      </TextLayout>
      <div className={classNames({
        'margin-h-auto': true,
        [spacing({m: 4}, {padding: ['left', 'right']})]: true
      })} style={{maxWidth: '1450px'}}>
        <WobblyBottom color='white'>
          {FeaturedMedia}
        </WobblyBottom>
      </div>
    </Fragment>
  );
};

export default ExhibitionHeader;
