// @flow
import { font, spacing, classNames } from '../../../utils/classnames';
import type { Node } from 'react';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type { HTMLString } from '../../../services/prismic/types';

type Props = {|
  caption: HTMLString,
  preCaptionNode?: Node,
  width?: ?number,
|};

const Caption = ({ caption, preCaptionNode, width }: Props) => {
  return (
    <figcaption
      style={width ? { width: `${width}px` } : undefined}
      className={`caption h-center ${font({ s: 'LR3', m: 'LR2' })} ${spacing(
        { s: 3 },
        { padding: ['top'] }
      )}`}
    >
      <div
        className={classNames({
          'overflow-hidden': true,
          [spacing({ s: 3, m: 4, l: 5 }, { padding: ['right'] })]: true,
        })}
        style={{ maxWidth: '55em' }}
        tabIndex="0"
      >
        {preCaptionNode}
        <div
          className={`border-left-width-1 ${spacing(
            { s: 2 },
            { padding: ['left'] }
          )}`}
          style={{ borderColor: 'currentColor' }}
        >
          <PrismicHtmlBlock html={caption} />
        </div>
        <style>{'.caption p { display: inline; }'}</style>
      </div>
    </figcaption>
  );
};

export default Caption;
