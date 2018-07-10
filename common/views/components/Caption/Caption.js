// @flow
import {font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import type {Node} from 'react';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {|
  caption: HTMLString,
  preCaptionNode?: Node
|}

const Caption = ({caption, preCaptionNode}: Props) => {
  return (
    <figcaption className={`caption flex-inline font-black plain-text ${font({s: 'LR3', m: 'LR2'})} ${spacing({s: 3}, {padding: ['top', 'bottom']})}`}>
      <Icon name='image' extraClasses='float-l margin-right-s1' />
      <div className={`overflow-hidden ${spacing({s: 3, m: 4, l: 5}, {padding: ['right']})}`}
        tabIndex='0'>
        {preCaptionNode}
        <PrismicHtmlBlock html={caption} />
        <style>
          {'.caption p { display: inline; }'}
        </style>
      </div>
    </figcaption>
  );
};

export default Caption;
