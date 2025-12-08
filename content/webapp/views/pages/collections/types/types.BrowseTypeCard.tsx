import Link from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { BrowseType } from '@weco/content/data/browse/types';
import ImagePlaceholder from '@weco/content/views/components/ImagePlaceholder';

const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.color('warmNeutral.300')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  overflow: hidden;
  text-decoration: none;
  color: ${props => props.theme.color('black')};
  transition: transform 200ms ease;

  &:hover,
  &:focus {
    transform: translateY(-2px);

    h2,
    h3 {
      text-decoration: underline;
      text-decoration-color: ${props => props.theme.color('black')};
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: ${props => props.theme.color('neutral.700')};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ContentWrapper = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3.attrs<{ $size: 'large' | 'medium' | 'small' }>(
  props => ({
    className: font('brand', props.$size === 'large' ? 2 : 1),
  })
)<{ $size: 'large' | 'medium' | 'small' }>`
  margin: 0 0 ${props => props.theme.spacingUnit}px 0;
`;

const Description = styled.p.attrs({
  className: font('sans', -1),
})`
  margin: 0 0 ${props => props.theme.spacingUnit * 2}px 0;
`;

const WorkCount = styled.p.attrs({
  className: font('sans', -2),
})`
  margin: 0;
  margin-top: auto;
  color: ${props => props.theme.color('neutral.600')};
`;

type Props = {
  type: BrowseType;
};

const BrowseTypeCard: FunctionComponent<Props> = ({ type }) => {
  const url = `/collections/types/${type.slug}`;
  const formattedCount = type.workCount.toLocaleString();

  return (
    <CardLink href={url} data-component="browse-type-card">
      <ImageContainer>
        {type.imageUrl ? (
          <Image src={type.imageUrl} alt="" loading="lazy" />
        ) : (
          <ImagePlaceholder backgroundColor="accent.purple" />
        )}
      </ImageContainer>

      <ContentWrapper>
        <Title $size={type.size}>{type.label}</Title>
        <Description>{type.description}</Description>
        <WorkCount>{formattedCount} items</WorkCount>
      </ContentWrapper>
    </CardLink>
  );
};

export default BrowseTypeCard;
