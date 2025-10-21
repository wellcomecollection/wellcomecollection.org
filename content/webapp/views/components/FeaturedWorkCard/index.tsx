import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import ImagePlaceholder from '@weco/content/views/components/ImagePlaceholder';

const CardWrapper = styled.a`
  display: flex;
  flex-direction: column;
  width: 300px;
  flex-shrink: 0;
  background-color: ${props => props.theme.color('warmNeutral.300')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  overflow: hidden;
  text-decoration: none;
  color: ${props => props.theme.color('black')};
  transition: transform 200ms ease;

  &:hover,
  &:focus {
    h3 {
      text-decoration: underline;
      text-decoration-color: ${props => props.theme.color('black')};
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background-color: ${props => props.theme.color('neutral.700')};
`;

const LabelsWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const ContentWrapper = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3.attrs({
  className: font('wb', 5),
})`
  margin: 0 0 ${props => props.theme.spacingUnit}px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Metadata = styled.p.attrs({
  className: font('intr', 6),
})`
  margin: 0;
  color: ${props => props.theme.color('neutral.600')};
`;

type Props = {
  work: WorkBasic;
};

const FeaturedWorkCard: FunctionComponent<Props> = ({ work }) => {
  const workUrl = `/works/${work.id}`;

  return (
    <CardWrapper
      href={workUrl}
      data-component="featured-work-card"
      data-gtm-trigger="card_link"
    >
      <ImageContainer>
        {work.thumbnail ? (
          <PrismicImage
            image={{
              contentUrl: work.thumbnail.url,
              width: 300,
              height: 225,
              alt: '',
            }}
            sizes={{
              xlarge: 300,
              large: 300,
              medium: 300,
              small: 300,
            }}
            quality="low"
          />
        ) : (
          <ImagePlaceholder color="neutral.700" />
        )}
        {work.cardLabels && work.cardLabels.length > 0 && (
          <LabelsWrapper>
            <LabelsList labels={work.cardLabels} />
          </LabelsWrapper>
        )}
      </ImageContainer>

      <ContentWrapper>
        <Title>{work.title}</Title>
        <div>
          {work.primaryContributorLabel && (
            <Metadata>{work.primaryContributorLabel}</Metadata>
          )}
          {work.productionDates && work.productionDates.length > 0 && (
            <Metadata>{work.productionDates.join(', ')}</Metadata>
          )}
        </div>
      </ContentWrapper>
    </CardWrapper>
  );
};

export default FeaturedWorkCard;
