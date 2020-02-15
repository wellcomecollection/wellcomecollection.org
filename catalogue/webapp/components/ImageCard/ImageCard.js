// @flow
import NextLink from 'next/link';
import { useContext } from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import type { Props as ImageProps } from '@weco/common/views/components/Image/Image';
import Image from '@weco/common/views/components/Image/Image';
import Space from '@weco/common/views/components/styled/Space';
import { workLink } from '@weco/common/services/catalogue/routes';
import styled from 'styled-components';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

type Props = {|
  id: string,
  image: ImageProps,
  onClick: (event: SyntheticEvent<HTMLAnchorElement>) => void,
|};

const ImageWrap = styled(Space).attrs({
  h: { size: 'l', properties: ['margin-right'] },
  v: { size: 'l', properties: ['margin-bottom'] },
})`
  height: 25vw;
  max-height: 300px;

  ${props => props.theme.media.medium`
    height: 20vw;
  `}

  ${props => props.theme.media.large`
    height: 15vw;
  `}

  ${props => props.theme.media.xlarge`
    height: 10vw;
  `}

  img {
    height: 100%;
    width: auto;
  }
`;

const ImageCard = ({ id, image, onClick }: Props) => {
  const { isEnhanced } = useContext(AppContext);

  return (
    <NextLink {...workLink({ id })}>
      <a
        onClick={event => {
          trackEvent({
            category: 'ImageCard',
            action: 'open ExpandedImage modal',
            label: id,
          });

          onClick(event);
        }}
        id={id}
        title={isEnhanced ? 'Open modal window' : null}
      >
        <ImageWrap>
          <Image {...image} />
        </ImageWrap>
      </a>
    </NextLink>
  );
};

export default ImageCard;
