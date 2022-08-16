import { FC, SyntheticEvent, useContext, useState } from 'react';
import NextLink from 'next/link';
import { trackEvent } from '@weco/common/utils/ga';
import { ImageType } from '@weco/common/model/image';
import IIIFImage from '../IIIFImage/IIIFImage';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { toLink as imageLink } from '@weco/common/views/components/ImageLink/ImageLink';

type Props = {
  id: string;
  workId: string;
  image: ImageType;
  isScroller?: boolean;
  onClick: (event: SyntheticEvent<HTMLAnchorElement>) => void;
};

type StyledLinkProps = {
  imageWidth: number;
  imageHeight: number;
  thumbHeight: number;
};

const StyledLink = styled.a<StyledLinkProps>`
  display: inline-block;
  width: ${props =>
    `${(props.imageWidth / props.imageHeight) * props.thumbHeight}px`};
  height: ${props => props.thumbHeight}px;
  position: relative;
`;

const ImageCard: FC<Props> = ({
  id,
  image,
  onClick,
  workId,
  isScroller,
}: Props) => {
  const { isEnhanced } = useContext(AppContext);
  const [imageWidth, setImageWidth] = useState(300);
  const [imageHeight, setImageHeight] = useState(300);

  const ImageWrap = styled(Space).attrs({
    h: { size: 'l', properties: ['margin-right'] },
    ...(!isScroller && { v: { size: 'l', properties: ['margin-bottom'] } }),
  })``;

  return (
    <ImageWrap>
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
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          thumbHeight={isScroller ? 240 : 156}
        >
          <IIIFImage
            image={image}
            layout="fill"
            sizes={{
              xlarge: 1 / 6,
              large: 1 / 6,
              medium: 1 / 3,
              small: 1 / 3,
            }}
            onLoadingComplete={({ naturalWidth, naturalHeight }) => {
              setImageWidth(naturalWidth);
              setImageHeight(naturalHeight);
            }}
          />
        </StyledLink>
      </NextLink>
    </ImageWrap>
  );
};

export default ImageCard;
