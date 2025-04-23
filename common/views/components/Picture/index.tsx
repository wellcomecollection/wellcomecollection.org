import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { Picture as PictureProps } from '@weco/common/model/picture';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { imageSizes } from '@weco/common/utils/image-sizes';
import Tasl from '@weco/common/views/components/Tasl';

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
          return null;
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
