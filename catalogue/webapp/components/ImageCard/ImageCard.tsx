import { FC, SyntheticEvent, useContext } from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';

import { trackEvent } from '@weco/common/utils/ga';
import { ImageType } from '@weco/common/model/image';

import IIIFImage from '../IIIFImage/IIIFImage';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { toLink as imageLink } from '@weco/common/views/components/ImageLink/ImageLink';

type Props = {
  id: string;
  workId: string;
  image: ImageType;
  onClick: (event: SyntheticEvent<HTMLAnchorElement>) => void;
};

const StyledLink = styled.a`
  display: block;
  position: relative;
`;

const ImageCard: FC<Props> = ({ id, image, onClick, workId }: Props) => {
  const { isEnhanced } = useContext(AppContext);

  return (
    <NextLink {...imageLink({ id, workId }, 'images_search_result')} passHref>
      <StyledLink
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
        <IIIFImage image={image} layout="fixed" />
      </StyledLink>
    </NextLink>
  );
};

export default ImageCard;
