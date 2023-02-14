import Tasl from '../Tasl/Tasl';
import { imageSizes } from '../../../utils/image-sizes';
import { convertImageUri } from '../../../utils/convert-image-uri';
import { Picture as PictureProps } from '../../../model/picture';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

const Figure = styled.figure`
  position: relative;
  margin: 0;
`;

const Img = styled.img.attrs({ className: 'image' })`
  display: block;
`;

type Props = {
  images: PictureProps[];
  isFull: boolean;
};

export const Picture: FunctionComponent<Props> = ({
  images,
  isFull = false,
}: Props) => {
  const lastImage = images[images.length - 1];
  const { tasl } = lastImage;

  return (
    <Figure>
      <picture>
        {images.map(image => {
          if (image.width) {
            const sizes = imageSizes(image.width);
            return (
              <source
                key={image.contentUrl}
                media={image.minWidth ? `(min-width: ${image.minWidth})` : ''}
                sizes="100vw"
                srcSet={sizes
                  .map(size => {
                    return (
                      image.contentUrl &&
                      `${convertImageUri(image.contentUrl, size)} ${size}w`
                    );
                  })
                  .join(', ')}
              />
            );
          }
        })}

        {lastImage && lastImage.contentUrl && (
          <Img
            src={convertImageUri(lastImage.contentUrl, 1200)}
            alt={lastImage.alt || ''}
          />
        )}
      </picture>
      {tasl && <Tasl {...tasl} positionTop={isFull} />}
    </Figure>
  );
};

export default Picture;
