import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { classNames } from '@weco/common/utils/classnames';
import { FunctionComponent, ReactElement } from 'react';
import PrismicImage, {
  BreakpointSizes,
  ImageQuality,
} from '@weco/common/views/components/PrismicImage/PrismicImage';
import { ImageType } from '@weco/common/model/image';

const BookPromoImageContainer = styled.div.attrs({
  className: classNames({
    'bg-cream relative': true,
  }),
})`
  height: 0;
  padding-top: 100%;
  transform: rotate(-2deg);
`;

const BookPromoImage = styled(Space).attrs({
  className: classNames({
    absolute: true,
  }),
})`
  width: 66%;
  left: 50%;
  transform: translateX(-50%) rotate(2deg);
`;

type Props = {
  image: ImageType;
  sizes: BreakpointSizes;
  quality: ImageQuality;
};

const BookImage: FunctionComponent<Props> = ({
  image,
  sizes,
  quality,
}: Props): ReactElement<Props> => {
  return (
    <BookPromoImageContainer>
      {image.contentUrl && (
        <BookPromoImage v={{ size: 'l', properties: ['bottom'] }}>
          <PrismicImage
            image={{
              contentUrl: image.contentUrl || '',
              width: image.width,
              height: image.height,
              alt: image?.alt,
            }}
            sizes={sizes}
            quality={quality}
          />
        </BookPromoImage>
      )}
    </BookPromoImageContainer>
  );
};

export default BookImage;
