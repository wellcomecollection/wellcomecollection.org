import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import LabelsList from '@weco/common/views/components/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';

type Props = {
  work: WorkBasic;
  resultIndex: number;
};

const clampLineStyles = css<{ $linesToClamp: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: ${props => props.$linesToClamp};
`;

const minContainerWidth = '400px';

const Card = styled.div`
  display: flex;
  background-color: ${props => props.theme.color('white')};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
  flex-wrap: wrap;

  @container (min-width: ${minContainerWidth}) {
    height: 160px;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
`;

const TextWrapper = styled(Space).attrs({
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 's', properties: ['padding-left', 'padding-right'] },
})`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  container-type: inline-size;

  li > div {
    @container (max-width: 300px) {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const Title = styled.h2.attrs({
  className: font('intb', 5),
})<{ $linesToClamp: number }>`
  ${clampLineStyles};
`;

const LineClamp = styled.div<{ $linesToClamp: number }>`
  ${clampLineStyles};
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-height: 400px;
  order: -1;

  img {
    display: block;
    object-fit: contain;
    width: 100%;
    max-height: 100%;

    @container (min-width: ${minContainerWidth}) {
      width: unset;
      height: 100%;
      max-height: unset;
      max-width: stretch;
      justify-self: end;
    }
  }

  @container (min-width: ${minContainerWidth}) {
    max-height: unset;
    width: unset;
    max-width: 50%;
    order: unset;
  }
`;

const MetaContainer = styled.div.attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.600')};
`;

const WorksRelatedContentCard: FunctionComponent<Props> = ({
  work,
  resultIndex,
}) => {
  const {
    productionDates,
    title,
    cardLabels,
    thumbnail,
    primaryContributorLabel,
  } = work;
  return (
    <Card data-gtm-position-in-list={resultIndex + 1}>
      <TextWrapper>
        <div>
          <Space $v={{ size: 'xs', properties: ['margin-bottom'] }}>
            <LabelsList
              labels={cardLabels}
              defaultLabelColor="warmNeutral.300"
            />
          </Space>
          <Title $linesToClamp={3}>{title}</Title>
        </div>

        <MetaContainer>
          {primaryContributorLabel && (
            <LineClamp $linesToClamp={1}>{primaryContributorLabel}</LineClamp>
          )}
          {productionDates.length > 0 && (
            <LineClamp $linesToClamp={1}>Date: {productionDates[0]}</LineClamp>
          )}
        </MetaContainer>
      </TextWrapper>
      <ImageWrapper>
        {thumbnail && (
          <img
            src={convertIiifImageUri(thumbnail.url, 120)}
            alt={work.title}
            loading="lazy"
            width="200"
            height="200"
          />
        )}
      </ImageWrapper>
    </Card>
  );
};

export default WorksRelatedContentCard;
