import { SyntheticEvent, useContext } from 'react';
import NextLink from 'next/link';

import { trackEvent } from '@weco/common/utils/ga';
import Image, {
  Props as ImageProps,
} from '@weco/common/views/components/Image/Image';

import Space from '@weco/common/views/components/styled/Space';
import { toLink as imageLink } from '@weco/common/views/components/ImageLink/ImageLink';
import styled from 'styled-components';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

type Props = {
  id: string;
  workId: string;
  image: ImageProps;
  onClick: (event: SyntheticEvent<HTMLAnchorElement>) => void;
};

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
  noscript { display: inline; }
`;

const ImageCard = ({ id, image, onClick, workId }: Props) => {
  const { isEnhanced } = useContext(AppContext);

  return (
    <NextLink {...imageLink({ id, workId }, 'images_search_result')}>
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
        title={isEnhanced ? 'Open modal window' : undefined}
      >
        <ImageWrap>
          <Image {...image} />
        </ImageWrap>
      </a>
    </NextLink>
  );
};

export default ImageCard;
