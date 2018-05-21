// @flow
import {Fragment} from 'react';
import {spacing, grid} from '../../../../utils/classnames';
import BasicHeader from '../../PageHeaders/BasicHeader/BasicHeader';
import BasicBody from '../../BasicBody/BasicBody';
import type {Node} from 'react';
import type {Body} from '../../BasicBody/BasicBody';
import type WobblyBackground from './WobblyBackground';
import type TexturedBackground from './TexturedBackground';
import type {CaptionedImage} from '../../Images/Images';
import type VideoEmbed from '../../VideoEmbed/VideoEmbed';

type Props = {|
  title: string,
  body: Body,
  Background: ?(WobblyBackground | TexturedBackground),
  TagBar: ?Node, // potentially make this only take Aync | Tags?
  DateInfo: ?Node,
  InfoBar: ?Node,
  Description: ?Node,
  FeaturedMedia: ?(CaptionedImage | VideoEmbed),
  children?: ?Node
|}

export const BasicPageColumn = ({children}: {| children: Node |}) => (
  <div className={`row ${spacing({s: 8}, {padding: ['bottom']})}`}>
    <div className='container'>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}`}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

const BasicPage = ({
  title,
  body,
  TagBar,
  Background,
  DateInfo,
  Description,
  InfoBar,
  FeaturedMedia,
  children
}: Props) => {
  return (
    <Fragment>
      <BasicHeader
        title={title}
        Background={Background}
        TagBar={TagBar}
        DateInfo={DateInfo}
        Description={Description}
        InfoBar={InfoBar}
        FeaturedMedia={FeaturedMedia}
      />
      <BasicPageColumn>
        <div className='basic-page'>
          <BasicBody body={body}></BasicBody>
        </div>
      </BasicPageColumn>

      {children &&
        <BasicPageColumn>
          {children}
        </BasicPageColumn>
      }
    </Fragment>
  );
};

export default BasicPage;
