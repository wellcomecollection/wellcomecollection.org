// @flow
import {spacing, grid} from '../../../utils/classnames';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import type {Node} from 'react';
import type WobblyBackground from '../BaseHeader/WobblyBackground';
import type TexturedBackground from '../BaseHeader/TexturedBackground';
import type {BodyType} from '../Body/Body';
import type {UiImage} from '../Images/Images';
import type VideoEmbed from '../VideoEmbed/VideoEmbed';

type Props = {|
  id: string,
  title: string,
  body: BodyType,
  Background: ?(WobblyBackground | TexturedBackground),
  TagBar: ?Node, // potentially make this only take Aync | Tags?
  DateInfo: ?Node,
  InfoBar: ?Node,
  Description: ?Node,
  FeaturedMedia: ?(UiImage | VideoEmbed),
  children?: ?Node
|}

export const BasePageColumn = ({children}: {| children: Node |}) => (
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

const BasePage = ({
  id,
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
    <article data-wio-id={id}>
      <BaseHeader
        title={title}
        Background={Background}
        TagBar={TagBar}
        DateInfo={DateInfo}
        Description={Description}
        InfoBar={InfoBar}
        FeaturedMedia={FeaturedMedia}
      />

      <BasePageColumn>
        <div className='basic-page'>
          <Body body={body}></Body>
        </div>
      </BasePageColumn>

      {children &&
        <BasePageColumn>
          {children}
        </BasePageColumn>
      }
    </article>
  );
};

export default BasePage;
