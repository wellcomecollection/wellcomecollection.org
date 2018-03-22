// @flow
import {Fragment} from 'react';
import CaptionedImage from '../CaptionedImage/CaptionedImage';
import Image from '../Image/Image';
import Tasl from '../Tasl/Tasl';
import type {Picture} from '../../../model/picture';

type ImageGalleryProps = {|
  id: string,
  title: ?string,
  items: Picture[]
|}

const ImageGallery = ({id, title, items}: ImageGalleryProps) => {
  return (
    <Fragment>
      {title && <h2 className='image-gallery__heading'>{title}</h2>}
      <div className='wobbly-edge wobbly-edge--white wobbly-edge--small js-wobbly-edge' data-is-static='true'></div>
      <div className='image-gallery touch-scroll js-image-gallery' data-id={id} id={id}>
        {items.map((image, i) => (
          <div className='image-gallery__item' key={image.contentUrl}>
            <CaptionedImage
              caption={image.caption || ''}
              slideNumbers={{ current: i, total: items.length }}>

              {image.contentUrl && image.width && image.height && <Image
                width={image.width}
                height={image.height}
                contentUrl={image.contentUrl}
                lazyload={true}
                sizesQueries={'(max-width: 600px) 100vw, ' + (image.width / image.height) * 640 + 'px'}
                alt={image.alt || ''} />}

              {image.contentUrl && (
                image.title ||
                (image.source && image.source.name) ||
                (image.copyright && image.copyright.holder) ||
                image.license
              ) && <Tasl
                  // TODO: Maybe fill with placeholder so the content team can see it?
                  contentUrl={image.contentUrl || ''}
                  title={image.title}
                  author={image.author}
                  sourceName={image.source && image.source.name}
                  sourceLink={image.source && image.source.link}
                  license={image.license}
                  copyrightHolder={image.copyright && image.copyright.holder}
                  copyrightLink={image.copyright && image.copyright.link}
                  isFull={false}
                />}
            </CaptionedImage>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default ImageGallery;
