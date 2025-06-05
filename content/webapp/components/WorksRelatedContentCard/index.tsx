import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import LabelsList from '@weco/common/views/components/LabelsList';
import WorkLink from '@weco/content/components/WorkLink';
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

const minGridCellWidth = '400px';
const maxTextWrapperWidth = '270px';

const Card = styled.a`
  display: flex;
  padding: 8px;
  background-color: ${props => props.theme.color('white')};
  border-radius: 4px;
  flex-wrap: wrap;
  text-decoration: none;

  @container (min-width: ${minGridCellWidth}) {
    height: 160px;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  padding-top: 8px;
  flex-direction: column;
  width: 100%;
  container-type: inline-size;
  container-name: text-wrapper;

  @container grid-cell (min-width: ${minGridCellWidth}) {
    padding-top: 0;
  }

  li > div {
    justify-content: space-between;

    @container text-wrapper (max-width: ${maxTextWrapperWidth}) {
      max-width: 116px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const Title = styled.h2.attrs({
  className: font('intb', 5),
})<{ $linesToClamp: number }>`
  ${clampLineStyles};
  margin-top: 4px;

  ${Card}:hover & {
    text-decoration: underline;
  }
`;

const LineClamp = styled.div<{ $linesToClamp: number }>`
  ${clampLineStyles};
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-height: 400px;
  order: -1;
  margin-left: 8px;

  img {
    display: block;
    object-fit: contain;
    width: 100%;
    max-height: 100%;
    filter: url('#filter-radius');

    @container (min-width: ${minGridCellWidth}) {
      width: unset;
      height: 100%;
      max-height: unset;
      max-width: stretch;
      justify-self: end;
    }
  }

  @container (min-width: ${minGridCellWidth}) {
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
    <WorkLink
      id={work.id}
      resultPosition={resultIndex}
      source={`works_search_result_${work.id}`}
      passHref
    >
      <Card data-gtm-position-in-list={resultIndex + 1}>
        <TextWrapper>
          <div>
            <LabelsList
              labels={cardLabels}
              defaultLabelColor="warmNeutral.300"
            />
            <Title $linesToClamp={3}>{title}</Title>
          </div>

          <MetaContainer>
            {primaryContributorLabel && (
              <LineClamp $linesToClamp={1}>{primaryContributorLabel}</LineClamp>
            )}
            {productionDates.length > 0 && (
              <LineClamp $linesToClamp={1}>
                Date: {productionDates[0]}
              </LineClamp>
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
        {resultIndex === 0 && (
          <svg style={{ visibility: 'hidden' }} width="0" height="0">
            <defs>
              <filter id="filter-radius">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="4"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 100 -50"
                  result="mask"
                />
                <feComposite in="SourceGraphic" in2="mask" operator="atop" />
              </filter>
            </defs>
          </svg>
        )}
      </Card>
    </WorkLink>
  );
};

export default WorksRelatedContentCard;
