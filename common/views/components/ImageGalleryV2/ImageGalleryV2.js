// @flow
import {Fragment} from 'react';
import {CaptionedImage} from '../Images/Images';
import type {CaptionedImage as CaptionedImageProps} from '../../../model/captioned-image';

type ImageGalleryProps = {|
  id: string,
  title: ?string,
  items: CaptionedImageProps[]
|}

const ImageGallery = ({id, title, items}: ImageGalleryProps) => {
  return (
    <Fragment>
      <h2>{title || 'In pictures'}</h2>
      {items.map((captionedImage, i) => (
        <div key={captionedImage.image.contentUrl}>
          <CaptionedImage
            image={captionedImage.image}
            caption={captionedImage.caption}
            sizesQueries={'(max-width: 600px) 100vw, ' + (captionedImage.image.width / captionedImage.image.height) * 640 + 'px'}
            preCaptionNode={
              <div
                aria-label={`slide ${i + 1} of ${items.length}`}>
                <span>{i + 1} of {items.length}</span>
              </div>
            }>
          </CaptionedImage>
        </div>
      ))}
    </Fragment>
  );
};

export default ImageGallery;
