// @flow

import {font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';

type Props = {|
  positionInSeries?: number,
  series: Object,
  contentType: string,
  caption: string,
  truncateCaption: string,
  slideNumbers: Object,
  isFull: boolean,
  fitVh: boolean,
  children: React.Node
|}

const CaptionedImage = ({
  positionInSeries,
  series,
  contentType,
  caption,
  truncateCaption,
  slideNumbers,
  isFull,
  fitVh,
  children
}: Props) => (
  <figure className={`captioned-image ${isFull ? 'captioned-image--is-full' : ''} ${fitVh ? 'captioned-image--fit-vh' : ''}`}>
    <div className="captioned-image__image-container">
      {children}
    </div>
    {caption &&
      <figcaption className={`captioned-image__caption ${font({s: 'LR3', m: 'LR2'})}`}>
        <Icon name='image' extraClasses='float-l margin-right-s1' />

        <div className={`captioned-image__caption-text ${truncateCaption ? 'js-truncate-text' : ''}`}
          tabIndex="0"
          data-slide-number={slideNumbers && slideNumbers.current}>
          {slideNumbers &&
            <span
              className={`captioned-image__number ${font({s: 'HNM5'})} ${spacing({s: 2}, {padding: ['right']})}`}
              aria-label={`slide ${slideNumbers.current} of ${slideNumbers.total}`}>
              <span aria-hidden="true">{slideNumbers.current}/{slideNumbers.total}</span>
            </span>
          }
          <span dangerouslySetInnerHTML={{__html: caption}} />
        </div>
      </figcaption>
    }
  </figure>
);

export default CaptionedImage;
