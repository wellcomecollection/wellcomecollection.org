import { FC } from 'react';
import Tasl from '@weco/common/views/components/Tasl/Tasl';
import PrismicImage, {
  Props,
} from '@weco/common/views/components/PrismicImage/PrismicImage';

const PrismicImageWithTasl: FC<Props> = ({ image, sizes, quality }) => {
  return (
    <div className="relative">
      <PrismicImage image={image} sizes={sizes} quality={quality} />
      <Tasl {...image.tasl} />
    </div>
  );
};

export default PrismicImageWithTasl;
