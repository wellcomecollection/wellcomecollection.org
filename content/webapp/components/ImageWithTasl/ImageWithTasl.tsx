import { FC, ReactElement } from 'react';
import Tasl, {
  MarkUpProps as TaslProps,
} from '@weco/common/views/components/Tasl/Tasl';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import HeightRestrictedPrismicImage from '@weco/common/views/components/HeightRestrictedPrismicImage/HeightRestrictedPrismicImage';
type Props = {
  Image: ReactElement<
    typeof PrismicImage | typeof HeightRestrictedPrismicImage
  >;
  tasl?: TaslProps;
};
const ImageWithTasl: FC<Props> = ({ Image, tasl }) => {
  return (
    <div className="relative">
      {Image}
      {tasl && <Tasl {...tasl} />}
    </div>
  );
};

export default ImageWithTasl;
