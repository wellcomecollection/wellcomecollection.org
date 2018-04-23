// @flow
import {Fragment} from 'react';
import {CaptionedImage} from '../Images/Images';
import type {CaptionedImageProps} from '../Images/Images';

type ImageGalleryProps = {|
  id: string,
  title: ?string,
  items: CaptionedImageProps[]
|}

// TODO Slide numbers
const ImageGallery = ({id, title, items}: ImageGalleryProps) => {
  return (
    <Fragment>
      {title && <h2 className='image-gallery__heading'>{title}</h2>}
      <div className='wobbly-edge wobbly-edge--white wobbly-edge--small js-wobbly-edge' data-is-static='true'></div>
      <div className='image-gallery touch-scroll js-image-gallery' data-id={id} id={id}>
        {items.map((captionedImage, i) => (
          <div className='image-gallery__item' key={captionedImage.image.contentUrl}>
            <CaptionedImage
              image={captionedImage.image}
              caption={captionedImage.caption}
              sizesQueries={'(max-width: 600px) 100vw, ' + (captionedImage.image.width / captionedImage.image.height) * 640 + 'px'}>
            </CaptionedImage>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default ImageGallery;
