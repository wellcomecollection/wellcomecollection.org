// @flow
import {Fragment} from 'react';
import {convertImageUri} from '../../../utils/convert-image-uri';
import {imageSizes} from '../../../utils/image-sizes';
import {font} from '../../../utils/classnames';
import Tasl from '../Tasl/Tasl';
import Icon from '../Icon/Icon';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type {Node} from 'react';
import type {Image as ImageProps} from '../../../model/image';
import type {HTMLString} from '../../../services/prismic/types';

export type UiImageProps = {|
  ...ImageProps,
  // TODO: Could this take a grid sizing object, and work out the queries
  // automatically?
  // Grid sizing object = {| ['s', 'm', 'l', 'xl']: number |}
  sizesQueries: string,
  extraClasses?: string,
  showTasl?: boolean
|}

export const UiImage = ({
  contentUrl,
  width,
  height,
  alt,
  tasl,
  sizesQueries,
  extraClasses = '',
  showTasl = true
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
        className={`image lazy-image lazyload ${extraClasses}`}
        src={convertImageUri(contentUrl, 30, false)}
        data-srcset={imageSizes(width).map(size => {
          return `${convertImageUri(contentUrl, size, false)} ${size}w`;
        })}
        sizes={sizesQueries}
        alt={alt} />
      {showTasl && <Tasl {...tasl} />}
    </Fragment>
  );
};

export type CaptionedImageProps = {|
  image: ImageProps,
  caption: HTMLString
|}

export type UiCaptionedImageProps = {|
  image: ImageProps,
  caption: HTMLString,
  sizesQueries: string,
  extraClasses?: string,
  preCaptionNode?: Node
|}

export const CaptionedImage = ({
  image,
  caption,
  sizesQueries,
  extraClasses = '',
  preCaptionNode
}: UiCaptionedImageProps) => {
  const uiImageProps = {...image, sizesQueries};
  return (
    <figure className={`captioned-image ${extraClasses}`}>
      <div className='captioned-image__image-container'>
        {/* https://github.com/facebook/flow/issues/2405 */}
        {/* $FlowFixMe */}
        <UiImage {...uiImageProps} />
      </div>
      <figcaption className={`captioned-image__caption ${font({s: 'LR3', m: 'LR2'})}`}>
        <Icon name='image' extraClasses='float-l margin-right-s1' />

        <div
          className={`captioned-image__caption-text`}
          tabIndex={0}>
          {preCaptionNode}
          <PrismicHtmlBlock html={caption} />
        </div>
      </figcaption>
    </figure>
  );
};
