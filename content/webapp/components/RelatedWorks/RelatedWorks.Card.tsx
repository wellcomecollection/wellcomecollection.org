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
  gtmData: {
    cardIndex: number;
    categoryName: string;
    categoryPosition: number;
  };
};

const RelatedWorksCard: FunctionComponent<Props> = ({ work, gtmData }) => {
  const {
    productionDates,
    title,
    cardLabels,
    thumbnail,
    primaryContributorLabel,
  } = work;

  return (
    <WorkLink id={work.id} source={`works_search_result_${work.id}`} passHref>
      <Card
        data-gtm-trigger="related_card_result"
        data-gtm-result-id={work.id}
        data-gtm-label={gtmData.categoryName}
        data-gtm-category-position-in-list={gtmData.categoryPosition}
        data-gtm-position-in-list={gtmData.cardIndex}
      >
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
      </Card>
    </WorkLink>
  );
};

export default RelatedWorksCard;
