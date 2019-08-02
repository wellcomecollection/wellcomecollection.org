// @flow
import type { HTMLString } from '../../../services/prismic/types';
import { font, classNames } from '../../../utils/classnames';
import type { Node } from 'react';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  caption: HTMLString,
  preCaptionNode?: Node,
  width?: ?number,
|};

const Caption = ({ caption, preCaptionNode, width }: Props) => {
  return (
    <VerticalSpace
      v={{
        size: 'm',
        properties: ['margin-top'],
      }}
      as="figcaption"
      style={width ? { width: `${width}px` } : undefined}
      className={classNames({
        [font('lr', 6)]: true,
        'caption h-center': true,
      })}
    >
      <div
        className={classNames({
          'overflow-hidden': true,
        })}
        style={{ maxWidth: '55em' }}
        tabIndex="0"
      >
        {preCaptionNode}
        <div
          className={`border-left-width-1 padding-left-12`}
          style={{ borderColor: 'currentColor' }}
        >
          <PrismicHtmlBlock html={caption} />
        </div>
        <style>{'.caption p { display: inline; }'}</style>
      </div>
    </VerticalSpace>
  );
};

export default Caption;
