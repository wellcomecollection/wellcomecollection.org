// @flow
import {Fragment} from 'react';
import {spacing, font} from '../../../utils/classnames';
import {CaptionedImage} from '../Images/Images';
import type {CaptionedImage as CaptionedImageProps} from '../../../model/captioned-image';

type ImageGalleryProps = {|
  id: string,
  title: ?string,
  items: CaptionedImageProps[]
|}

// TODO Slide numbers
const ImageGallery = ({id, title, items}: ImageGalleryProps) => {
  return (
    <Fragment>
      {title && <h2 className='image-gallery__heading h2'>{title}</h2>}
      <div className='wobbly-edge wobbly-edge--white wobbly-edge--small js-wobbly-edge' data-is-static='true'></div>
      <div className='image-gallery touch-scroll js-image-gallery' data-id={id} id={id}>
        {items.map((captionedImage, i) => (
          <div className='image-gallery__item' key={captionedImage.image.contentUrl}>
            <CaptionedImage
              image={captionedImage.image}
              caption={captionedImage.caption}
              sizesQueries={'(max-width: 600px) 100vw, ' + (captionedImage.image.width / captionedImage.image.height) * 640 + 'px'}
              preCaptionNode={
                <span
                  className={`inline-block border-right-width-1 border-color-pumice ${font({s: 'HNM5'})} ${spacing({s: 1}, {padding: ['right'], margin: ['right']})}`}
                  aria-label={`slide ${i + 1} of ${items.length}`}>
                  <span aria-hidden='true'>{i + 1}/{items.length}</span>
                </span>
              }>
            </CaptionedImage>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default ImageGallery;
