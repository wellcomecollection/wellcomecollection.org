import { ComponentProps, FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

import PrismicImage from '@weco/common/views/components/PrismicImage';
import Tasl from '@weco/common/views/components/Tasl';
import HeightRestrictedPrismicImage from '@weco/content/components/HeightRestrictedPrismicImage';

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
