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
  layout: 'raw' | 'fill' | 'fixed';
  onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
};

const StyledLink = styled.a<{ isFullSupportBrowser: boolean }>`
  position: relative;
  display: block;

  ${props =>
    !props.isFullSupportBrowser &&
    `
    width: 156px;
    height: 156px;`}
`;

const ImageCard: FC<Props> = ({
  id,
  workId,
  image,
  layout,
  onClick,
}: Props) => {
  const { isEnhanced, isFullSupportBrowser } = useContext(AppContext);

  return (
    <NextLink {...imageLink({ id, workId }, 'images_search_result')} passHref>
      <StyledLink
        onClick={event => {
          trackEvent({
            category: 'ImageCard',
            action: 'open ExpandedImage modal',
            label: id,
          });
          if (onClick) onClick(event);
        }}
        id={id}
        title={isEnhanced ? 'Open modal window' : undefined}
        isFullSupportBrowser={isFullSupportBrowser}
      >
        <IIIFImage image={image} layout={layout} />
      </StyledLink>
    </NextLink>
  );
};

export default ImageCard;
