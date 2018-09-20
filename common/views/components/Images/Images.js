// @flow
import {Fragment} from 'react';
import {convertImageUri} from '../../../utils/convert-image-uri';
import {classNames} from '../../../utils/classnames';
import {imageSizes} from '../../../utils/image-sizes';
import Tasl from '../Tasl/Tasl';
import type {Node} from 'react';
import type {ImageType} from '../../../model/image';
import type {CaptionedImage as CaptionedImageProps} from '../../../model/captioned-image';
import Caption from '../Caption/Caption';

export type UiImageProps = {|
  ...ImageType,
  // TODO: Could this take a grid sizing object, and work out the queries
  // automatically?
  // Grid sizing object = {| ['s', 'm', 'l', 'xl']: number |}
  sizesQueries: string,
  extraClasses?: string,
  isFull?: boolean,
  showTasl?: boolean,
  maxHeightRestricted?: boolean
|}

export const UiImage = ({
  contentUrl,
  width,
  height,
  alt,
  tasl,
  sizesQueries,
  extraClasses = '',
  isFull = false,
  showTasl = true,
  maxHeightRestricted = false
}: UiImageProps) => {
  return (
    <Fragment>
      <noscript dangerouslySetInnerHTML={{__html: `
          <img width=${width}
            height=${height || ''}
            class='image image--noscript'
            src=${convertImageUri(contentUrl, 640, false)}
            alt=${alt} />`}} />

      <img width={width}
        height={height}
        className={classNames({
          'image': true,
          'lazy-image': true,
          'lazyload': true,
          [extraClasses || '']: true,
          'image-max-height-restricted': maxHeightRestricted
        })}
        src={convertImageUri(contentUrl, 30, false)}
        data-srcset={imageSizes(width).map(size => {
          return `${convertImageUri(contentUrl, size, false)} ${size}w`;
        })}
        sizes={sizesQueries}
        alt={alt} />
      {showTasl && <Tasl {...tasl} isFull={isFull} />}
    </Fragment>
  );
};

export type UiCaptionedImageProps = {|
  ...CaptionedImageProps,
  sizesQueries: string,
  extraClasses?: string,
  preCaptionNode?: Node,
  maxHeightRestricted?: boolean
|}

export const CaptionedImage = ({
  image,
  caption,
  sizesQueries,
  extraClasses = '',
  preCaptionNode,
  maxHeightRestricted = false
}: UiCaptionedImageProps) => {
  const uiImageProps = {...image, sizesQueries, maxHeightRestricted};
  return (
    <figure className={`captioned-image ${extraClasses}`}>
      <div className='captioned-image__image-container'>
        {/* https://github.com/facebook/flow/issues/2405 */}
        {/* $FlowFixMe */}
        <UiImage {...uiImageProps} />
      </div>
      <Caption
        caption={caption}
        preCaptionNode={preCaptionNode} />
    </figure>
  );
};
