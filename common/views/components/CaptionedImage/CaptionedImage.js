// @flow

import {font, spacing} from '../../../utils/classnames';
import Image from '../Image/Image';
import type {Props as ImageProps} from '../Image/Image';
import ChapterIndicator from '../ChapterIndicator/ChapterIndicator';
import Tasl from '../Tasl/Tasl';
import Icon from '../Icon/Icon';

type Props = {|
  positionInSeries?: number,
  series: Object,
  contentType: string,
  caption: string,
  truncateCaption: string,
  slideNumbers: Object,
  title?: string,
  source?: {|name?: string, link?: string|},
  author?: string,
  copyright?: {|holder?: string, link?: string|},
  license?: string,
  showCopyright?: boolean,
  image: ImageProps,
  isFull: boolean
|}

function buildImageMarkup(positionInSeries, series, contentType, image) {
  if (positionInSeries && series.commissionedLength && series.color && contentType === 'article') {
    return ([
      <Image key="1" {...image} />,
      <ChapterIndicator
        key="2"
        position={positionInSeries}
        color={series.color}
        commissionedLength={series.commissionedLength}
      />
    ]);
  } else {
    return (
      <Image {...image} />
    );
  }
}

const CaptionedImage = ({
  positionInSeries,
  series,
  contentType,
  caption,
  truncateCaption,
  slideNumbers,
  title,
  source,
  author,
  copyright,
  license,
  showCopyright,
  image,
  isFull
}: Props) => (
  <figure className={`captioned-image ${isFull ? 'captioned-image--is-full' : ''}`}>
    <div className="captioned-image__image-container">
      {buildImageMarkup(positionInSeries, series, contentType)}
      {(title || source || copyright || license) && showCopyright &&
        <Tasl
          isFull={isFull}
          contentUrl={image.contentUrl}
          title={title}
          author={author}
          sourceName={source && source.name}
          sourceLink={source && source.link}
          license={license}
          copyrightHolder={copyright && copyright.holder}
          copyrightLink={copyright && copyright.link} />
      }
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
          {caption}
        </div>
      </figcaption>
    }
  </figure>
);

export default CaptionedImage;
// TODO: caption safe html
