import { ComponentProps, FunctionComponent, ReactElement } from 'react';
import Tasl from '@weco/common/views/components/Tasl/Tasl';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import HeightRestrictedPrismicImage from '@weco/content/components/HeightRestrictedPrismicImage/HeightRestrictedPrismicImage';
import styled from 'styled-components';

type TaslProps = ComponentProps<typeof Tasl>;

const ImageWrapper = styled.div`
  position: relative;
`;

type Props = {
  Image: ReactElement<
    typeof PrismicImage | typeof HeightRestrictedPrismicImage
  >;
  tasl?: TaslProps;
};

const ImageWithTasl: FunctionComponent<Props> = ({ Image, tasl }) => (
  <ImageWrapper>
    {Image}
    {tasl && <Tasl {...tasl} />}
  </ImageWrapper>
);

export default ImageWithTasl;
