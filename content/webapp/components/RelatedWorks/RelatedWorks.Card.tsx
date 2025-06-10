import { FunctionComponent } from 'react';

import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import LabelsList from '@weco/common/views/components/LabelsList';
import WorkLink from '@weco/content/components/WorkLink';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';

import {
  Card,
  ImageWrapper,
  LineClamp,
  MetaContainer,
  TextWrapper,
  Title,
} from './RelatedWorks.styles';

type Props = {
  work: WorkBasic;
  resultIndex: number;
};

const RelatedWorksCard: FunctionComponent<Props> = ({ work, resultIndex }) => {
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
        {thumbnail && (
          <ImageWrapper>
            <img
              src={convertIiifImageUri(thumbnail.url, 120)}
              alt={work.title}
              loading="lazy"
              width="200"
              height="200"
            />
          </ImageWrapper>
        )}
        {resultIndex === 0 && (
          <svg style={{ visibility: 'hidden' }} width="0" height="0">
            <defs>
              <filter id="border-radius-mask">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="2"
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
        )}{' '}
      </Card>
    </WorkLink>
  );
};

export default RelatedWorksCard;
