import { FunctionComponent, SyntheticEvent, useContext } from 'react';
import NextLink from 'next/link';
import styled from 'styled-components';

import { trackGaEvent } from '@weco/common/utils/ga';
import { ImageType } from '@weco/common/model/image';

import IIIFImage from '../IIIFImage/IIIFImage';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { toLink as imageLink } from '@weco/common/views/components/ImageLink/ImageLink';

type Props = {
  id: string;
  workId: string;
  image: ImageType;
  layout: 'raw' | 'fill' | 'fixed';
  onClick: (event: SyntheticEvent<HTMLAnchorElement>) => void;
  background?: string;
};

const StyledLink = styled.a<{
  width: number;
  height: number;
}>`
  position: relative;
  display: block;

  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

const ImageCard: FunctionComponent<Props> = ({
  id,
  workId,
  image,
  layout,
  onClick,
  background,
}: Props) => {
  const { isEnhanced } = useContext(AppContext);

  return (
    <NextLink {...imageLink({ id, workId }, 'images_search_result')} passHref>
      <StyledLink
        onClick={event => {
          trackGaEvent({
            category: 'ImageCard',
            action: 'open ExpandedImage modal',
            label: id,
          });
          if (onClick) onClick(event);
        }}
        id={id}
        title={isEnhanced ? 'Open modal window' : undefined}
        width={image.width}
        height={image.height}
      >
        <IIIFImage image={image} layout={layout} background={background} />
      </StyledLink>
    </NextLink>
  );
};

export default ImageCard;
