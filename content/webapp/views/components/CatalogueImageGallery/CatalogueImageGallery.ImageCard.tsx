import NextLink from 'next/link';
import { FunctionComponent, SyntheticEvent } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { ImageType } from '@weco/common/model/image';
import IIIFImage from '@weco/content/views/components/IIIFImage';
import { toWorksImagesLink } from '@weco/content/views/components/ImageLink';

type Props = {
  id: string;
  workId: string;
  image: ImageType;
  layout: 'raw' | 'fixed';
  onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
  background?: string;
  positionInList: number;
};

const StyledLink = styled.a`
  position: relative;
  display: block;
  max-width: 100%;
`;

const ImageCard: FunctionComponent<Props> = ({
  id,
  workId,
  image,
  layout,
  onClick,
  background,
  positionInList,
}: Props) => {
  const { isEnhanced } = useAppContext();

  return (
    <NextLink {...toWorksImagesLink({ id, workId })} passHref legacyBehavior>
      <StyledLink
        style={{ width: image.width }} // this is here to prevent the generation of multiple styles
        onClick={event => {
          if (onClick) {
            onClick(event);
          }
        }}
        id={id}
        data-gtm-trigger="open_image_modal"
        data-gtm-position-in-list={positionInList}
        title={isEnhanced ? 'Open modal window' : undefined}
      >
        <IIIFImage
          image={{
            contentUrl: image.contentUrl,
            width: image.width,
            height: image.height,
            alt: image.alt,
          }}
          width={300}
          layout={layout}
          background={background}
        />
      </StyledLink>
    </NextLink>
  );
};

export default ImageCard;
